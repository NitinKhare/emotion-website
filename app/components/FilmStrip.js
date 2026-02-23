'use client'

import { useEffect, useRef } from 'react'

const FRAMES = [
  {
    src: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44b?w=900&q=80',
    label: 'Corporate Excellence',
  },
  {
    src: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=900&q=80',
    label: 'Product Launch',
  },
  {
    src: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=900&q=80',
    label: 'Voice Over Magic',
  },
  {
    src: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=900&q=80',
    label: '3D Animation',
  },
  {
    src: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=900&q=80',
    label: 'Documentary Film',
  },
  {
    src: 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=900&q=80',
    label: 'Music Video',
  },
]

/**
 * FilmStrip — Sticky horizontal scroll section styled as a cinema film strip.
 * Scrolling vertically through the section translates the film track horizontally.
 * Sprocket holes are drawn with a CSS radial-gradient pattern on the edge bars.
 */
export default function FilmStrip() {
  const sectionRef = useRef(null)
  const trackRef   = useRef(null)
  const hintRef    = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const track   = trackRef.current
    const hint    = hintRef.current
    if (!section || !track) return

    let hintHidden = false

    function onScroll() {
      const rect         = section.getBoundingClientRect()
      const totalDuration = section.offsetHeight - window.innerHeight
      const rawProgress   = -rect.top / totalDuration
      const progress      = Math.max(0, Math.min(1, rawProgress))

      const totalSlide = track.scrollWidth - window.innerWidth
      track.style.transform = `translateX(${-totalSlide * progress}px)`

      // Hide hint after user starts scrolling into the section
      if (!hintHidden && progress > 0.05) {
        hintHidden = true
        if (hint) hint.classList.add('hidden')
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section className="filmstrip-section" ref={sectionRef} id="filmstrip">
      <div className="filmstrip-sticky">
        <div className="filmstrip-edge top-edge"></div>

        <div className="filmstrip-track" ref={trackRef}>
          {/* Vertical label column */}
          <div className="filmstrip-title-col">
            <span>Showreel</span>
          </div>

          {FRAMES.map(({ src, label }, i) => (
            <div className="filmstrip-frame" key={i}>
              <img src={src} alt={label} loading="eager" />
              <div className="filmstrip-caption">
                <span className="frame-number">{String(i + 1).padStart(2, '0')}</span>
                <span className="frame-label">{label}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="filmstrip-edge bottom-edge"></div>

        {/* Scroll hint — auto-hides after user scrolls */}
        <div className="filmstrip-hint" ref={hintRef}>
          <span>Scroll to explore</span>
          <span className="filmstrip-hint-arrow">→</span>
        </div>
      </div>
    </section>
  )
}
