'use client'

import { useEffect, useRef } from 'react'

// ── Configurable: how long the reel stays visible before the site loads ───────
const AGENCY_REEL_DURATION = 3000  // ms — set to any value between 2000 and 5000

/**
 * AgencyReel — Full-screen client logo collage shown after "Enter Studio".
 * Logos pop in with random rotations and staggered delays for a dynamic feel.
 * @param {string[]} clientLogos - Filenames from public/clients/
 * @param {Function} onDone - Called after the reel fades out
 */
export default function AgencyReel({ clientLogos = [], onDone }) {
  const containerRef = useRef(null)

  // Compute stable random layout values once (useRef prevents reshuffling on re-renders)
  const itemsRef = useRef(null)
  if (!itemsRef.current && clientLogos.length > 0) {
    const shuffled = [...clientLogos].sort(() => Math.random() - 0.5).slice(0, 20)
    itemsRef.current = shuffled.map((logo, i) => ({
      logo,
      rotate: 0,
      delay:  (i * 0.08).toFixed(2),                  // 0s → 1.6s stagger
    }))
  }

  useEffect(() => {
    // Just signal the parent when the display time is up.
    // The parent controls the fade-out sequence so the overlay
    // never flashes back between the reel and the main site.
    const timer = setTimeout(onDone, AGENCY_REEL_DURATION)
    return () => clearTimeout(timer)
  }, [onDone])

  if (!itemsRef.current) return null

  return (
    <div className="agency-reel" ref={containerRef}>
      <p className="reel-tagline">100+ brands. One story.</p>
      <div className="reel-grid">
        {itemsRef.current.map(({ logo, rotate, delay }, i) => (
          <div
            key={`${logo}-${i}`}
            className="reel-logo"
            style={{
              '--rotate': `${rotate}deg`,
              '--delay':  `${delay}s`,
            }}
          >
            <img src={`/clients/${logo}`} alt="" loading="eager" />
          </div>
        ))}
      </div>
      <p className="reel-sub">Trusted partners. Unforgettable stories.</p>
    </div>
  )
}
