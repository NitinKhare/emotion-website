'use client'

import { useState, useEffect, useRef } from 'react'

// ---- Section Components ----
import IntroAnimation from './components/IntroAnimation'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Portfolio from './components/Portfolio'
import ClientsMarquee from './components/ClientsMarquee'
import StatsSection from './components/StatsSection'
import Services from './components/Services'
import Process from './components/Process'
import Team from './components/Team'
import Contact from './components/Contact'
import QuoteModal from './components/QuoteModal'
import CTASection from './components/CTASection'
import Footer from './components/Footer'
import SuccessMessage from './components/SuccessMessage'

/**
 * HomeClient — Main page orchestrator.
 * Manages shared state (quote modal, success toast) and global effects
 * (smooth scroll, scroll-triggered animations, cursor, magnetic buttons).
 *
 * @param {string[]} clientLogos - Filenames from public/clients/ (passed by server component page.js)
 */
export default function HomeClient({ clientLogos = [] }) {
  const [quoteModalOpen, setQuoteModalOpen] = useState(false)
  const [successVisible, setSuccessVisible] = useState(false)
  const initialized = useRef(false)

  // ---- Shared callbacks ----
  function openQuoteModal() {
    setQuoteModalOpen(true)
    document.body.style.overflow = 'hidden'
  }

  function closeQuoteModal() {
    setQuoteModalOpen(false)
    document.body.style.overflow = 'auto'
  }

  function showSuccessMessage() {
    setSuccessVisible(true)
    setTimeout(() => setSuccessVisible(false), 5000)
  }

  // ---- Global effects ----
  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault()
        const target = document.querySelector(this.getAttribute('href'))
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    })

    // IntersectionObserver — scroll-triggered fade-ins
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible')
      })
    }, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' })

    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el))

    // ── Custom cursor (desktop / fine pointer only) ──────────────────────────
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      const dot  = document.createElement('div')
      const glow = document.createElement('div')
      dot.className  = 'cursor-dot'
      glow.className = 'cursor-glow'
      document.body.appendChild(dot)
      document.body.appendChild(glow)

      document.addEventListener('mousemove', (e) => {
        // Dot follows instantly
        dot.style.transform  = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`
        // Glow lags via CSS transition on transform
        glow.style.transform = `translate(${e.clientX - 140}px, ${e.clientY - 140}px)`

        if (!dot.classList.contains('visible')) {
          dot.classList.add('visible')
          glow.classList.add('visible')
        }
      })

      document.addEventListener('mouseleave', () => {
        dot.classList.remove('visible')
        glow.classList.remove('visible')
      })
    }

    // ── Magnetic CTA buttons ─────────────────────────────────────────────────
    function applyMagnetic() {
      document.querySelectorAll('.btn-primary').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
          const rect = btn.getBoundingClientRect()
          const dx = e.clientX - (rect.left + rect.width  / 2)
          const dy = e.clientY - (rect.top  + rect.height / 2)
          btn.style.transform = `translate(${dx * 0.25}px, ${dy * 0.25}px)`
        })
        btn.addEventListener('mouseleave', () => {
          btn.style.transform = ''
        })
      })
    }
    // Run once and again after a short delay (some buttons may render later)
    applyMagnetic()
    setTimeout(applyMagnetic, 1500)

    return () => observer.disconnect()
  }, [])

  // ---- Render ----
  return (
    <>
      <IntroAnimation clientLogos={clientLogos} />
      <Navbar />
      <Hero onGetQuote={openQuoteModal} />
      <Portfolio />
      <ClientsMarquee clientLogos={clientLogos} />
      <StatsSection />
      <Services />
      <Process />
      <Team />
      <Contact onSuccess={showSuccessMessage} />
      <QuoteModal isOpen={quoteModalOpen} onClose={closeQuoteModal} onSuccess={showSuccessMessage} />
      <CTASection onGetQuote={openQuoteModal} />
      <Footer />
      <SuccessMessage visible={successVisible} />
    </>
  )
}
