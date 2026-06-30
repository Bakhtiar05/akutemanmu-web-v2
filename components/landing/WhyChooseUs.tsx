'use client'

import ScrollReveal, { ScrollRevealItem } from '@/components/ui/ScrollReveal'

const benefits = [
  {
    icon: '🔒',
    title: '100% Rahasia',
    desc: 'Semua percakapan dan data pribadimu dilindungi sepenuhnya. Privasi adalah prioritas utama kami.',
  },
  {
    icon: '🎓',
    title: 'Tenaga Ahli Profesional',
    desc: 'Konselor dan psikolog klinis berlisensi yang berpengalaman menangani berbagai isu kesehatan mental.',
  },
  {
    icon: '💰',
    title: 'Harga Terjangkau',
    desc: 'Hanya Rp20.000 per sesi (1 jam). Kami percaya kesehatan mental tidak boleh dibatasi oleh biaya.',
  },
  {
    icon: '⚡',
    title: 'Tanpa Alur Rumit',
    desc: 'Cukup booking, bayar, dan konselor kami langsung menghubungimu. Tidak ada proses yang berbelit.',
  },
  {
    icon: '💬',
    title: 'Konsultasi via WhatsApp',
    desc: 'Tanpa perlu download aplikasi baru. Konseling dilakukan secara privat melalui WhatsApp.',
  },
  {
    icon: '🕐',
    title: 'Jadwal Fleksibel',
    desc: 'Pilih waktu konseling yang sesuai dengan kesibukanmu. Kami menyesuaikan dengan jadwalmu.',
  },
]

export default function WhyChooseUs() {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-container mx-auto px-6">
        <ScrollReveal variant="fade-up" className="text-center mb-16">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-3">Kenapa Kami?</p>
          <h2 className="text-[clamp(1.6rem,4vw,2.4rem)] font-extrabold text-neutral-900 mb-4">
            Kenapa Memilih YukceritaIN?
          </h2>
          <p className="text-neutral-500 max-w-lg mx-auto text-lg">
            Kami hadir untuk mendobrak batasan biaya dan memberikan akses konseling yang mudah untuk semua orang
          </p>
        </ScrollReveal>

        <ScrollReveal staggerChildren={0.1} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {benefits.map((b) => (
            <ScrollRevealItem key={b.title} variant="fade-up">
              <div className="group bg-neutral-50 hover:bg-white rounded-2xl p-7 border border-neutral-100 hover:border-blue-100 hover:shadow-card transition-all duration-300 hover:-translate-y-1">
                <span className="text-3xl block mb-4 group-hover:scale-110 transition-transform duration-300">{b.icon}</span>
                <h3 className="text-base font-bold text-neutral-900 mb-2">{b.title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{b.desc}</p>
              </div>
            </ScrollRevealItem>
          ))}
        </ScrollReveal>
      </div>
    </section>
  )
}
