"use client";

import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookingSchema, BookingFormData, defaultBookingValues } from "@/lib/schemas/booking";
import { Step1DataDiri } from "./Step1DataDiri";
import { Step2InformasiKonsultasi } from "./Step2InformasiKonsultasi";
import { Step3JadwalKonsultasi } from "./Step3JadwalKonsultasi";
import { Step4InformasiTambahan } from "./Step4InformasiTambahan";
import { Step5Review } from "./Step5Review";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { submitBooking } from "@/app/actions/booking";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

const steps = [
  { id: "step1", title: "Data Diri" },
  { id: "step2", title: "Info Konsultasi" },
  { id: "step3", title: "Jadwal" },
  { id: "step4", title: "Info Tambahan" },
  { id: "step5", title: "Review" },
];

export function BookingWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const methods = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: defaultBookingValues,
    mode: "onTouched",
  });

  const { watch, trigger, getValues, reset } = methods;
  const formValues = watch();

  useEffect(() => {
    // Load from local storage
    const savedData = localStorage.getItem("booking-draft");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        // Ensure dates are parsed correctly
        if (parsed.tanggal_lahir) parsed.tanggal_lahir = new Date(parsed.tanggal_lahir);
        if (parsed.tanggal_konsultasi) parsed.tanggal_konsultasi = new Date(parsed.tanggal_konsultasi);
        reset(parsed);
      } catch (e) {
        console.error("Failed to parse draft", e);
      }
    }
    setIsMounted(true);
  }, [reset]);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("booking-draft", JSON.stringify(formValues));
    }
  }, [formValues, isMounted]);

  const handleNext = async () => {
    // Determine which fields to validate based on current step
    let fieldsToValidate: any[] = [];
    if (currentStep === 0) {
      fieldsToValidate = ["email", "nama_lengkap", "nama_panggilan", "tanggal_lahir", "jenis_kelamin", "nik", "nomor_hp", "alamat_lengkap", "provinsi"];
    } else if (currentStep === 1) {
      fieldsToValidate = ["status", "status_lainnya", "alasan", "alasan_lainnya", "topik_permasalahan", "topik_lainnya", "ceritakan_permasalahan"];
    } else if (currentStep === 2) {
      fieldsToValidate = ["tanggal_konsultasi", "waktu_konsultasi", "metode_konsultasi"];
    } else if (currentStep === 3) {
      fieldsToValidate = ["urutan_konseling", "sumber_informasi", "sumber_informasi_lainnya"];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      toast({
        variant: "destructive",
        title: "Terdapat kesalahan",
        description: "Mohon periksa kembali isian Anda pada langkah ini.",
      });
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onSubmit = async () => {
    const isValid = await trigger();
    if (!isValid) return;

    setIsSubmitting(true);
    try {
      const data = getValues();
      const res = await submitBooking(data);
      if (res.success && res.requestNumber) {
        localStorage.removeItem("booking-draft");
        toast({
          title: "Berhasil",
          description: "Permohonan Anda berhasil dikirim.",
        });
        
        // Save success data briefly in sessionStorage to display on success page
        sessionStorage.setItem("booking-success", JSON.stringify({
          requestNumber: res.requestNumber,
          date: data.tanggal_konsultasi,
          time: data.waktu_konsultasi,
          method: data.metode_konsultasi
        }));

        router.push("/booking/success");
      } else {
        throw new Error(res.error || "Gagal menyimpan data");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Gagal",
        description: error.message || "Terjadi kesalahan saat mengirim permohonan. Silakan coba lagi.",
      });
      setIsSubmitting(false);
    }
  };

  if (!isMounted) return null; // Prevent hydration mismatch

  return (
    <div className="max-w-3xl mx-auto w-full bg-white rounded-xl shadow-md p-6 md:p-10 border border-neutral-100">
      {/* Progress Indicator */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-2">
          {steps.map((step, idx) => (
            <div key={step.id} className="flex flex-col items-center relative z-10 w-full">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${
                  idx <= currentStep
                    ? "bg-blue-500 text-white shadow-blue"
                    : "bg-neutral-100 text-neutral-400"
                }`}
              >
                {idx + 1}
              </div>
              <span className={`text-xs mt-2 hidden md:block font-medium ${idx <= currentStep ? "text-blue-600" : "text-neutral-400"}`}>
                {step.title}
              </span>
            </div>
          ))}
        </div>
        <div className="relative w-full h-1 bg-neutral-100 rounded-full -mt-12 md:-mt-16 z-0 overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-blue-500 transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          />
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-neutral-900 mb-2">
          {steps[currentStep].title}
        </h2>
        <p className="text-neutral-500">
          Silakan lengkapi informasi di bawah ini dengan benar.
        </p>
      </div>

      <FormProvider {...methods}>
        <div className="space-y-8 animate-fade-enter">
          {currentStep === 0 && <Step1DataDiri />}
          {currentStep === 1 && <Step2InformasiKonsultasi />}
          {currentStep === 2 && <Step3JadwalKonsultasi />}
          {currentStep === 3 && <Step4InformasiTambahan />}
          {currentStep === 4 && <Step5Review />}
        </div>
      </FormProvider>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-12 pt-6 border-t border-neutral-100">
        {currentStep > 0 ? (
          <Button variant="outline" onClick={handleBack} className="rounded-full px-6 text-neutral-600">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
        ) : (
          <div />
        )}

        {currentStep < steps.length - 1 ? (
          <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700 rounded-full px-8 shadow-blue text-white">
            Selanjutnya
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={onSubmit} disabled={isSubmitting} className="bg-success hover:bg-success/90 rounded-full px-8 shadow-md text-white">
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Mengirim...
              </>
            ) : (
              "Kirim Permohonan"
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
