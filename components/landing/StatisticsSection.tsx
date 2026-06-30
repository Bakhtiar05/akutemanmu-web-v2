'use client'

import { useEffect, useRef, useState } from 'react'
import ScrollReveal, { ScrollRevealItem } from '@/components/ui/ScrollReveal'

function useCountUp(target: number, suffix: string, duration = 1600) {
  const [display, setDisplay] = useState('0' + suffix)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const start = performance.now()
          const animate = (now: number) => {
            const progress = Math.min((now - start) / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            const value = Math.round(eased * target)
            setDisplay(value.toLocaleString('id-ID') + suffix)
            if (progress < 1) requestAnimationFrame(animate)
          }
          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [target, suffix, duration])

  return { ref, display }
}

const stats = [
  { target: 50000, suffix: '+', label: 'Pengguna Terbantu', icon: '👥' },
  { target: 200, suffix: '+', label: 'Konselor & Psikolog', icon: '🧠' },
  { target: 4.9, suffix: '★', label: 'Rating Kepuasan', icon: '⭐', isDecimal: true },
  { target: 100, suffix: '%', label: 'Rahasia & Privat', icon: '🔒' },
]

export default function StatisticsSection() {
  const s1 = useCountUp(50000, '+')
  const s2 = useCountUp(200, '+')
  const s4 = useCountUp(100, '%')

  const counters = [s1, s2, null, s4]

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-container mx-auto px-6">
        <ScrollReveal variant="fade-up" className="text-center mb-14">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-3">Dipercaya Banyak Orang</p>
          <h2 className="text-[clamp(1.6rem,4vw,2.4rem)] font-extrabold text-neutral-900">
            Angka yang Berbicara
          </h2>
        </ScrollReveal>

        <ScrollReveal staggerChildren={0.1} className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, i) => (
            <ScrollRevealItem key={stat.label} variant="fade-up">
              <div className="relative group bg-neutral-50 hover:bg-white rounded-2xl p-6 md:p-8 text-center border border-neutral-100 hover:border-blue-100 hover:shadow-card transition-all duration-300">
                <span className="text-3xl mb-4 block">{stat.icon}</span>
                <span
                  ref={counters[i]?.ref}
                  className="text-3xl md:text-4xl font-extrabold text-neutral-900 block"
                >
                  {i === 2 ? '4.9★' : counters[i]?.display}
                </span>
                <p className="text-sm text-neutral-400 mt-2 font-medium">{stat.label}</p>
              </div>
            </ScrollRevealItem>
          ))}
        </ScrollReveal>
      </div>
    </section>
  )
}
