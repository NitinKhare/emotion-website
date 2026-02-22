'use client'

import { useEffect, useRef } from 'react'

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&'

/**
 * Hero — Landing section with headline, CTA buttons, and embedded showreel video.
 * Includes: text-scramble decode on h1, animated audio waveform bars, floating particles.
 * @param {Function} onGetQuote - Callback to open the quote modal
 */
export default function Hero({ onGetQuote }) {
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    // ── Floating background particles ────────────────────────────────────────
    const heroBg = document.getElementById('hero-bg')
    if (heroBg) {
      for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div')
        particle.className = 'particle'
        particle.style.left = Math.random() * 100 + '%'
        particle.style.animationDelay = Math.random() * 20 + 's'
        particle.style.animationDuration = (Math.random() * 20 + 20) + 's'
        heroBg.appendChild(particle)
      }
    }

    // ── Text scramble decode on h1 ───────────────────────────────────────────
    const h1 = document.querySelector('.hero-text h1')
    if (h1) {
      const original = h1.textContent
      let iteration  = 0

      setTimeout(() => {
        const interval = setInterval(() => {
          h1.textContent = original
            .split('')
            .map((char, idx) => {
              if (char === ' ') return ' '
              if (idx < Math.floor(iteration)) return original[idx]
              return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
            })
            .join('')

          iteration += 1 / 3   // controls decode speed
          if (iteration >= original.length) {
            h1.textContent = original
            clearInterval(interval)
          }
        }, 30)
      }, 300)
    }
  }, [])

  return (
    <section className="hero" id="home">
      <div className="hero-bg" id="hero-bg"></div>
      <div className="hero-content">
        <div className="hero-text">
          <h1>Bring Your Brand to Life</h1>

          {/* Audio waveform — 20 bars with staggered CSS animation */}
          <div className="audio-waveform" aria-hidden="true">
            {Array.from({ length: 20 }, (_, i) => (
              <span key={i} style={{ '--i': i }} />
            ))}
          </div>

          <p>We create compelling audio-visual content that captivates audiences and drives results. From voice-overs to full production, we&apos;re your creative partners.</p>
          <div className="cta-buttons">
            <button className="btn btn-primary" onClick={onGetQuote}>Get Free Quote</button>
            <a href="#portfolio" className="btn btn-secondary">View Portfolio</a>
          </div>
        </div>
        <div className="hero-visual">
          <div className="video-frame">
            <iframe src="https://drive.google.com/file/d/1UyGUcylQZ8M2eGNEkhYtPQ2RREZTeiP5/preview" allow="autoplay; encrypted-media" allowFullScreen></iframe>
          </div>
        </div>
      </div>
    </section>
  )
}
