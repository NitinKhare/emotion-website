'use client'

/**
 * CTASection — Call-to-action banner with pulsing background.
 * @param {Function} onGetQuote - Callback to open the quote modal
 */
export default function CTASection({ onGetQuote }) {
  return (
    <section className="cta-section">
      <div className="cta-bg"></div>
      <div className="cta-content animate-on-scroll">
        <h2>Ready to Create Something Amazing?</h2>
        <p>Let&apos;s transform your brand message into compelling audio-visual content that drives results</p>
        <div className="cta-buttons">
          <button className="btn btn-primary" onClick={onGetQuote}>Get Started Today</button>
        </div>
      </div>
    </section>
  )
}
