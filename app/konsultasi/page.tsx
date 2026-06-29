import { Metadata } from "next";
import { BookingWizard } from "@/components/booking/BookingWizard";

export const metadata: Metadata = {
  title: "Konsultasi Psikologi | YukceritaIN",
  description: "Layanan konsultasi psikologi profesional. Booking jadwal Anda sekarang.",
};

export default function KonsultasiPage() {
  return (
    <div className="min-h-screen booking-page-bg pt-28 pb-24">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-14">
          <h1 className="text-4xl md:text-[42px] font-display font-bold text-[#0F172A] mb-5 animate-fade-enter leading-tight tracking-tight">
            Pesan Jadwal Konsultasi
          </h1>
          <p className="text-lg text-[#64748B] max-w-[650px] mx-auto animate-fade-enter leading-relaxed" style={{ animationDelay: '100ms' }}>
            Langkah awal menuju kesehatan mental yang lebih baik. Ceritakan apa yang Anda rasakan, dan kami akan membantu menemukan jalan keluarnya.
          </p>
        </div>

        <BookingWizard />
      </div>
    </div>
  );
}
