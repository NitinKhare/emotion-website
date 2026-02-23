'use client'

import { useEffect, useRef, useState } from 'react'
import ProjectorWidget from './ProjectorWidget'
import { onYTReady } from '../utils/ytReady'

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&'
const YT_VIDEO_ID    = 'uqVy4BYCrAk'

/**
 * Hero — Landing section with showreel video controlled via YouTube IFrame API.
 * Projector click calls player.playVideo() / player.pauseVideo() directly.
 */
export default function Hero({ onGetQuote }) {
  const initialized  = useRef(false)
  const playerRef    = useRef(null)
  const [projectorOn,  setProjectorOn]  = useState(false)
  const [playerReady,  setPlayerReady]  = useState(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    // ── Floating background particles ────────────────────────────────────────
    const heroBg = document.getElementById('hero-bg')
    if (heroBg) {
      for (let i = 0; i < 50; i++) {
        const p = document.createElement('div')
        p.className = 'particle'
        p.style.left              = Math.random() * 100 + '%'
        p.style.animationDelay    = Math.random() * 20 + 's'
        p.style.animationDuration = (Math.random() * 20 + 20) + 's'
        heroBg.appendChild(p)
      }
    }

    // ── Text scramble decode on h1 ───────────────────────────────────────────
    const h1 = document.querySelector('.hero-text h1')
    if (h1) {
      const original = h1.textContent
      let iteration  = 0
      setTimeout(() => {
        const interval = setInterval(() => {
          h1.textContent = original.split('').map((char, idx) => {
            if (char === ' ') return ' '
            if (idx < Math.floor(iteration)) return original[idx]
            return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
          }).join('')
          iteration += 1 / 3
          if (iteration >= original.length) { h1.textContent = original; clearInterval(interval) }
        }, 30)
      }, 300)
    }

    // ── YouTube IFrame Player API ────────────────────────────────────────────
    function initYTPlayer() {
      playerRef.current = new window.YT.Player('yt-player', {
        videoId: YT_VIDEO_ID,
        playerVars: {
          rel:             0,   // no related videos
          modestbranding:  1,   // smaller YT logo
          playsinline:     1,   // inline on iOS
          controls:        1,
        },
        events: {
          onReady(event) {
            // Make the iframe fill the container
            const iframe = event.target.getIframe()
            iframe.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:none;display:block;'
            setPlayerReady(true)
          },
        },
      })
    }

    onYTReady(initYTPlayer)
  }, [])

  // ── Programmatic play / pause ────────────────────────────────────────────
  useEffect(() => {
    if (!playerRef.current || !playerReady) return
    try {
      if (projectorOn) playerRef.current.playVideo()
      else             playerRef.current.pauseVideo()
    } catch (_) { /* player may not be fully ready */ }
  }, [projectorOn, playerReady])

  return (
    <section className="hero" id="home">
      <div className="hero-bg" id="hero-bg"></div>
      <div className="hero-content">
        <div className="hero-text">
          <h1>Bring Your Brand to Life</h1>

          <div className="audio-waveform" aria-hidden="true">
            {Array.from({ length: 20 }, (_, i) => (
              <span key={i} style={{ '--i': i }} />
            ))}
          </div>

          <p>We create compelling audio-visual content that captivates audiences and drives results. From voice-overs to full production, we&apos;re your creative partners.</p>
          <div className="cta-buttons">
            <button className="btn btn-primary" onClick={onGetQuote}>Get Free Quote</button>
            <a href="#portfolio" className="btn btn-secondary">View Portfolio</a>
          </div>
        </div>

        <div className="hero-visual">
          <div className={`video-frame${projectorOn ? ' projector-on' : ''}`}>
            {/* YouTube IFrame API mounts an <iframe> here, replacing this div */}
            <div id="yt-player" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />

            {/* Curtain — fades away when projector is switched on */}
            <div
              className={`video-curtain${projectorOn ? ' open' : ''}`}
              onClick={() => !projectorOn && setProjectorOn(true)}
              aria-hidden={projectorOn}
            >
              <div className="curtain-icon">▶</div>
              <span className="curtain-hint">Click projector to play</span>
            </div>
          </div>

          <ProjectorWidget on={projectorOn} onToggle={setProjectorOn} />
        </div>
      </div>
    </section>
  )
}
