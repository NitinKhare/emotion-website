'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { PORTFOLIO_VIDEOS } from '../data/videos'
import { createMainSoundEngine } from '../sounds/mainSounds'

const TOTAL = PORTFOLIO_VIDEOS.length

/**
 * BroadcastMonitor — Vintage CSS broadcast monitor + TV remote control.
 *
 * Navigation is via the CSS-drawn remote beside the monitor (CH▲ / CH▼),
 * so any number of videos in videos.js works without overflow.
 * Dot indicators at the bottom show current position.
 */
export default function BroadcastMonitor() {
  const [activeIdx,   setActiveIdx]   = useState(0)
  const [playerReady, setPlayerReady] = useState(false)
  const [irFlash,     setIrFlash]     = useState(false)   // remote IR LED
  const [isPlaying,   setIsPlaying]   = useState(false)   // track play/pause for power btn

  const playerRef   = useRef(null)
  const staticRef   = useRef(null)
  const ledRef      = useRef(null)
  const readoutRef  = useRef(null)
  const soundsRef   = useRef(null)
  const initialized = useRef(false)
  const activeRef   = useRef(0)   // shadow of activeIdx for use inside closures

  // ── Boot ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    soundsRef.current = createMainSoundEngine()

    function initPlayer() {
      playerRef.current = new window.YT.Player('broadcast-player', {
        videoId: PORTFOLIO_VIDEOS[0].id,
        playerVars: { rel: 0, modestbranding: 1, playsinline: 1, controls: 1, autoplay: 0 },
        events: {
          onReady(event) {
            const iframe = event.target.getIframe()
            iframe.style.cssText =
              'position:absolute;inset:0;width:100%;height:100%;border:none;display:block;'
            setPlayerReady(true)
            if (ledRef.current) ledRef.current.classList.add('on')
          },
          onStateChange(event) {
            // YT.PlayerState.PLAYING = 1, PAUSED = 2, ENDED = 0
            setIsPlaying(event.data === 1)
          },
        },
      })
    }

    if (window.YT && window.YT.Player) {
      initPlayer()
    } else {
      window.onYouTubeIframeAPIReady = initPlayer
      if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        const tag = document.createElement('script')
        tag.src   = 'https://www.youtube.com/iframe_api'
        document.head.appendChild(tag)
      }
    }
  }, [])

  // ── Channel switch ───────────────────────────────────────────────────────
  const switchChannel = useCallback((idx) => {
    if (idx === activeRef.current || !playerRef.current || !playerReady) return

    const video = PORTFOLIO_VIDEOS[idx]

    // Flash + sound
    if (staticRef.current) staticRef.current.classList.add('visible')
    soundsRef.current?.playVHSStatic()

    // Brief IR flash on remote
    setIrFlash(true)
    setTimeout(() => setIrFlash(false), 200)

    setTimeout(() => {
      try {
        playerRef.current.loadVideoById(video.id)
        playerRef.current.playVideo()
      } catch (_) {}

      if (readoutRef.current) readoutRef.current.textContent = `CH ${video.channel}`
      if (staticRef.current)  staticRef.current.classList.remove('visible')

      activeRef.current = idx
      setActiveIdx(idx)
    }, 180)
  }, [playerReady])

  const chUp   = () => switchChannel((activeRef.current + 1) % TOTAL)
  const chDown = () => switchChannel((activeRef.current - 1 + TOTAL) % TOTAL)

  const togglePower = () => {
    if (!playerRef.current || !playerReady) return
    try {
      if (isPlaying) {
        playerRef.current.pauseVideo()
      } else {
        playerRef.current.playVideo()
      }
    } catch (_) {}
    setIrFlash(true)
    setTimeout(() => setIrFlash(false), 200)
  }

  const currentVideo = PORTFOLIO_VIDEOS[activeIdx]

  return (
    <section className="broadcast-section" id="portfolio">
      <div className="section-header animate-on-scroll">
        <h2>Our Work</h2>
        <p>Ads, films, and audio-visual productions — use the remote to switch channels</p>
      </div>

      {/* Monitor + Remote side by side */}
      <div className="monitor-and-remote">

        {/* ── TV Monitor ─────────────────────────────────────────────────── */}
        <div className="monitor-wrap">
          <div className="monitor-frame">
            <div className="monitor-screen">
              <div id="broadcast-player" />
              <div className="crt-lines"   aria-hidden="true" />
              <div className="static-flash" ref={staticRef} aria-hidden="true" />
            </div>

            <div className="monitor-chin">
              <div className="monitor-chin-left">
                <div className="power-led" ref={ledRef} />
                <span className="monitor-brand">E·MOTION</span>
              </div>
              <span className="ch-readout" ref={readoutRef}>
                CH {PORTFOLIO_VIDEOS[0].channel}
              </span>
            </div>
          </div>

          <div className="monitor-stand">
            <div className="monitor-neck" />
            <div className="monitor-base" />
          </div>

          {/* Dot indicators — one per video, scales without overflow */}
          <div className="channel-dots" aria-label={`Channel ${activeIdx + 1} of ${TOTAL}`}>
            {PORTFOLIO_VIDEOS.map((v, i) => (
              <button
                key={v.id}
                className={`ch-dot${i === activeIdx ? ' active' : ''}`}
                onClick={() => switchChannel(i)}
                aria-label={`Switch to channel ${v.channel}`}
                aria-current={i === activeIdx}
              />
            ))}
          </div>
        </div>

        {/* ── CSS Remote Control ─────────────────────────────────────────── */}
        <div className="remote-wrap" aria-label="TV remote control">

          {/* IR LED at top */}
          <div className={`remote-ir${irFlash ? ' flash' : ''}`} aria-hidden="true" />

          {/* LCD display */}
          <div className="remote-display" aria-live="polite">
            <span className="remote-display-ch">CH {currentVideo.channel}</span>
            <span className="remote-display-label">{currentVideo.label}</span>
          </div>

          {/* Power button — pauses / plays video */}
          <button
            className={`remote-power-btn${isPlaying ? ' playing' : ''}`}
            onClick={togglePower}
            aria-label={isPlaying ? 'Pause video' : 'Play video'}
          />

          {/* CH UP / DOWN — the real controls */}
          <div className="remote-ch-group">
            <button className="remote-ch-btn" onClick={chUp}   aria-label="Next channel">▲</button>
            <span   className="remote-ch-label">CH</span>
            <button className="remote-ch-btn" onClick={chDown} aria-label="Previous channel">▼</button>
          </div>

          {/* Cosmetic volume buttons */}
          <div className="remote-vol-group" aria-hidden="true">
            <button className="remote-vol-btn">+</button>
            <span className="remote-vol-label">VOL</span>
            <button className="remote-vol-btn">−</button>
          </div>

          {/* Cosmetic D-pad */}
          <div className="remote-dpad" aria-hidden="true">
            <div className="dpad-up"    />
            <div className="dpad-row">
              <div className="dpad-left"   />
              <div className="dpad-center" />
              <div className="dpad-right"  />
            </div>
            <div className="dpad-down"  />
          </div>

          {/* Cosmetic number key grid */}
          <div className="remote-num-grid" aria-hidden="true">
            {Array.from({ length: 12 }, (_, i) => (
              <div key={i} className="remote-num-key" />
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
