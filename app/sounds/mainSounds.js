/**
 * mainSounds.js — Web Audio API synthesized sounds for main-site interactions.
 * Same lazy-AudioContext pattern as introSounds.js. No external audio files.
 *
 * Usage:
 *   import { createMainSoundEngine } from '../sounds/mainSounds'
 *   const sounds = createMainSoundEngine()
 *   sounds.playClapperSnap()
 */

export function createMainSoundEngine() {
  let audioCtx  = null
  let muted     = false

  // Persistent nodes for looping sounds
  let projectorHumGain = null
  let projectorHumOscs = null
  let neonBuzzGain     = null
  let neonBuzzOscs     = null
  let phoneRingTimer   = null
  let phoneRingActive  = false

  function getCtx() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    if (audioCtx.state === 'suspended') audioCtx.resume()
    return audioCtx
  }

  // ── Projector motor start: sine sweep 60→120Hz + sparse noise ───────────────
  function playProjectorStart() {
    if (muted) return
    const ctx = getCtx()
    const now = ctx.currentTime

    // Motor whir — sweep up
    const osc = ctx.createOscillator()
    const g   = ctx.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(30, now)
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.6)
    g.gain.setValueAtTime(0, now)
    g.gain.linearRampToValueAtTime(0.12, now + 0.15)
    g.gain.linearRampToValueAtTime(0.06, now + 0.6)
    osc.connect(g).connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.65)

    // Sparse mechanical noise (film loading)
    const bufSize = Math.floor(ctx.sampleRate * 0.5)
    const buf     = ctx.createBuffer(1, bufSize, ctx.sampleRate)
    const data    = buf.getChannelData(0)
    for (let i = 0; i < bufSize; i++) {
      data[i] = Math.random() < 0.04 ? (Math.random() * 2 - 1) * 0.6 : 0
    }
    const src  = ctx.createBufferSource()
    src.buffer = buf
    const filt = ctx.createBiquadFilter()
    filt.type = 'bandpass'
    filt.frequency.value = 2400
    filt.Q.value = 1.2
    const ng = ctx.createGain()
    ng.gain.setValueAtTime(0.18, now)
    ng.gain.linearRampToValueAtTime(0, now + 0.5)
    src.connect(filt).connect(ng).connect(ctx.destination)
    src.start(now)
  }

  // ── Projector continuous hum ─────────────────────────────────────────────────
  function startProjectorHum() {
    if (muted || projectorHumOscs) return
    const ctx = getCtx()
    const now = ctx.currentTime

    projectorHumGain = ctx.createGain()
    projectorHumGain.gain.setValueAtTime(0, now)
    projectorHumGain.gain.linearRampToValueAtTime(1, now + 0.4)
    projectorHumGain.connect(ctx.destination)

    const freqs  = [82, 164, 246]
    const gains  = [0.018, 0.028, 0.008]
    projectorHumOscs = freqs.map((f, i) => {
      const osc = ctx.createOscillator()
      const g   = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = f
      g.gain.value = gains[i]
      osc.connect(g).connect(projectorHumGain)
      osc.start(now)
      return osc
    })
  }

  function stopProjectorHum() {
    if (!projectorHumOscs || !audioCtx) return
    const now = audioCtx.currentTime
    projectorHumGain.gain.linearRampToValueAtTime(0, now + 0.4)
    projectorHumOscs.forEach(o => o.stop(now + 0.45))
    projectorHumOscs = null
    projectorHumGain = null
  }

  // ── Neon buzz: 120Hz + 240Hz harmonics ──────────────────────────────────────
  function startNeonBuzz() {
    if (muted || neonBuzzOscs) return
    const ctx = getCtx()
    const now = ctx.currentTime

    neonBuzzGain = ctx.createGain()
    neonBuzzGain.gain.setValueAtTime(0, now)
    neonBuzzGain.gain.linearRampToValueAtTime(1, now + 0.15)
    neonBuzzGain.connect(ctx.destination)

    const freqs = [120, 240, 360]
    const gains = [0.014, 0.022, 0.006]
    neonBuzzOscs = freqs.map((f, i) => {
      const osc = ctx.createOscillator()
      const g   = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = f
      g.gain.value = gains[i]
      osc.connect(g).connect(neonBuzzGain)
      osc.start(now)
      return osc
    })
  }

  function stopNeonBuzz() {
    if (!neonBuzzOscs || !audioCtx) return
    const now = audioCtx.currentTime
    neonBuzzGain.gain.linearRampToValueAtTime(0, now + 0.2)
    neonBuzzOscs.forEach(o => o.stop(now + 0.25))
    neonBuzzOscs = null
    neonBuzzGain = null
  }

  // ── Brief neon crackle (per-character flicker) ───────────────────────────────
  function playNeonCrackle() {
    if (muted) return
    const ctx = getCtx()
    const now = ctx.currentTime

    const bufSize = Math.floor(ctx.sampleRate * 0.04)
    const buf     = ctx.createBuffer(1, bufSize, ctx.sampleRate)
    const data    = buf.getChannelData(0)
    for (let i = 0; i < bufSize; i++) {
      data[i] = Math.random() < 0.12 ? (Math.random() * 2 - 1) : 0
    }
    const src  = ctx.createBufferSource()
    src.buffer = buf
    const filt = ctx.createBiquadFilter()
    filt.type = 'bandpass'
    filt.frequency.value = 1800
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.22, now)
    g.gain.linearRampToValueAtTime(0, now + 0.04)
    src.connect(filt).connect(g).connect(ctx.destination)
    src.start(now)
  }

  // ── Phone ring: alternating 480Hz / 620Hz bursts ────────────────────────────
  function startPhoneRing() {
    if (muted || phoneRingActive) return
    phoneRingActive = true
    const ctx = getCtx()

    function ringBurst() {
      if (!phoneRingActive) return
      const now = ctx.currentTime

      ;[480, 620].forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const g   = ctx.createGain()
        osc.frequency.value = freq
        osc.type = 'sine'
        const t = now + i * 0.025
        g.gain.setValueAtTime(0, t)
        g.gain.linearRampToValueAtTime(0.07, t + 0.01)
        g.gain.linearRampToValueAtTime(0, t + 0.025)
        osc.connect(g).connect(ctx.destination)
        osc.start(t)
        osc.stop(t + 0.03)
      })
    }

    // Ring pattern: 2 bursts, pause 1.4s, repeat
    function ringCycle() {
      if (!phoneRingActive) return
      ringBurst()
      setTimeout(() => { if (phoneRingActive) ringBurst() }, 300)
      phoneRingTimer = setTimeout(ringCycle, 1800)
    }
    ringCycle()
  }

  function stopPhoneRing() {
    phoneRingActive = false
    if (phoneRingTimer) { clearTimeout(phoneRingTimer); phoneRingTimer = null }
  }

  // ── Phone pickup: click + 440Hz connect tone ─────────────────────────────────
  function playPhonePickup() {
    if (muted) return
    const ctx = getCtx()
    const now = ctx.currentTime

    // Click
    const bufSize = Math.floor(ctx.sampleRate * 0.02)
    const buf     = ctx.createBuffer(1, bufSize, ctx.sampleRate)
    const data    = buf.getChannelData(0)
    for (let i = 0; i < bufSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufSize, 6)
    }
    const src  = ctx.createBufferSource()
    src.buffer = buf
    const fg   = ctx.createGain()
    fg.gain.value = 0.3
    src.connect(fg).connect(ctx.destination)
    src.start(now)

    // Dial tone — short 440Hz sine fading in then out
    const osc = ctx.createOscillator()
    const og  = ctx.createGain()
    osc.frequency.value = 440
    og.gain.setValueAtTime(0, now + 0.04)
    og.gain.linearRampToValueAtTime(0.04, now + 0.15)
    og.gain.linearRampToValueAtTime(0, now + 0.55)
    osc.connect(og).connect(ctx.destination)
    osc.start(now + 0.04)
    osc.stop(now + 0.6)
  }

  // ── Clapperboard snap: sharp attack noise burst ──────────────────────────────
  function playClapperSnap() {
    if (muted) return
    const ctx = getCtx()
    const now = ctx.currentTime

    const bufSize = Math.floor(ctx.sampleRate * 0.06)
    const buf     = ctx.createBuffer(1, bufSize, ctx.sampleRate)
    const data    = buf.getChannelData(0)
    for (let i = 0; i < bufSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufSize, 3)
    }
    const src  = ctx.createBufferSource()
    src.buffer = buf

    const hp = ctx.createBiquadFilter()
    hp.type = 'highpass'
    hp.frequency.value = 800

    const g = ctx.createGain()
    g.gain.setValueAtTime(0.55, now)
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.06)

    src.connect(hp).connect(g).connect(ctx.destination)
    src.start(now)
  }

  // ── Fader touch: short click ─────────────────────────────────────────────────
  function playFaderClick() {
    if (muted) return
    const ctx = getCtx()
    const now = ctx.currentTime

    const bufSize = Math.floor(ctx.sampleRate * 0.008)
    const buf     = ctx.createBuffer(1, bufSize, ctx.sampleRate)
    const data    = buf.getChannelData(0)
    for (let i = 0; i < bufSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufSize, 10)
    }
    const src = ctx.createBufferSource()
    src.buffer = buf
    const g   = ctx.createGain()
    g.gain.value = 0.2
    src.connect(g).connect(ctx.destination)
    src.start(now)
  }

  // ── VHS static burst: 80ms bandpass noise ────────────────────────────────────
  function playVHSStatic() {
    if (muted) return
    const ctx = getCtx()
    const now = ctx.currentTime

    const bufSize = Math.floor(ctx.sampleRate * 0.08)
    const buf     = ctx.createBuffer(1, bufSize, ctx.sampleRate)
    const data    = buf.getChannelData(0)
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1

    const src  = ctx.createBufferSource()
    src.buffer = buf

    const bp = ctx.createBiquadFilter()
    bp.type = 'bandpass'
    bp.frequency.value = 2500
    bp.Q.value = 0.8

    const g = ctx.createGain()
    g.gain.setValueAtTime(0.12, now)
    g.gain.linearRampToValueAtTime(0, now + 0.08)

    src.connect(bp).connect(g).connect(ctx.destination)
    src.start(now)
  }

  // ── Mute ────────────────────────────────────────────────────────────────────
  function toggleMute() {
    muted = !muted
    if (muted) { stopProjectorHum(); stopNeonBuzz(); stopPhoneRing() }
    return muted
  }

  return {
    playProjectorStart,
    startProjectorHum,
    stopProjectorHum,
    startNeonBuzz,
    stopNeonBuzz,
    playNeonCrackle,
    startPhoneRing,
    stopPhoneRing,
    playPhonePickup,
    playClapperSnap,
    playFaderClick,
    playVHSStatic,
    toggleMute,
  }
}
