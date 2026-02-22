'use client'

import { useState, useEffect, useRef } from 'react'

// ---- Section Components ----
import IntroAnimation from './components/IntroAnimation'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Portfolio from './components/Portfolio'
import ClientsMarquee from './components/ClientsMarquee'
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
 * (smooth scroll, scroll-triggered animations). Each visual section is
 * a self-contained component in ./components/.
 *
 * @param {string[]} clientLogos - Filenames from public/clients/ (passed by server component page.js)
 */
export default function HomeClient({ clientLogos = [] }) {
  const [quoteModalOpen, setQuoteModalOpen] = useState(false)
  const [successVisible, setSuccessVisible] = useState(false)
  const initialized = useRef(false)

  // ---- Shared callbacks (passed down to children) ----
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

    // Smooth scrolling for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault()
        const target = document.querySelector(this.getAttribute('href'))
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      })
    })

    // IntersectionObserver — animates elements on scroll into view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
        }
      })
    }, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' })

    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  // ---- Render ----
  return (
    <>
      <IntroAnimation />
      <Navbar />
      <Hero onGetQuote={openQuoteModal} />
      <Portfolio />
      <ClientsMarquee clientLogos={clientLogos} />
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
