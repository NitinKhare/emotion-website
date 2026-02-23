'use client'

import { useEffect, useRef } from 'react'
import { createMainSoundEngine } from '../sounds/mainSounds'

// Positions of 10 dial holes around an arc (top 300° of circle)
// Each entry: [angle in degrees from 12 o'clock, going clockwise]
const HOLE_ANGLES = [300, 330, 0, 30, 60, 90, 120, 150, 180, 210]

/**
 * RotaryPhone — CSS-drawn rotary telephone that rings when scrolled into view.
 * Click to "pick up" — ringing stops, handset lifts, contact form gets focus.
 */
export default function RotaryPhone() {
  const phoneRef   = useRef(null)
  const handsetRef = useRef(null)
  const promptRef  = useRef(null)
  const ringing    = useRef(false)
  const pickedUp   = useRef(false)
  const sounds     = useRef(null)

  useEffect(() => {
    sounds.current = createMainSoundEngine()

    const phone = phoneRef.current
    if (!phone) return

    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !ringing.current && !pickedUp.current) {
        ringing.current = true
        phone.classList.add('ringing')
        sounds.current.startPhoneRing()

        // Stop ringing after 2 cycles (~3.6s) and show prompt
        setTimeout(() => {
          if (!pickedUp.current) {
            phone.classList.remove('ringing')
            sounds.current.stopPhoneRing()
            ringing.current = false
            if (promptRef.current) promptRef.current.classList.add('visible')
          }
        }, 3600)

        obs.disconnect()
      }
    }, { threshold: 0.5 })

    obs.observe(phone)
    return () => obs.disconnect()
  }, [])

  function handlePickUp() {
    if (pickedUp.current) return
    pickedUp.current = true

    const phone   = phoneRef.current
    const prompt  = promptRef.current

    // Stop ringing
    phone.classList.remove('ringing')
    sounds.current.stopPhoneRing()
    sounds.current.playPhonePickup()
    ringing.current = false

    // Lift handset
    phone.classList.add('picked-up')
    if (prompt) prompt.classList.remove('visible')

    // Scroll contact form into soft focus
    setTimeout(() => {
      const form = document.getElementById('contactForm')
      if (form) {
        form.classList.add('phone-focus')
        form.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }, 400)
  }

  return (
    <div className="rotary-phone" ref={phoneRef} onClick={handlePickUp}>
      {/* Handset (receiver) */}
      <div className="phone-handset" ref={handsetRef}>
        <div className="handset-ear"></div>
        <div className="handset-body"></div>
        <div className="handset-mouth"></div>
      </div>

      {/* Phone body with rotary dial */}
      <div className="phone-body">
        <div className="phone-dial">
          {HOLE_ANGLES.map((angle, i) => {
            const rad = (angle - 90) * (Math.PI / 180)
            const r   = 46  // radius from center (px)
            const x   = Math.cos(rad) * r
            const y   = Math.sin(rad) * r
            return (
              <div
                key={i}
                className="dial-hole"
                style={{ transform: `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)` }}
              />
            )
          })}
          <div className="dial-center"></div>
        </div>
      </div>

      {/* Prompt text */}
      <div className="phone-prompt" ref={promptRef}>
        Click to connect
      </div>
    </div>
  )
}
