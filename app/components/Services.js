'use client'

import { useEffect, useRef } from 'react'

const SERVICES = [
  {
    icon: '🎨',
    title: 'Creative Conceptualization',
    desc: 'Strategic creative development aligned with your marketing objectives and target audience insights.',
  },
  {
    icon: '🎬',
    title: 'Video Production',
    desc: 'Corporate films, product videos, online ads, and training content crafted with precision and creativity to tell your brand story effectively.',
  },
  {
    icon: '🎙️',
    title: 'Voice Over & Dubbing',
    desc: 'Professional voice-over services in multiple regional and international languages with a diverse voice bank of talented artists.',
  },
  {
    icon: '✨',
    title: 'Animation',
    desc: 'Engaging whiteboard, 2D, and 3D animations that bring complex concepts to life with visual storytelling excellence.',
  },
  {
    icon: '🎵',
    title: 'Music & Sound Design',
    desc: 'Custom music composition and royalty-free soundtracks that enhance the emotional impact of your content.',
  },
  {
    icon: '✂️',
    title: 'Post-Production',
    desc: 'State-of-the-art editing, color grading, and visual effects that ensure your content stands out with professional polish.',
  },
]

/**
 * Services — Grid of service cards with 35mm film-strip rail header and
 * a scan-wipe reveal (dark bar sweeps away as each card enters viewport).
 */
export default function Services() {
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    // ── Service card hover spotlight ─────────────────────────────────────────
    document.querySelectorAll('.service-card').forEach(card => {
      card.addEventListener('mouseenter', (e) => {
        card.style.setProperty('--x', (e.pageX - card.offsetLeft) + 'px')
        card.style.setProperty('--y', (e.pageY - card.offsetTop)  + 'px')
      })
    })

    // ── Staggered scan-wipe reveal per card ──────────────────────────────────
    Array.from(document.querySelectorAll('.service-card')).forEach((card, i) => {
      const obs = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => card.classList.add('scan-revealed'), i * 130)
          obs.disconnect()
        }
      }, { threshold: 0.15 })
      obs.observe(card)
    })
  }, [])

  return (
    <section className="services" id="services">
      <div className="section-header animate-on-scroll">
        <h2>Our Creative Services</h2>
        <p>From concept to completion, we offer a complete suite of audio-visual production services</p>
      </div>

      {/* 35mm film-strip sprocket rail */}
      <div className="film-strip-rail" aria-hidden="true">
        <div className="sprocket-row">
          {Array.from({ length: 18 }, (_, i) => <div key={i} className="sprocket" />)}
        </div>
        <div className="film-strip-label">E·MOTION PRODUCTION · SCENE ROLL · 35MM</div>
        <div className="sprocket-row">
          {Array.from({ length: 18 }, (_, i) => <div key={i} className="sprocket" />)}
        </div>
      </div>

      <div className="service-grid">
        {SERVICES.map(({ icon, title, desc }, i) => (
          <div className="service-card" key={i}>
            <span className="scene-badge">SC·{String(i + 1).padStart(2, '0')}</span>
            <div className="service-icon">{icon}</div>
            <h3>{title}</h3>
            <p>{desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
