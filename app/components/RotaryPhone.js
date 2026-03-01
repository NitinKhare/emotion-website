'use client'

import { useEffect, useRef, useState } from 'react'
import { createMainSoundEngine } from '../sounds/mainSounds'

// Positions of 10 dial holes around an arc (top 300° of circle)
const HOLE_ANGLES = [300, 330, 0, 30, 60, 90, 120, 150, 180, 210]

/**
 * RotaryPhone — CSS-drawn rotary telephone.
 * Rings on scroll-in, pauses, shows missed-call count, rings again — loops
 * until the user clicks to pick up and connect to the contact form.
 */
export default function RotaryPhone() {
  const phoneRef    = useRef(null)
  const sounds      = useRef(null)
  const pickedUp    = useRef(false)
  const timerRef    = useRef(null)
  const ringCount   = useRef(0)
  const MAX_RINGS   = 10
  const [phase, setPhase]             = useState('idle')     // idle | ringing | missed | connected
  const [missedCount, setMissedCount] = useState(0)

  useEffect(() => {
    sounds.current = createMainSoundEngine()
    const phone = phoneRef.current
    if (!phone) return

    function doRing() {
      if (pickedUp.current) return
      ringCount.current += 1
      setPhase('ringing')
      phone.classList.add('ringing')
      sounds.current.startPhoneRing()

      // Ring for ~3.6 s then pause
      timerRef.current = setTimeout(() => {
        if (pickedUp.current) return
        phone.classList.remove('ringing')
        sounds.current.stopPhoneRing()

        setMissedCount(prev => {
          const next = prev + 1
          setPhase('missed')

          // After MAX_RINGS, stop — stay as permanent missed call
          if (ringCount.current < MAX_RINGS) {
            timerRef.current = setTimeout(doRing, 2500)
          }
          return next
        })
      }, 3600)
    }

    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && phase === 'idle') {
        obs.disconnect()
        // Small delay before first ring
        timerRef.current = setTimeout(doRing, 600)
      }
    }, { threshold: 0.5 })

    obs.observe(phone)

    return () => {
      obs.disconnect()
      clearTimeout(timerRef.current)
      sounds.current?.stopPhoneRing()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function handlePickUp() {
    if (pickedUp.current) return
    pickedUp.current = true
    clearTimeout(timerRef.current)

    const phone = phoneRef.current
    phone.classList.remove('ringing')
    sounds.current.stopPhoneRing()
    sounds.current.playPhonePickup()

    phone.classList.add('picked-up')
    setPhase('connected')

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

      {/* Handset */}
      <div className="phone-handset">
        <div className="handset-ear" />
        <div className="handset-body" />
        <div className="handset-mouth" />
      </div>

      {/* Phone body with rotary dial */}
      <div className="phone-body">
        <div className={`phone-dial${phase === 'idle' || phase === 'missed' ? ' dial-idle' : ''}`}>
          {HOLE_ANGLES.map((angle, i) => {
            const rad = (angle - 90) * (Math.PI / 180)
            const r   = 46
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
          <div className="dial-center" />
        </div>
      </div>

      {/* Status display */}
      <div className="phone-status">
        {phase === 'ringing' && (
          <span className="status-incoming">
            <span className="status-dot" />
            INCOMING CALL
          </span>
        )}
        {phase === 'missed' && (
          <span className="status-missed">
            {ringCount.current >= MAX_RINGS
              ? `${missedCount} missed calls — still waiting…`
              : `${missedCount} missed call${missedCount !== 1 ? 's' : ''}`}
          </span>
        )}
        {phase === 'connected' && (
          <span className="status-connected">Connected ✓</span>
        )}
      </div>

      <div className="phone-prompt">
        {phase !== 'connected' ? 'Pick up to connect' : 'Talk to us'}
      </div>
    </div>
  )
}
