'use client'

import { useEffect, useRef } from 'react'

/**
 * Hero — Landing section with headline, CTA buttons, and embedded showreel video.
 * @param {Function} onGetQuote - Callback to open the quote modal
 */
export default function Hero({ onGetQuote }) {
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    // Create floating background particles
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
  }, [])

  return (
    <section className="hero" id="home">
      <div className="hero-bg" id="hero-bg"></div>
      <div className="hero-content">
        <div className="hero-text">
          <h1>Bring Your Brand to Life</h1>
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
