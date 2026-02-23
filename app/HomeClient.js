'use client'

import { useState, useEffect, useRef } from 'react'

// ---- Section Components ----
import IntroAnimation from './components/IntroAnimation'
import Navbar from './components/Navbar'
import Hero from './components/Hero'

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
import ClapperboardDivider from './components/ClapperboardDivider'
import BroadcastMonitor from './components/BroadcastMonitor'
import { createMainSoundEngine } from './sounds/mainSounds'

/**
 * HomeClient — Main page orchestrator.
 * Manages shared state (quote modal, success toast) and global effects
 * (smooth scroll, scroll-triggered animations, cursor, magnetic buttons,
 *  scroll progress bar, mouse trail, word reveal, 3D tilt, timeline).
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

  // ── Letterbox bars — called by IntroAnimation when intro finishes ──────────
  function handleIntroComplete() {
    const top    = document.createElement('div')
    const bottom = document.createElement('div')
    top.className    = 'letterbox-bar top'
    bottom.className = 'letterbox-bar bottom'
    document.body.appendChild(top)
    document.body.appendChild(bottom)

    // Retract after a cinematic pause
    setTimeout(() => {
      top.classList.add('retract')
      bottom.classList.add('retract')
      setTimeout(() => { top.remove(); bottom.remove() }, 700)
    }, 900)
  }

  // ---- Global effects ----
  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    // ── Smooth scrolling for anchor links ────────────────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault()
        const target = document.querySelector(this.getAttribute('href'))
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    })

    // ── IntersectionObserver — scroll-triggered fade-ins ─────────────────────
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible')
      })
    }, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' })

    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el))

    // ── Scroll Progress Bar ───────────────────────────────────────────────────
    const progressBar = document.createElement('div')
    progressBar.className = 'scroll-progress'
    document.body.appendChild(progressBar)

    function updateProgress() {
      const max      = document.documentElement.scrollHeight - window.innerHeight
      const progress = max > 0 ? window.scrollY / max : 0
      progressBar.style.transform = `scaleX(${progress})`
    }
    window.addEventListener('scroll', updateProgress, { passive: true })

    // ── Custom cursor (desktop / fine pointer only) ───────────────────────────
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      const dot  = document.createElement('div')
      const glow = document.createElement('div')
      dot.className  = 'cursor-dot'
      glow.className = 'cursor-glow'
      document.body.appendChild(dot)
      document.body.appendChild(glow)

      // ── Mouse Trail Particles ────────────────────────────────────────────
      const POOL_SIZE = 18
      const trailPool = []
      let trailIdx    = 0
      for (let i = 0; i < POOL_SIZE; i++) {
        const el = document.createElement('div')
        el.className = 'trail-dot'
        document.body.appendChild(el)
        trailPool.push(el)
      }

      document.addEventListener('mousemove', (e) => {
        // Cursor dot
        dot.style.transform  = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`
        glow.style.transform = `translate(${e.clientX - 140}px, ${e.clientY - 140}px)`

        if (!dot.classList.contains('visible')) {
          dot.classList.add('visible')
          glow.classList.add('visible')
        }

        // Trail — cycle through pool, snap to cursor then fade
        const el = trailPool[trailIdx % POOL_SIZE]
        el.style.transition = 'none'
        el.style.opacity    = '0.65'
        el.style.transform  = `translate(${e.clientX - 3}px, ${e.clientY - 3}px)`
        // Force reflow so the next transition applies
        el.getBoundingClientRect()
        el.style.transition = 'opacity 0.55s ease, transform 0.55s ease'
        el.style.opacity    = '0'
        el.style.transform  = `translate(${e.clientX - 3}px, ${e.clientY - 12}px)`
        trailIdx++
      })

      document.addEventListener('mouseleave', () => {
        dot.classList.remove('visible')
        glow.classList.remove('visible')
      })
    }

    // ── Magnetic CTA buttons ──────────────────────────────────────────────────
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
    applyMagnetic()
    setTimeout(applyMagnetic, 1500)

    // ── 3D Tilt Cards ─────────────────────────────────────────────────────────
    function applyTilt() {
      document.querySelectorAll('.portfolio-item, .service-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
          card.style.transition = 'transform 0.15s ease, box-shadow 0.3s ease'
          card.style.transform  = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)'
        })
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect()
          const x    = (e.clientX - rect.left) / rect.width  - 0.5   // -0.5 → 0.5
          const y    = (e.clientY - rect.top)  / rect.height - 0.5
          card.style.transition = 'none'
          card.style.transform  =
            `perspective(1000px) rotateX(${(-y * 14).toFixed(2)}deg) rotateY(${(x * 14).toFixed(2)}deg) translateZ(12px)`
        })
        card.addEventListener('mouseleave', () => {
          card.style.transition = 'transform 0.55s ease, box-shadow 0.3s ease'
          card.style.transform  = ''
        })
      })
    }
    applyTilt()
    setTimeout(applyTilt, 1500)

    // ── Word-by-word reveal on section headings ───────────────────────────────
    const wordObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Small delay so section-header fade-in (animate-on-scroll) completes first
          setTimeout(() => {
            entry.target.querySelectorAll('.word').forEach(w => w.classList.add('in'))
          }, 280)
          wordObserver.unobserve(entry.target)
        }
      })
    }, { threshold: 0.1, rootMargin: '0px 0px -80px 0px' })

    document.querySelectorAll('.section-header h2').forEach(el => {
      const words = el.textContent.trim().split(/\s+/)
      el.innerHTML = words
        .map((w, i) => `<span class="word" style="--wi:${i}">${w}</span>`)
        .join(' ')
      // Observe the section-header so the trigger fires with the section
      const header = el.closest('.section-header')
      if (header) wordObserver.observe(header)
    })

    // ── Process Timeline — animated line draw + step number pop ──────────────
    const timelineLine = document.querySelector('.timeline-line')
    const timelineWrap = document.querySelector('.process-timeline')

    if (timelineWrap && timelineLine) {
      const tlObserver = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) {
          timelineLine.classList.add('drawn')
          tlObserver.disconnect()
        }
      }, { threshold: 0.15 })
      tlObserver.observe(timelineWrap)
    }

    document.querySelectorAll('.step-number').forEach((num, i) => {
      const stepObs = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) {
          setTimeout(() => num.classList.add('popped'), i * 180)
          stepObs.disconnect()
        }
      }, { threshold: 0.5 })
      stepObs.observe(num)
    })

    // ── VHS Glitch on fast scroll ─────────────────────────────────────────────
    const mainSounds = createMainSoundEngine()
    const glitchEl   = document.createElement('div')
    glitchEl.className = 'vhs-glitch'
    document.body.appendChild(glitchEl)

    let vhsLastY = 0, vhsLastT = Date.now(), vhsGlitching = false
    function checkVHSGlitch() {
      const now = Date.now()
      const vel = Math.abs(window.scrollY - vhsLastY) / Math.max(now - vhsLastT, 1)
      vhsLastY = window.scrollY
      vhsLastT = now
      if (vel > 2.5 && !vhsGlitching) {
        vhsGlitching = true
        glitchEl.classList.add('active')
        mainSounds.playVHSStatic()
        setTimeout(() => { glitchEl.classList.remove('active'); vhsGlitching = false }, 200)
      }
    }
    window.addEventListener('scroll', checkVHSGlitch, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('scroll', checkVHSGlitch)
    }
  }, [])

  // ---- Render ----
  return (
    <>
      <IntroAnimation clientLogos={clientLogos} onIntroComplete={handleIntroComplete} />
      <Navbar />
      <Hero onGetQuote={openQuoteModal} />
      <BroadcastMonitor />
      <ClapperboardDivider scene={1} title="Our Work" />
      <ClientsMarquee clientLogos={clientLogos} />
      <StatsSection />
      <ClapperboardDivider scene={2} title="Our Services" />
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
