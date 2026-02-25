'use client'

import { useEffect, useRef, useState } from 'react'

const SEQUENCE = [
  { text: 'LIGHTS',  delay: 100,  hold: 650 },
  { text: 'CAMERA',  delay: 950,  hold: 650 },
  { text: 'ACTION!', delay: 1800, hold: 900, big: true },
]

/**
 * LightsCameraAction — fires ONCE when the user scrolls past the Hero.
 * A black overlay flashes "LIGHTS … CAMERA … ACTION!" in dramatic cinematic
 * typography, then dissolves — leaving the visitor hyped for the rest of the site.
 */
export default function LightsCameraAction() {
  const fired      = useRef(false)
  const [show,     setShow]    = useState(false)
  const [word,     setWord]    = useState(null)   // { text, big }

  useEffect(() => {
    const hero = document.getElementById('home')
    if (!hero) return

    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting && !fired.current) {
        fired.current = true
        obs.disconnect()
        runSequence()
      }
    }, { threshold: 0.05 })

    obs.observe(hero)
    return () => obs.disconnect()
  }, [])

  function runSequence() {
    setShow(true)

    SEQUENCE.forEach(({ text, delay, hold, big }) => {
      setTimeout(() => setWord({ text, big }),  delay)
      setTimeout(() => setWord(null),            delay + hold)
    })

    // Fade overlay out after last word
    const last = SEQUENCE[SEQUENCE.length - 1]
    setTimeout(() => setShow(false), last.delay + last.hold + 280)
  }

  if (!show) return null

  return (
    <div className="lca-overlay" aria-hidden="true">
      {word && (
        <span
          className={`lca-word${word.big ? ' lca-action' : ''}`}
          key={word.text}
        >
          {word.text}
        </span>
      )}
    </div>
  )
}
