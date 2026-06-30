'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'

interface NavbarProps {
  variant?: 'default' | 'blog'
}

export default function Navbar({ variant = 'default' }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const navLinks = variant === 'blog'
    ? [
        { label: 'Layanan', href: '/#layanan' },
        { label: 'Cara Kerja', href: '/#cara-kerja' },
        { label: 'Testimoni', href: '/#testimoni' },
        { label: 'FAQ', href: '/#faq' },
        { label: 'Blog', href: '/blog', active: true },
      ]
    : [
        { label: 'Layanan', href: '#layanan' },
        { label: 'Cara Kerja', href: '#cara-kerja' },
        { label: 'Testimoni', href: '#testimoni' },
        { label: 'FAQ', href: '#faq' },
        { label: 'Blog', href: '/blog' },
      ]

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 w-full z-[1000] transition-all duration-300 ${
          scrolled
            ? 'bg-white/90 backdrop-blur-xl border-b border-neutral-200/50 shadow-sm py-2 lg:py-2.5'
            : 'bg-white/50 backdrop-blur-sm border-b border-transparent py-3.5 lg:py-4'
        }`}
      >
        <div className="max-w-container mx-auto px-6 md:px-8 xl:px-12 flex items-center justify-between">
          {/* Logo */}
          <div className="flex-1 flex justify-start items-center">
            <Link href="/" className="flex items-center gap-3 flex-shrink-0 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg">
              <Image
                src="/assets/logov2_yukceritain.png"
                alt="YukceritaIN Logo"
                width={200}
                height={200}
                className={`w-auto transition-all duration-300 group-hover:scale-105 ${scrolled ? 'h-[42px] sm:h-[48px] lg:h-[56px]' : 'h-[48px] sm:h-[56px] lg:h-[64px]'}`}
                style={{ width: "auto" }}
                priority
              />
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex flex-none items-center justify-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`relative px-3.5 lg:px-4 py-2 text-[0.875rem] lg:text-[0.925rem] font-medium rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 ${
                  link.active
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex-1 flex justify-end items-center gap-3 lg:gap-4">
            <Link
              href="/cek-status"
              className="hidden md:block text-[0.875rem] font-medium text-neutral-500 hover:text-blue-600 transition-colors px-3 py-2 rounded-full hover:bg-blue-50/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
            >
              Cek Status
            </Link>

            <Link
              href="/konsultasi"
              className="hidden md:flex items-center justify-center px-5 lg:px-6 py-2.5 text-[0.875rem] lg:text-[0.925rem] font-semibold text-white bg-blue-600 rounded-full shadow-[0_2px_8px_rgba(37,99,235,0.25)] hover:bg-blue-700 hover:shadow-[0_4px_16px_rgba(37,99,235,0.35)] hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
            >
              Mulai Konseling
            </Link>

            {/* Mobile Hamburger */}
            <button
              className="md:hidden p-2 -mr-2 text-neutral-700 hover:bg-neutral-100 rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle mobile menu"
            >
              {menuOpen ? (
                <X size={24} className="transition-transform duration-200" />
              ) : (
                <Menu size={24} className="transition-transform duration-200" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        className={`fixed left-4 right-4 top-[76px] bg-white/95 backdrop-blur-2xl border border-neutral-100 shadow-xl rounded-2xl p-5 transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] md:hidden z-[999] flex flex-col ${
          menuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-4'
        }`}
      >
        <div className="flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`px-4 py-3.5 text-[1rem] font-semibold rounded-xl transition-colors focus:outline-none ${
                link.active
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-neutral-700 hover:bg-neutral-50 hover:text-blue-600'
              }`}
            >
              {link.label}
            </Link>
          ))}

          <div className="h-px bg-neutral-100 my-3" />

          <Link
            href="/cek-status"
            onClick={() => setMenuOpen(false)}
            className="px-4 py-3.5 text-center text-[1rem] font-semibold text-neutral-600 hover:bg-neutral-50 rounded-xl transition-colors focus:outline-none"
          >
            Cek Status
          </Link>

          <Link
            href="/konsultasi"
            onClick={() => setMenuOpen(false)}
            className="px-4 py-3.5 text-center text-[1rem] font-bold text-white bg-blue-600 rounded-xl shadow-[0_2px_12px_rgba(37,99,235,0.25)] hover:bg-blue-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 mt-1"
          >
            Mulai Konseling
          </Link>
        </div>
      </div>

      {/* Backdrop */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-neutral-900/10 backdrop-blur-[2px] z-[998] md:hidden"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  )
}
