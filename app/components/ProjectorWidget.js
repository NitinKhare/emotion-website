'use client'

import { useRef, useEffect } from 'react'
import { createMainSoundEngine } from '../sounds/mainSounds'

/**
 * ProjectorWidget — CSS-drawn vintage film projector.
 * Beam now points UPWARD (toward the video above).
 * Sounds are triggered via useEffect watching the `on` prop so both the
 * projector click and the video-overlay click both produce audio.
 *
 * Props:
 *   on       {boolean}  — controlled by Hero
 *   onToggle {Function} — flip state in Hero
 */
export default function ProjectorWidget({ on, onToggle }) {
  const sounds   = useRef(null)
  const humTimer = useRef(null)
  const wasOn    = useRef(false)

  useEffect(() => {
    sounds.current = createMainSoundEngine()
    return () => {
      if (sounds.current) sounds.current.stopProjectorHum()
      if (humTimer.current) clearTimeout(humTimer.current)
    }
  }, [])

  // React to on/off changes — works whether toggled by projector click or overlay click
  useEffect(() => {
    if (!sounds.current) return
    if (on && !wasOn.current) {
      sounds.current.playProjectorStart()
      humTimer.current = setTimeout(() => {
        sounds.current.startProjectorHum()
        // Auto-stop hum after 3 s — projector stays on visually
        setTimeout(() => sounds.current.stopProjectorHum(), 3000)
      }, 600)
    } else if (!on && wasOn.current) {
      sounds.current.stopProjectorHum()
      if (humTimer.current) clearTimeout(humTimer.current)
    }
    wasOn.current = on
  }, [on])

  return (
    <div className={`projector-wrap${on ? ' on' : ''}`}>
      <div className="projector-unit">

        {/* Beam sits ABOVE the body — upward-pointing cone toward the video */}
        <div className="projector-beam" aria-hidden="true" />

        {/* Clickable projector body */}
        <div
          className="projector"
          onClick={() => onToggle(!on)}
          role="button"
          aria-pressed={on}
          aria-label="Toggle projector"
        >
          <div className="projector-body">
            <div className="projector-reel"></div>
            <div className="projector-lens"></div>
            <div className="projector-reel"></div>
          </div>
        </div>

        <div className="projector-tripod" aria-hidden="true">
          <span></span>
          <span></span>
        </div>

        <p className="projector-prompt">
          {on ? 'Now Playing' : 'Click to play showreel'}
        </p>
      </div>
    </div>
  )
}
