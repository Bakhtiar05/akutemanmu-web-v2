"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { bookingSchema, BookingFormData } from "@/lib/schemas/booking";
import { format } from "date-fns";
import { createXenditInvoice } from "@/lib/services/xendit";

export async function submitBooking(data: BookingFormData) {
  try {
    console.log("[submitBooking] Server action called");

    // FIX: Next.js Server Actions serialize Date objects as ISO strings when
    // transferring from client to server. Mobile browsers are particularly
    // affected because they may serialize dates differently. We must coerce
    // string dates back to Date objects before Zod validation with z.date().
    const coercedData = {
      ...data,
      tanggal_lahir: data.tanggal_lahir instanceof Date
        ? data.tanggal_lahir
        : new Date(data.tanggal_lahir),
      tanggal_konsultasi: data.tanggal_konsultasi instanceof Date
        ? data.tanggal_konsultasi
        : new Date(data.tanggal_konsultasi),
    };

    // Validate that date coercion produced valid dates
    if (isNaN(coercedData.tanggal_lahir.getTime())) {
      console.error("[submitBooking] Invalid tanggal_lahir after coercion:", data.tanggal_lahir);
      return { success: false, error: "Tanggal lahir tidak valid. Silakan isi ulang." };
    }
    if (isNaN(coercedData.tanggal_konsultasi.getTime())) {
      console.error("[submitBooking] Invalid tanggal_konsultasi after coercion:", data.tanggal_konsultasi);
      return { success: false, error: "Tanggal konsultasi tidak valid. Silakan isi ulang." };
    }

    console.log("[submitBooking] Date coercion complete:", {
      tanggal_lahir: coercedData.tanggal_lahir.toISOString(),
      tanggal_konsultasi: coercedData.tanggal_konsultasi.toISOString(),
    });

    // Validate again on the server (now with proper Date objects)
    const parsedData = bookingSchema.parse(coercedData);
    console.log("[submitBooking] Zod validation passed");
    
    // Use admin client (service role key) to bypass RLS — the consultation_requests
    // table has RLS enabled but no INSERT policy for anonymous/public users.
    const supabase = createAdminClient();

    // Generate request number ATM-YYYYMMDD-XXXX
    const todayStr = format(new Date(), "yyyyMMdd");
    
    const randomString = Math.random().toString(36).substring(2, 6).toUpperCase();
    const requestNumber = `ATM-${todayStr}-${randomString}`;

    console.log("[submitBooking] Inserting to Supabase with request_number:", requestNumber);

    const { error: insertError, data: requestData } = await supabase
      .from("consultation_requests")
      .insert({
        request_number: requestNumber,
        
        email: parsedData.email,
        nama_lengkap: parsedData.nama_lengkap,
        nama_panggilan: parsedData.nama_panggilan,
        tanggal_lahir: format(parsedData.tanggal_lahir, "yyyy-MM-dd"),
        jenis_kelamin: parsedData.jenis_kelamin,
        nik: parsedData.nik,
        nomor_hp: parsedData.nomor_hp,
        alamat_lengkap: parsedData.alamat_lengkap,
        provinsi: parsedData.provinsi,
        
        status: parsedData.status,
        status_lainnya: parsedData.status_lainnya,
        alasan: parsedData.alasan,
        alasan_lainnya: parsedData.alasan_lainnya,
        topik_permasalahan: parsedData.topik_permasalahan,
        topik_lainnya: parsedData.topik_lainnya,
        ceritakan_permasalahan: parsedData.ceritakan_permasalahan,
        
        tanggal_konsultasi: format(parsedData.tanggal_konsultasi, "yyyy-MM-dd"),
        waktu_konsultasi: parsedData.waktu_konsultasi,
        metode_konsultasi: parsedData.metode_konsultasi,
        
        urutan_konseling: parsedData.urutan_konseling,
        sumber_informasi: parsedData.sumber_informasi,
        sumber_informasi_lainnya: parsedData.sumber_informasi_lainnya,
        db_status: "Waiting Payment",
      })
      .select("id")
      .single();

    if (insertError) {
      console.error("[submitBooking] Supabase insert error:", insertError);
      throw new Error("Gagal menyimpan permohonan ke database");
    }

    console.log("[submitBooking] Supabase insert success, id:", requestData.id);

    const consultationRequestId = requestData.id;

    // Create Xendit Invoice
    const basePriceStr = process.env.NEXT_PUBLIC_CONSULTATION_BASE_PRICE || "20000";
    const amount = parseInt(basePriceStr, 10);
    let appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://yukceritain.vercel.app";
    
    // Fallback if Vercel auto-injects dynamic preview URLs without explicit NEXT_PUBLIC_APP_URL
    if (appUrl.includes("vercel.app") && process.env.VERCEL_URL && !process.env.NEXT_PUBLIC_APP_URL) {
      appUrl = "https://yukceritain.vercel.app";
    }
    
    // External ID format INV-{requestNumber}-{timestamp}
    const externalId = `INV-${requestNumber}-${Date.now()}`;
    
    const invoiceReq = {
      external_id: externalId,
      amount: amount,
      description: `Pembayaran Konsultasi ${requestNumber} (1 Jam)`,
      customer: {
        given_names: parsedData.nama_lengkap,
        email: parsedData.email,
        mobile_number: parsedData.nomor_hp,
      },
      success_redirect_url: `${appUrl}/booking/success?request_number=${requestNumber}`,
      failure_redirect_url: `${appUrl}/booking/success?request_number=${requestNumber}`,
    };

    console.log("[submitBooking] Creating Xendit invoice...");
    const invoice = await createXenditInvoice(invoiceReq);
    console.log("[submitBooking] Xendit invoice created:", invoice.id);

    // Save payment to database
    const { error: paymentError } = await supabase
      .from("payments")
      .insert({
        consultation_request_id: consultationRequestId,
        xendit_invoice_id: invoice.id,
        external_id: externalId,
        amount: amount,
        payment_status: "PENDING",
        invoice_url: invoice.invoice_url,
        expired_at: invoice.expiry_date,
      });

    if (paymentError) {
      console.error("[submitBooking] Payment insert error:", paymentError);
      // We don't block the user, they can retry payment from status check page
    } else {
      console.log("[submitBooking] Payment record saved successfully");
    }

    console.log("[submitBooking] All steps completed successfully for:", requestNumber);
    return { success: true, requestNumber, invoiceUrl: invoice.invoice_url };
  } catch (error: unknown) {
    console.error("[submitBooking] Booking submission error:", error);
    // Surface detailed error info for Zod validation errors
    if (error && typeof error === "object" && "issues" in error) {
      console.error("[submitBooking] Zod validation issues:", JSON.stringify((error as any).issues, null, 2));
    }
    return { success: false, error: error instanceof Error ? error.message : "Terjadi kesalahan yang tidak terduga" };
  }
}

const TIME_SLOTS = [
  "09:00 - 10:00 WIB",
  "10:00 - 11:00 WIB",
  "11:00 - 12:00 WIB",
  "13:00 - 14:00 WIB",
  "14:00 - 15:00 WIB",
  "15:00 - 16:00 WIB",
];

export async function getBookedSlots(date: Date) {
  try {
    const supabase = createAdminClient();
    const dateStr = format(date, "yyyy-MM-dd");

    const { data, error } = await supabase
      .from("consultation_requests")
      .select("waktu_konsultasi")
      .eq("tanggal_konsultasi", dateStr)
      .in("db_status", ["Menunggu Verifikasi", "Disetujui"]);

    if (error) throw error;

    const bookedSlots: string[] = [];
    data.forEach((row: any) => {
      bookedSlots.push(row.waktu_konsultasi);
    });

    return bookedSlots;
  } catch (error) {
    console.error("Failed to fetch booked slots:", error);
    return [];
  }
}

import { revalidatePath } from "next/cache";

export async function updateBookingStatus(id: string, status: string) {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("consultation_requests")
      .update({ db_status: status })
      .eq("id", id);

    if (error) throw error;
    
    revalidatePath("/admin/konseling");
    return { success: true };
  } catch (error) {
    console.error("Failed to update booking status:", error);
    return { success: false, error: error instanceof Error ? error.message : "Gagal memperbarui status" };
  }
}
