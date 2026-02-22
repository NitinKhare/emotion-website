'use client'

import { useEffect, useRef } from 'react'

/**
 * Portfolio — Grid gallery of featured projects with hover overlays.
 */
export default function Portfolio() {
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    // Portfolio item click handler
    document.querySelectorAll('.portfolio-item').forEach(item => {
      item.addEventListener('click', () => {
        alert('Portfolio detail view would open here with project information, client testimonials, and behind-the-scenes content.')
      })
    })
  }, [])

  return (
    <section className="portfolio" id="portfolio">
      <div className="section-header animate-on-scroll">
        <h2>Our Latest Work</h2>
        <p>Explore our diverse portfolio of creative audio-visual productions</p>
      </div>
      <div className="portfolio-grid">
        <div className="portfolio-item animate-on-scroll">
          <img src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44b?w=800&q=80" alt="Corporate Video Production" />
          <div className="portfolio-overlay">
            <h3>Corporate Excellence</h3>
            <p>Fortune 500 brand story</p>
          </div>
        </div>
        <div className="portfolio-item animate-on-scroll">
          <img src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80" alt="Product Advertisement" />
          <div className="portfolio-overlay">
            <h3>Product Launch</h3>
            <p>Tech startup commercial</p>
          </div>
        </div>
        <div className="portfolio-item animate-on-scroll">
          <img src="https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&q=80" alt="Voice Over Studio" />
          <div className="portfolio-overlay">
            <h3>Voice Over Magic</h3>
            <p>Multilingual dubbing project</p>
          </div>
        </div>
        <div className="portfolio-item animate-on-scroll">
          <img src="https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=800&q=80" alt="Animation Project" />
          <div className="portfolio-overlay">
            <h3>3D Animation</h3>
            <p>Educational content series</p>
          </div>
        </div>
        <div className="portfolio-item animate-on-scroll">
          <img src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80" alt="Documentary Film" />
          <div className="portfolio-overlay">
            <h3>Documentary Film</h3>
            <p>Award-winning production</p>
          </div>
        </div>
        <div className="portfolio-item animate-on-scroll">
          <img src="https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=800&q=80" alt="Music Video" />
          <div className="portfolio-overlay">
            <h3>Music Video</h3>
            <p>Chart-topping artist</p>
          </div>
        </div>
      </div>
    </section>
  )
}
