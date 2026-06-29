import { useFormContext, useWatch } from "react-hook-form";
import { BookingFormData } from "@/lib/schemas/booking";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { provinces } from "@/lib/data-provinces";
import { User, FileText, Calendar, MessageSquare, Info } from "lucide-react";

export function Step5Review() {
  const { control } = useFormContext<BookingFormData>();
  const data = useWatch({ control });

  const getProvinceLabel = (val?: string) => {
    return provinces.find((p) => p.value === val)?.label || val;
  };

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-[#EFF6FF] to-[#F0F4FF] border border-[#BFDBFE] rounded-2xl p-5 mb-6">
        <h3 className="text-[#1E40AF] font-semibold flex items-center gap-2.5 mb-1.5 text-[15px]">
          <Info className="w-5 h-5" />
          Review Permohonan
        </h3>
        <p className="text-sm text-[#3B82F6]">
          Silakan periksa kembali data yang telah Anda masukkan sebelum mengirim permohonan.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Data Diri */}
        <div className="bg-[#F8FAFC] rounded-2xl p-6 border border-[#E2E8F0] shadow-sm">
          <h4 className="font-semibold text-[#0F172A] flex items-center gap-2.5 mb-5 pb-3 border-b border-[#E2E8F0] text-[15px]">
            <User className="w-4 h-4 text-[#2563EB]" />
            Data Diri
          </h4>
          <dl className="space-y-4 text-sm">
            <div>
              <dt className="text-[#64748B] text-[13px]">Nama Lengkap</dt>
              <dd className="font-medium text-[#0F172A] mt-0.5">{data.nama_lengkap || "-"}</dd>
            </div>
            <div>
              <dt className="text-[#64748B] text-[13px]">Nama Panggilan</dt>
              <dd className="font-medium text-[#0F172A] mt-0.5">{data.nama_panggilan || "-"}</dd>
            </div>
            <div>
              <dt className="text-[#64748B] text-[13px]">Email</dt>
              <dd className="font-medium text-[#0F172A] mt-0.5">{data.email || "-"}</dd>
            </div>
            <div>
              <dt className="text-[#64748B] text-[13px]">Nomor HP</dt>
              <dd className="font-medium text-[#0F172A] mt-0.5">{data.nomor_hp || "-"}</dd>
            </div>
            <div>
              <dt className="text-[#64748B] text-[13px]">Jenis Kelamin</dt>
              <dd className="font-medium text-[#0F172A] mt-0.5">{data.jenis_kelamin || "-"}</dd>
            </div>
            <div>
              <dt className="text-[#64748B] text-[13px]">Tanggal Lahir</dt>
              <dd className="font-medium text-[#0F172A] mt-0.5">
                {data.tanggal_lahir ? format(data.tanggal_lahir, "dd MMMM yyyy", { locale: id }) : "-"}
              </dd>
            </div>
            <div>
              <dt className="text-[#64748B] text-[13px]">NIK</dt>
              <dd className="font-medium text-[#0F172A] mt-0.5">{data.nik || "-"}</dd>
            </div>
            <div>
              <dt className="text-[#64748B] text-[13px]">Alamat</dt>
              <dd className="font-medium text-[#0F172A] mt-0.5">{data.alamat_lengkap || "-"}</dd>
            </div>
            <div>
              <dt className="text-[#64748B] text-[13px]">Provinsi</dt>
              <dd className="font-medium text-[#0F172A] mt-0.5">{getProvinceLabel(data.provinsi)}</dd>
            </div>
          </dl>
        </div>

        <div className="space-y-6">
          {/* Jadwal Konsultasi */}
          <div className="bg-[#F8FAFC] rounded-2xl p-6 border border-[#E2E8F0] shadow-sm">
            <h4 className="font-semibold text-[#0F172A] flex items-center gap-2.5 mb-5 pb-3 border-b border-[#E2E8F0] text-[15px]">
              <Calendar className="w-4 h-4 text-[#2563EB]" />
              Jadwal & Metode
            </h4>
            <dl className="space-y-4 text-sm">
              <div>
                <dt className="text-[#64748B] text-[13px]">Tanggal Konsultasi</dt>
                <dd className="font-medium text-[#0F172A] mt-0.5">
                  {data.tanggal_konsultasi ? format(data.tanggal_konsultasi, "EEEE, dd MMMM yyyy", { locale: id }) : "-"}
                </dd>
              </div>
              <div>
                <dt className="text-[#64748B] text-[13px]">Waktu</dt>
                <dd className="font-medium text-[#0F172A] mt-0.5">{data.waktu_konsultasi || "-"}</dd>
              </div>
              <div>
                <dt className="text-[#64748B] text-[13px]">Metode</dt>
                <dd className="font-medium text-[#0F172A] mt-0.5">{data.metode_konsultasi || "-"}</dd>
              </div>
            </dl>
          </div>

          {/* Informasi Tambahan */}
          <div className="bg-[#F8FAFC] rounded-2xl p-6 border border-[#E2E8F0] shadow-sm">
            <h4 className="font-semibold text-[#0F172A] flex items-center gap-2.5 mb-5 pb-3 border-b border-[#E2E8F0] text-[15px]">
              <Info className="w-4 h-4 text-[#2563EB]" />
              Informasi Tambahan
            </h4>
            <dl className="space-y-4 text-sm">
              <div>
                <dt className="text-[#64748B] text-[13px]">Urutan Konseling</dt>
                <dd className="font-medium text-[#0F172A] mt-0.5">{data.urutan_konseling || "-"}</dd>
              </div>
              <div>
                <dt className="text-[#64748B] text-[13px]">Sumber Informasi</dt>
                <dd className="font-medium text-[#0F172A] mt-0.5">
                  {data.sumber_informasi === "Lainnya" ? data.sumber_informasi_lainnya : data.sumber_informasi || "-"}
                </dd>
              </div>
            </dl>
          </div>
        </div>
        
        {/* Informasi Konsultasi */}
        <div className="md:col-span-2 bg-[#F8FAFC] rounded-2xl p-6 border border-[#E2E8F0] shadow-sm">
          <h4 className="font-semibold text-[#0F172A] flex items-center gap-2.5 mb-5 pb-3 border-b border-[#E2E8F0] text-[15px]">
            <FileText className="w-4 h-4 text-[#2563EB]" />
            Detail Permasalahan
          </h4>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
            <div>
              <dt className="text-[#64748B] text-[13px] mb-1">Status</dt>
              <dd className="font-medium text-[#0F172A]">
                {data.status === "Lainnya" ? data.status_lainnya : data.status || "-"}
              </dd>
            </div>
            <div>
              <dt className="text-[#64748B] text-[13px] mb-1">Alasan</dt>
              <dd className="font-medium text-[#0F172A]">
                {data.alasan === "Lainnya" ? data.alasan_lainnya : data.alasan || "-"}
              </dd>
            </div>
            <div className="md:col-span-2">
              <dt className="text-[#64748B] text-[13px] mb-2">Topik Permasalahan</dt>
              <dd className="font-medium text-[#0F172A]">
                {data.topik_permasalahan?.length ? (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {data.topik_permasalahan.map((t) => (
                      <span key={t} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#DBEAFE] text-[#1E40AF] border border-[#BFDBFE]">
                        {t === "Lainnya" ? data.topik_lainnya : t}
                      </span>
                    ))}
                  </div>
                ) : (
                  "-"
                )}
              </dd>
            </div>
            <div className="md:col-span-2 mt-2">
              <dt className="text-[#64748B] text-[13px] mb-2">Gambaran Permasalahan</dt>
              <dd className="text-[#334155] bg-white p-5 rounded-xl border border-[#E2E8F0] whitespace-pre-wrap leading-relaxed text-[15px]">
                {data.ceritakan_permasalahan || "-"}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
