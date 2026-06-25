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
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
        <h3 className="text-blue-800 font-semibold flex items-center gap-2 mb-1">
          <Info className="w-5 h-5" />
          Review Permohonan
        </h3>
        <p className="text-sm text-blue-600">
          Silakan periksa kembali data yang telah Anda masukkan sebelum mengirim permohonan.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Data Diri */}
        <div className="bg-neutral-50 rounded-lg p-5 border border-neutral-100 shadow-sm">
          <h4 className="font-semibold text-neutral-800 flex items-center gap-2 mb-4 pb-2 border-b border-neutral-200">
            <User className="w-4 h-4 text-blue-500" />
            Data Diri
          </h4>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-neutral-500">Nama Lengkap</dt>
              <dd className="font-medium text-neutral-900">{data.nama_lengkap || "-"}</dd>
            </div>
            <div>
              <dt className="text-neutral-500">Nama Panggilan</dt>
              <dd className="font-medium text-neutral-900">{data.nama_panggilan || "-"}</dd>
            </div>
            <div>
              <dt className="text-neutral-500">Email</dt>
              <dd className="font-medium text-neutral-900">{data.email || "-"}</dd>
            </div>
            <div>
              <dt className="text-neutral-500">Nomor HP</dt>
              <dd className="font-medium text-neutral-900">{data.nomor_hp || "-"}</dd>
            </div>
            <div>
              <dt className="text-neutral-500">Jenis Kelamin</dt>
              <dd className="font-medium text-neutral-900">{data.jenis_kelamin || "-"}</dd>
            </div>
            <div>
              <dt className="text-neutral-500">Tanggal Lahir</dt>
              <dd className="font-medium text-neutral-900">
                {data.tanggal_lahir ? format(data.tanggal_lahir, "dd MMMM yyyy", { locale: id }) : "-"}
              </dd>
            </div>
            <div>
              <dt className="text-neutral-500">NIK</dt>
              <dd className="font-medium text-neutral-900">{data.nik || "-"}</dd>
            </div>
            <div>
              <dt className="text-neutral-500">Alamat</dt>
              <dd className="font-medium text-neutral-900">{data.alamat_lengkap || "-"}</dd>
            </div>
            <div>
              <dt className="text-neutral-500">Provinsi</dt>
              <dd className="font-medium text-neutral-900">{getProvinceLabel(data.provinsi)}</dd>
            </div>
          </dl>
        </div>

        <div className="space-y-6">
          {/* Jadwal Konsultasi */}
          <div className="bg-neutral-50 rounded-lg p-5 border border-neutral-100 shadow-sm">
            <h4 className="font-semibold text-neutral-800 flex items-center gap-2 mb-4 pb-2 border-b border-neutral-200">
              <Calendar className="w-4 h-4 text-blue-500" />
              Jadwal & Metode
            </h4>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-neutral-500">Tanggal Konsultasi</dt>
                <dd className="font-medium text-neutral-900">
                  {data.tanggal_konsultasi ? format(data.tanggal_konsultasi, "EEEE, dd MMMM yyyy", { locale: id }) : "-"}
                </dd>
              </div>
              <div>
                <dt className="text-neutral-500">Waktu</dt>
                <dd className="font-medium text-neutral-900">{data.waktu_konsultasi || "-"}</dd>
              </div>
              <div>
                <dt className="text-neutral-500">Metode</dt>
                <dd className="font-medium text-neutral-900">{data.metode_konsultasi || "-"}</dd>
              </div>
            </dl>
          </div>

          {/* Informasi Tambahan */}
          <div className="bg-neutral-50 rounded-lg p-5 border border-neutral-100 shadow-sm">
            <h4 className="font-semibold text-neutral-800 flex items-center gap-2 mb-4 pb-2 border-b border-neutral-200">
              <Info className="w-4 h-4 text-blue-500" />
              Informasi Tambahan
            </h4>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-neutral-500">Urutan Konseling</dt>
                <dd className="font-medium text-neutral-900">{data.urutan_konseling || "-"}</dd>
              </div>
              <div>
                <dt className="text-neutral-500">Sumber Informasi</dt>
                <dd className="font-medium text-neutral-900">
                  {data.sumber_informasi === "Lainnya" ? data.sumber_informasi_lainnya : data.sumber_informasi || "-"}
                </dd>
              </div>
            </dl>
          </div>
        </div>
        
        {/* Informasi Konsultasi */}
        <div className="md:col-span-2 bg-neutral-50 rounded-lg p-5 border border-neutral-100 shadow-sm">
          <h4 className="font-semibold text-neutral-800 flex items-center gap-2 mb-4 pb-2 border-b border-neutral-200">
            <FileText className="w-4 h-4 text-blue-500" />
            Detail Permasalahan
          </h4>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-neutral-500 mb-1">Status</dt>
              <dd className="font-medium text-neutral-900">
                {data.status === "Lainnya" ? data.status_lainnya : data.status || "-"}
              </dd>
            </div>
            <div>
              <dt className="text-neutral-500 mb-1">Alasan</dt>
              <dd className="font-medium text-neutral-900">
                {data.alasan === "Lainnya" ? data.alasan_lainnya : data.alasan || "-"}
              </dd>
            </div>
            <div className="md:col-span-2">
              <dt className="text-neutral-500 mb-1">Topik Permasalahan</dt>
              <dd className="font-medium text-neutral-900">
                {data.topik_permasalahan?.length ? (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {data.topik_permasalahan.map((t) => (
                      <span key={t} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
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
              <dt className="text-neutral-500 mb-2">Gambaran Permasalahan</dt>
              <dd className="text-neutral-800 bg-white p-4 rounded border border-neutral-200 whitespace-pre-wrap leading-relaxed">
                {data.ceritakan_permasalahan || "-"}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
