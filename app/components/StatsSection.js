'use client'

import { useEffect, useRef } from 'react'

const STATS = [
  { value: 200, suffix: '+',  label: 'Ads Produced' },
  { value: 44,  suffix: '+',  label: 'Clients Served' },
  { value: 8,   suffix: '+',  label: 'Years of Excellence' },
  { value: 50,  suffix: 'M+', label: 'Views Generated' },
]

/**
 * StatsSection — Animated count-up numbers that fire when scrolled into view.
 */
export default function StatsSection() {
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const items = document.querySelectorAll('.stat-number[data-value]')

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return
        observer.unobserve(entry.target)

        const el = entry.target
        const target = parseInt(el.dataset.value, 10)
        const duration = 1500
        const startTime = performance.now()

        function tick(now) {
          const elapsed  = now - startTime
          const progress = Math.min(elapsed / duration, 1)
          // Ease-out cubic
          const eased = 1 - Math.pow(1 - progress, 3)
          el.textContent = Math.floor(eased * target)
          if (progress < 1) {
            requestAnimationFrame(tick)
          } else {
            el.textContent = target
          }
        }

        requestAnimationFrame(tick)
      })
    }, { threshold: 0.4 })

    items.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <section className="stats-section">
      <div className="stats-grid">
        {STATS.map(({ value, suffix, label }) => (
          <div className="stat-item animate-on-scroll" key={label}>
            <div className="stat-value">
              <span className="stat-number" data-value={value}>0</span>
              <span className="stat-suffix">{suffix}</span>
            </div>
            <div className="stat-label">{label}</div>
            <div className="stat-line"></div>
          </div>
        ))}
      </div>
    </section>
  )
}
