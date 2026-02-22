'use client'

import { useEffect, useRef } from 'react'

/**
 * Services — Grid of service cards with hover glow effect.
 */
export default function Services() {
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    // Service card hover spotlight effect
    document.querySelectorAll('.service-card').forEach(card => {
      card.addEventListener('mouseenter', (e) => {
        const x = e.pageX - card.offsetLeft
        const y = e.pageY - card.offsetTop
        card.style.setProperty('--x', x + 'px')
        card.style.setProperty('--y', y + 'px')
      })
    })
  }, [])

  return (
    <section className="services" id="services">
      <div className="section-header animate-on-scroll">
        <h2>Our Creative Services</h2>
        <p>From concept to completion, we offer a complete suite of audio-visual production services</p>
      </div>
      <div className="service-grid">
        <div className="service-card animate-on-scroll">
          <div className="service-icon">🎬</div>
          <h3>Video Production</h3>
          <p>Corporate films, product videos, online ads, and training content crafted with precision and creativity to tell your brand story effectively.</p>
        </div>
        <div className="service-card animate-on-scroll">
          <div className="service-icon">🎙️</div>
          <h3>Voice Over &amp; Dubbing</h3>
          <p>Professional voice-over services in multiple regional and international languages with a diverse voice bank of talented artists.</p>
        </div>
        <div className="service-card animate-on-scroll">
          <div className="service-icon">✨</div>
          <h3>Animation</h3>
          <p>Engaging whiteboard, 2D, and 3D animations that bring complex concepts to life with visual storytelling excellence.</p>
        </div>
        <div className="service-card animate-on-scroll">
          <div className="service-icon">🎵</div>
          <h3>Music &amp; Sound Design</h3>
          <p>Custom music composition and royalty-free soundtracks that enhance the emotional impact of your content.</p>
        </div>
        <div className="service-card animate-on-scroll">
          <div className="service-icon">🎨</div>
          <h3>Creative Conceptualization</h3>
          <p>Strategic creative development aligned with your marketing objectives and target audience insights.</p>
        </div>
        <div className="service-card animate-on-scroll">
          <div className="service-icon">✂️</div>
          <h3>Post-Production</h3>
          <p>State-of-the-art editing, color grading, and visual effects that ensure your content stands out with professional polish.</p>
        </div>
      </div>
    </section>
  )
}
