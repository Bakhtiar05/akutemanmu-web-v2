'use client'

import Link from 'next/link'
import ScrollReveal from '@/components/ui/ScrollReveal'

const features = [
  '1 jam sesi konseling penuh',
  'Konselor atau psikolog klinis profesional',
  'Konsultasi privat via WhatsApp',
  '100% kerahasiaan terjaga',
  'Booking mudah & pembayaran instan',
  'Tanpa komitmen jangka panjang',
]

export default function PricingSection() {
  return (
    <section id="harga" className="scroll-mt-24 py-20 md:py-28 bg-neutral-50">
      <div className="max-w-container mx-auto px-6">
        <ScrollReveal variant="fade-up" className="text-center mb-16">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-3">Harga</p>
          <h2 className="text-[clamp(1.6rem,4vw,2.4rem)] font-extrabold text-neutral-900 mb-4">
            Konseling Profesional, Harga Terjangkau
          </h2>
          <p className="text-neutral-500 max-w-lg mx-auto text-lg">
            Kami mendobrak batasan biaya agar setiap orang bisa mendapatkan akses konseling yang layak
          </p>
        </ScrollReveal>

        <ScrollReveal variant="scale" className="max-w-md mx-auto">
          <div className="relative bg-white rounded-3xl border border-neutral-100 shadow-lg overflow-hidden">
            {/* Best value badge */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white text-center py-3 px-6">
              <span className="text-sm font-bold tracking-wide">✨ Harga Terbaik di Indonesia</span>
            </div>

            <div className="p-8 md:p-10">
              {/* Price */}
              <div className="text-center mb-8">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-sm font-semibold text-neutral-400">Rp</span>
                  <span className="text-6xl md:text-7xl font-extrabold text-neutral-900 tracking-tight">20.000</span>
                </div>
                <p className="text-neutral-400 mt-2 text-base">per sesi · 1 jam konseling</p>
              </div>

              {/* Divider */}
              <div className="h-px bg-neutral-100 mb-8" />

              {/* Features */}
              <ul className="space-y-4 mb-10">
                {features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-neutral-600">{f}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href="/konsultasi"
                className="btn btn-primary w-full justify-center text-base py-4 rounded-xl"
              >
                Mulai Konseling Sekarang
              </Link>

              <p className="text-center text-xs text-neutral-400 mt-4">
                Tanpa biaya tersembunyi · Batalkan kapan saja
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
