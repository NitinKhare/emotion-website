'use client'

/**
 * ClientsMarquee — Infinite scrolling logo carousel.
 * Two rows scroll in opposite directions with grayscale → color hover effect.
 * @param {string[]} clientLogos - Array of filenames from public/clients/
 */
export default function ClientsMarquee({ clientLogos = [] }) {
  if (clientLogos.length === 0) return null

  const mid = Math.ceil(clientLogos.length / 2)
  const row1 = clientLogos.slice(0, mid)
  const row2 = clientLogos.slice(mid)

  return (
    <section className="clients-section" id="clients">
      <div className="section-header animate-on-scroll">
        <h2>Trusted By Industry Leaders</h2>
        <p><span className="client-count">{clientLogos.length}+</span> brands have chosen us to tell their story</p>
      </div>
      <div className="clients-marquee-wrapper">
        {/* Row 1 — scrolls left */}
        <div className="clients-marquee row-1">
          {[...Array(2)].map((_, setIdx) => (
            <span key={`r1-${setIdx}`} style={{ display: 'contents' }}>
              {row1.map((file, i) => (
                <div className="client-logo-card" key={`r1-${setIdx}-${i}`}>
                  <img src={`/clients/${file}`} alt={`Client ${i + 1}`} loading="lazy" />
                </div>
              ))}
            </span>
          ))}
        </div>
        {/* Row 2 — scrolls right */}
        {row2.length > 0 && (
          <div className="clients-marquee row-2">
            {[...Array(2)].map((_, setIdx) => (
              <span key={`r2-${setIdx}`} style={{ display: 'contents' }}>
                {row2.map((file, i) => (
                  <div className="client-logo-card" key={`r2-${setIdx}-${i}`}>
                    <img src={`/clients/${file}`} alt={`Client ${mid + i + 1}`} loading="lazy" />
                  </div>
                ))}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
