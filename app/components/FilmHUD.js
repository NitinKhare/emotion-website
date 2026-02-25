'use client'

import { useEffect, useRef } from 'react'

/**
 * FilmHUD — Fixed bottom-right production timecode overlay.
 * Timecode advances in sync with scroll position (0 → 5 min @ 30fps).
 * Gives the site a "live production" feel — like a professional monitoring display.
 */
export default function FilmHUD() {
  const tcRef    = useRef(null)
  const frameRef = useRef(null)

  useEffect(() => {
    const pad = n => String(n).padStart(2, '0')

    function update() {
      const max      = document.documentElement.scrollHeight - window.innerHeight
      const progress = max > 0 ? window.scrollY / max : 0

      // Map 0–100% scroll to 0–8 min of timecode @ 30 fps
      const totalFrames = Math.floor(progress * 14400)   // 8 min × 60 s × 30 fps
      const ff = totalFrames % 30
      const ss = Math.floor(totalFrames / 30) % 60
      const mm = Math.floor(totalFrames / 1800) % 60
      const hh = Math.floor(totalFrames / 108000)

      if (tcRef.current)    tcRef.current.textContent    = `${pad(hh)}:${pad(mm)}:${pad(ss)}:${pad(ff)}`
      if (frameRef.current) frameRef.current.textContent = `FRAME ${String(totalFrames).padStart(5, '0')}`
    }

    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <div className="film-hud" aria-hidden="true">
      <div className="hud-rec">
        <span className="hud-dot" />
        REC
      </div>
      <div className="hud-tc"  ref={tcRef}>00:00:00:00</div>
      <div className="hud-frame" ref={frameRef}>FRAME 00000</div>
      <div className="hud-label">E·MOTION STUDIO</div>
    </div>
  )
}
