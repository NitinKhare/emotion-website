'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { createSoundEngine } from './introSounds'
import AgencyReel from './AgencyReel'

/**
 * IntroAnimation — Full-screen interactive intro sequence.
 * Flow: Tap door → door opens → flip switch → bulb flickers on → logo reveals → "Enter Studio" → Agency Reel → site
 * The switch is toggleable on/off at any time.
 */
export default function IntroAnimation({ clientLogos = [], onIntroComplete }) {
  const introStateRef = useRef('door')   // 'door' | 'transitioning' | 'switch' | 'logo' | 'done'
  const lightIsOnRef = useRef(false)
  const switchBusyRef = useRef(false)
  const initialized = useRef(false)
  const sounds = createSoundEngine()
  const [reelVisible, setReelVisible] = useState(false)

  // Step 1: Open the door
  function openDoor() {
    if (introStateRef.current !== 'door') return
    introStateRef.current = 'transitioning'
    sounds.playDoorCreak();
    const door = document.getElementById('door')
    const doorFrame = document.getElementById('doorFrame')
    const doorPrompt = document.getElementById('doorPrompt')

    door.classList.add('opening')
    doorFrame.classList.add('cracked')
    doorPrompt.style.opacity = '0'

    setTimeout(() => {
      const room = document.getElementById('room')
      room.classList.add('visible')

      doorFrame.style.transition = 'opacity 0.8s ease'
      doorFrame.style.opacity = '0'
      doorFrame.style.pointerEvents = 'none'
      document.querySelector('.hallway').style.transition = 'opacity 0.8s ease'
      document.querySelector('.hallway').style.opacity = '0'
      document.querySelector('.hallway').style.pointerEvents = 'none'

      introStateRef.current = 'switch'
    }, 1200)
  }

  // Step 2: Flip the light switch (toggleable on/off)
  function flipSwitch() {
    if (introStateRef.current !== 'switch' && introStateRef.current !== 'logo') return
    if (switchBusyRef.current) return
    switchBusyRef.current = true
    sounds.playSwitchClick();
    const toggle = document.getElementById('switchToggle')
    const bulb = document.getElementById('bulb')
    const roomLight = document.getElementById('roomLight')
    const lightCone = document.getElementById('lightCone')
    const switchPrompt = document.getElementById('switchPrompt')
    const introLogo = document.getElementById('introLogo')
    const enterBtn = document.getElementById('enterBtn')

    switchPrompt.style.opacity = '0'

    if (!lightIsOnRef.current) {
      // --- Turn ON ---
      toggle.classList.add('on')
      setTimeout(() => {
        bulb.classList.add('lit')
        sounds.playBulbFlicker()
        setTimeout(() => { bulb.classList.remove('lit') }, 100)
        setTimeout(() => { bulb.classList.add('lit'); sounds.playBulbFlicker() }, 200)
        setTimeout(() => { bulb.classList.remove('lit') }, 280)
        setTimeout(() => {
          bulb.classList.add('lit')
          roomLight.classList.add('on')
          lightCone.classList.add('on')
          sounds.startBulbHum()
          lightIsOnRef.current = true

          setTimeout(() => {
            introLogo.classList.add('visible')
            sounds.playLogoReveal()
            setTimeout(() => {
              enterBtn.classList.add('show')
            }, 500)
            introStateRef.current = 'logo'
            switchBusyRef.current = false
          }, 800)
        }, 380)
      }, 200)
    } else {
      // --- Turn OFF ---
      toggle.classList.remove('on')
      sounds.stopBulbHum()

      bulb.classList.remove('lit')
      roomLight.classList.remove('on')
      lightCone.classList.remove('on')
      introLogo.classList.remove('visible')
      enterBtn.classList.remove('show')
      lightIsOnRef.current = false
      introStateRef.current = 'switch'

      setTimeout(() => {
        switchBusyRef.current = false
      }, 300)
    }
  }

  // Step 3: Enter the website — show Agency Reel first, then reveal site
  function enterSite() {
    if (introStateRef.current !== 'logo') return
    introStateRef.current = 'done'
    sounds.stopBulbHum()
    window.scrollTo(0, 0)

    if (clientLogos.length > 0) {
      // Show the reel overlay; site reveals after reel finishes
      setReelVisible(true)
    } else {
      // No logos: fall back to direct fade
      const overlay = document.getElementById('introOverlay')
      overlay.classList.add('hidden')
      setTimeout(() => {
        overlay.remove()
        onIntroComplete?.()
      }, 1000)
    }
  }

  // Called by AgencyReel when its display timer expires.
  // Sequence:
  //   1. Fade the intro overlay OUT while the reel stays fully visible on top.
  //   2. Once overlay is gone (~900ms), fade the reel itself out.
  //   3. After reel fade (~850ms), unmount everything.
  function handleReelDone() {
    const overlay = document.getElementById('introOverlay')
    if (overlay) overlay.classList.add('hidden')   // fades under the still-visible reel

    setTimeout(() => {
      // Overlay is now invisible — fade the reel over the clean site
      const reelEl = document.querySelector('.agency-reel')
      if (reelEl) reelEl.classList.add('reel-fade-out')

      setTimeout(() => {
        if (overlay) overlay.remove()
        setReelVisible(false)
        onIntroComplete?.()
      }, 850)
    }, 900)
  }

  // Create dust particles on mount
  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const scene = document.getElementById('scene')
    if (scene) {
      for (let i = 0; i < 20; i++) {
        const dust = document.createElement('div')
        dust.className = 'dust'
        dust.style.left = Math.random() * 100 + '%'
        dust.style.top = Math.random() * 100 + '%'
        dust.style.animationDelay = Math.random() * 8 + 's'
        dust.style.animationDuration = (6 + Math.random() * 6) + 's'
        scene.appendChild(dust)
      }
    }
  }, [])

  return (
    <>
    {reelVisible && (
      <AgencyReel clientLogos={clientLogos} onDone={handleReelDone} />
    )}
    <div className="intro-overlay" id="introOverlay">
      <div className="scene" id="scene">
        {/* Dark Hallway */}
        <div className="hallway"></div>

        {/* Door */}
        <div className="door-frame" id="doorFrame">
          <div className="door-light-spill"></div>
          <div className="door" id="door" onClick={openDoor}>
            <div className="door-panel top"></div>
            <div className="door-panel bottom"></div>
            <div className="door-handle"></div>
          </div>
          <div className="door-prompt" id="doorPrompt">Tap the door</div>
        </div>

        {/* Room (appears after door opens) */}
        <div className="room" id="room">
          <div className="room-wall"></div>

          {/* Light Bulb */}
          <div className="bulb-container">
            <div className="bulb-wire"></div>
            <div className="bulb-fixture"></div>
            <div className="bulb" id="bulb">
              <div className="filament"></div>
            </div>
          </div>

          {/* Light Cone */}
          <div className="light-cone" id="lightCone"></div>

          {/* Room Light Effect */}
          <div className="room-light" id="roomLight"></div>

          {/* Light Switch */}
          <div className="switch-container" id="switchContainer" onClick={flipSwitch}>
            <div className="switch-prompt" id="switchPrompt">Flip the switch</div>
            <div className="switch-plate">
              <div className="switch-toggle" id="switchToggle"></div>
            </div>
          </div>

          {/* Logo Reveal */}
          <div className="intro-logo" id="introLogo">
            <Image src="/Emotion.png" alt="E-Motion Production" width={400} height={400} priority style={{ maxWidth: 'clamp(200px, 40vw, 400px)', height: 'auto', width: 'auto' }} />
            <p>Production</p>
            <button className="enter-btn" id="enterBtn" onClick={enterSite}>Enter Studio</button>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
