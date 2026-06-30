'use client'

import ScrollReveal, { ScrollRevealItem } from '@/components/ui/ScrollReveal'

const testimonials = [
  {
    name: 'Siti Aulia',
    role: 'Mahasiswi, Jakarta',
    initials: 'SA',
    gradient: 'from-pink-400 to-purple-500',
    quote: 'Awalnya ragu karena harganya sangat terjangkau, tapi kualitas konselornya luar biasa. Saya merasa benar-benar didengar dan dimengerti. Terima kasih YukceritaIN!',
  },
  {
    name: 'Rizki Handoko',
    role: 'Karyawan Swasta, Bandung',
    initials: 'RH',
    gradient: 'from-blue-400 to-blue-600',
    quote: 'Prosesnya simpel banget. Booking, bayar Rp20.000, langsung dihubungi via WhatsApp. Nggak perlu ribet download aplikasi lain. Sangat membantu di saat butuh tempat cerita.',
    featured: true,
  },
  {
    name: 'Dian Pratiwi',
    role: 'Ibu Rumah Tangga, Surabaya',
    initials: 'DP',
    gradient: 'from-emerald-400 to-teal-500',
    quote: 'Sebagai ibu, kadang saya butuh tempat untuk bercerita tanpa dihakimi. Di sini saya menemukan ruang aman itu. Konselor-nya profesional dan sangat pengertian.',
  },
]

export default function TestimonialsSection() {
  return (
    <section id="testimoni" className="scroll-mt-24 py-20 md:py-28 bg-white">
      <div className="max-w-container mx-auto px-6">
        <ScrollReveal variant="fade-up" className="text-center mb-16">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-3">Testimoni</p>
          <h2 className="text-[clamp(1.6rem,4vw,2.4rem)] font-extrabold text-neutral-900 mb-4">
            Cerita Mereka yang Telah Terbantu
          </h2>
          <p className="text-neutral-500 max-w-lg mx-auto text-lg">
            Ribuan orang telah menemukan ruang aman mereka bersama YukceritaIN
          </p>
        </ScrollReveal>

        <ScrollReveal staggerChildren={0.12} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <ScrollRevealItem key={t.name} variant="fade-up">
              <div
                className={`rounded-2xl p-8 border transition-all duration-300 hover:-translate-y-1 ${
                  t.featured
                    ? 'bg-gradient-to-br from-blue-600 to-blue-700 border-transparent text-white shadow-blue hover:shadow-blue-lg'
                    : 'bg-white border-neutral-100 shadow-sm hover:shadow-card hover:border-blue-50'
                }`}
              >
                {/* Stars */}
                <div className="flex gap-0.5 mb-5">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`text-lg ${t.featured ? 'text-yellow-300' : 'text-yellow-400'}`}>★</span>
                  ))}
                </div>

                <p className={`text-sm leading-relaxed mb-8 ${t.featured ? 'text-blue-50' : 'text-neutral-600'}`}>
                  &ldquo;{t.quote}&rdquo;
                </p>

                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                    {t.initials}
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${t.featured ? 'text-white' : 'text-neutral-900'}`}>{t.name}</p>
                    <p className={`text-xs ${t.featured ? 'text-blue-200' : 'text-neutral-400'}`}>{t.role}</p>
                  </div>
                </div>
              </div>
            </ScrollRevealItem>
          ))}
        </ScrollReveal>
      </div>
    </section>
  )
}
