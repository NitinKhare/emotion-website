'use client'

import { useEffect, useRef } from 'react'
import { createMainSoundEngine } from '../sounds/mainSounds'

/**
 * CTASection — Call-to-action banner with neon sign h2.
 * Words flicker on one-by-one (same mechanic as the intro bulb) when scrolled into view.
 * @param {Function} onGetQuote - Callback to open the quote modal
 */
export default function CTASection({ onGetQuote }) {
  const sectionRef = useRef(null)
  const wrapRef    = useRef(null)
  const fired      = useRef(false)
  const sounds     = useRef(null)

  useEffect(() => {
    sounds.current = createMainSoundEngine()

    const section = sectionRef.current
    const wrap    = wrapRef.current
    if (!section || !wrap) return

    const chars = Array.from(wrap.querySelectorAll('.neon-char'))

    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !fired.current) {
        fired.current = true
        obs.disconnect()

        // Stagger each word lighting up with a brief neon crackle
        chars.forEach((char, i) => {
          setTimeout(() => {
            // Brief crackle before each word lights
            sounds.current.playNeonCrackle()
            char.classList.add('lit')

            // After last char, brief neon buzz then stop
            if (i === chars.length - 1) {
              wrap.classList.add('all-lit')
              sounds.current.startNeonBuzz()
              setTimeout(() => sounds.current.stopNeonBuzz(), 2500)
            }
          }, i * 180)
        })
      }
    }, { threshold: 0.4 })

    obs.observe(section)
    return () => obs.disconnect()
  }, [])

  // Split the h2 text into per-word spans at render time
  const words = ['Ready to Create', 'Something Amazing?']

  return (
    <section className="cta-section" ref={sectionRef}>
      <div className="cta-bg"></div>
      <div className="cta-content animate-on-scroll">
        <h2>
          <span className="neon-sign-wrap" ref={wrapRef}>
            {words.map((word, wi) => (
              <span key={wi}>
                <span className="neon-char">{word}</span>
                {wi < words.length - 1 && ' '}
              </span>
            ))}
          </span>
        </h2>
        <p>Let&apos;s transform your brand message into compelling audio-visual content that drives results</p>
        <div className="cta-buttons">
          <button className="btn btn-primary" onClick={onGetQuote}>Get Started Today</button>
        </div>
      </div>
    </section>
  )
}
