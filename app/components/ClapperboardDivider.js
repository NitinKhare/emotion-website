'use client'

import { useEffect, useRef } from 'react'
import { createMainSoundEngine } from '../sounds/mainSounds'

/**
 * ClapperboardDivider — Full-width section break styled as a film slate.
 * The clapper arm snaps shut with a CLAP sound when scrolled into view.
 * @param {number} scene - Scene number displayed on the slate
 * @param {string} title - Section title displayed on the slate
 */
export default function ClapperboardDivider({ scene = 1, title = '' }) {
  const armRef     = useRef(null)
  const dividerRef = useRef(null)
  const snapped    = useRef(false)
  const sounds     = useRef(null)

  useEffect(() => {
    sounds.current = createMainSoundEngine()

    const divider = dividerRef.current
    const arm     = armRef.current
    if (!divider || !arm) return

    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !snapped.current) {
        snapped.current = true
        // Brief pause so the user sees the open arm before the snap
        setTimeout(() => {
          arm.classList.add('snapped')
          sounds.current.playClapperSnap()
        }, 300)
        obs.disconnect()
      }
    }, { threshold: 0.5 })

    obs.observe(divider)
    return () => obs.disconnect()
  }, [])

  return (
    <div className="clapper-divider" ref={dividerRef}>
      <div className="clapper-board">
        {/* Striped arm — starts open (rotated up), snaps closed */}
        <div className="clapper-arm" ref={armRef}></div>

        {/* Base slate */}
        <div className="clapper-base">
          <span className="clapper-label">SCENE</span>
          <span className="clapper-scene-num">{String(scene).padStart(2, '0')}</span>
          <span className="clapper-title">{title}</span>
          <span className="clapper-take">TAKE&nbsp;1</span>
        </div>
      </div>
    </div>
  )
}
