'use client'

const ITEMS = [
  '★ 200+ CONTENT PACKAGES',
  '★ 100+ CLIENTS SERVED',
  '★ 50M+ VIEWS GENERATED',
  '★ 12+ YEARS OF EXCELLENCE',
  '★ AWARD-WINNING PRODUCTIONS',
  '★ MUMBAI · INDIA',
  '★ YOUR VISION · OUR CRAFT',
  '★ NOW ROLLING',
]

const STRIP = ITEMS.join('          ')

/**
 * RollingTicker — Thin amber marquee strip below the Navbar.
 * Scrolls continuously, giving the site a "live broadcast" feel.
 * Content is doubled so the animation loops seamlessly.
 */
export default function RollingTicker() {
  return (
    <div className="rolling-ticker" aria-hidden="true">
      <div className="ticker-track">
        {/* Two identical spans = seamless -50% translateX loop */}
        <span className="ticker-inner">{STRIP}</span>
        <span className="ticker-inner">{STRIP}</span>
      </div>
    </div>
  )
}
