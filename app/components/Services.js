'use client'

import { useEffect, useRef } from 'react'
import { createMainSoundEngine } from '../sounds/mainSounds'

const SERVICES = [
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
    icon: '🎨',
    title: 'Creative Conceptualization',
    desc: 'Strategic creative development aligned with your marketing objectives and target audience insights.',
  },
  {
    icon: '✂️',
    title: 'Post-Production',
    desc: 'State-of-the-art editing, color grading, and visual effects that ensure your content stands out with professional polish.',
  },
]

/**
 * Services — Grid of service cards with hover glow + mixing-console faders.
 * Faders slide up staggered on scroll; dragging a fader drives the card's glow intensity.
 */
export default function Services() {
  const initialized = useRef(false)
  const sounds      = useRef(null)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    sounds.current = createMainSoundEngine()

    // ── Service card hover spotlight ─────────────────────────────────────────
    document.querySelectorAll('.service-card').forEach(card => {
      card.addEventListener('mouseenter', (e) => {
        card.style.setProperty('--x', (e.pageX - card.offsetLeft) + 'px')
        card.style.setProperty('--y', (e.pageY - card.offsetTop)  + 'px')
      })
    })

    // ── Fader slide-up on scroll ──────────────────────────────────────────────
    const grid   = document.querySelector('.service-grid')
    const faders = Array.from(document.querySelectorAll('.fader-knob'))
    const tracks = Array.from(document.querySelectorAll('.fader-track'))
    const dbs    = Array.from(document.querySelectorAll('.fader-db'))
    const cards  = Array.from(document.querySelectorAll('.service-card'))

    if (!grid) return

    const faderObs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        faders.forEach((knob, i) => {
          setTimeout(() => {
            const pct   = (75 + Math.random() * 22).toFixed(1)   // 75–97%
            const track = tracks[i]
            knob.style.setProperty('--fader-pos',  pct + '%')
            track.style.setProperty('--fader-fill', pct + '%')
            knob.classList.add('loaded')
            track.classList.add('loaded')
            dbs[i].textContent = '+' + (Math.round(pct / 10) - 2)
            sounds.current.playFaderClick()
          }, i * 220)
        })
        faderObs.disconnect()
      }
    }, { threshold: 0.25 })

    faderObs.observe(grid)

    // ── Fader drag interaction ────────────────────────────────────────────────
    faders.forEach((knob, i) => {
      let dragging  = false
      let trackRect = null

      knob.addEventListener('mousedown', (e) => {
        e.preventDefault()
        dragging  = true
        trackRect = tracks[i].getBoundingClientRect()
        sounds.current.playFaderClick()
      })

      document.addEventListener('mousemove', (e) => {
        if (!dragging) return
        const relY  = e.clientY - trackRect.top
        const pct   = Math.max(0, Math.min(100, 100 - (relY / trackRect.height) * 100))

        knob.style.transition = 'none'
        tracks[i].style.transition = 'none'
        knob.style.setProperty('--fader-pos',   pct.toFixed(1) + '%')
        tracks[i].style.setProperty('--fader-fill', pct.toFixed(1) + '%')
        dbs[i].textContent = pct > 5 ? '+' + (Math.round(pct / 10) - 2) : '∞'

        // Drive card glow
        if (cards[i]) {
          const glow  = (pct * 0.5).toFixed(0)
          const alpha = (pct * 0.005).toFixed(3)
          cards[i].style.boxShadow = `0 0 ${glow}px rgba(134, 25, 26, ${alpha})`
        }
      })

      document.addEventListener('mouseup', () => {
        if (!dragging) return
        dragging = false
        knob.style.transition  = ''
        tracks[i].style.transition = ''
      })
    })
  }, [])

  return (
    <section className="services" id="services">
      <div className="section-header animate-on-scroll">
        <h2>Our Creative Services</h2>
        <p>From concept to completion, we offer a complete suite of audio-visual production services</p>
      </div>

      {/* Mixing console faders — one aligned above each service card */}
      <div className="faders-row" aria-hidden="true">
        {SERVICES.map((_, i) => (
          <div className="fader-wrap" key={i}>
            <div className="fader-track">
              <div className="fader-knob"></div>
            </div>
            <span className="fader-db">∞</span>
            <span className="fader-label">VOL</span>
          </div>
        ))}
      </div>

      <div className="service-grid">
        {SERVICES.map(({ icon, title, desc }, i) => (
          <div className="service-card animate-on-scroll" key={i}>
            <div className="service-icon">{icon}</div>
            <h3>{title}</h3>
            <p>{desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
