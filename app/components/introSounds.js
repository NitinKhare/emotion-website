/**
 * introSounds.js — Web Audio API synthesized sound effects for the intro animation.
 * No external audio files needed — all sounds are generated programmatically.
 *
 * Usage:
 *   const sounds = createSoundEngine()
 *   sounds.playDoorCreak()
 *   sounds.playSwitchClick()
 *   sounds.toggleMute()  // returns new muted state
 */

export function createSoundEngine() {
  let audioCtx = null
  let muted = false
  let humOsc = null
  let humGain = null
  let doorBuffer = null

  /** Lazily create / resume the AudioContext (browsers require user gesture) */
  function getCtx() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume()
    }
    return audioCtx
  }

  // ─── Door creak: low sine sweep + gritty sawtooth layer ───
async function playDoorCreak() {
  if (muted) return

  const ctx = getCtx()

  // Load once
  if (!doorBuffer) {
    const res = await fetch("/audio/door-creek.mp3")
    const arrayBuffer = await res.arrayBuffer()
    doorBuffer = await ctx.decodeAudioData(arrayBuffer)
  }

  const source = ctx.createBufferSource()
  source.buffer = doorBuffer

  const gain = ctx.createGain()
  gain.gain.value = 0.8  // adjust if too loud

  source.connect(gain).connect(ctx.destination)

  source.start(0)
}
  // ─── Switch click: snappy filtered noise burst ───
  function playSwitchClick() {
    if (muted) return
    const ctx = getCtx()
    const now = ctx.currentTime

    const bufferSize = Math.floor(ctx.sampleRate * 0.035)
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 8)
    }

    const source = ctx.createBufferSource()
    source.buffer = buffer

    const filter = ctx.createBiquadFilter()
    filter.type = 'highpass'
    filter.frequency.value = 1200

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.35, now)

    source.connect(filter).connect(gain).connect(ctx.destination)
    source.start(now)
  }

  // ─── Bulb flicker: realistic electrical crackle + multi-burst zap ───
  function playBulbFlicker() {
    if (muted) return
    const ctx = getCtx()
    const now = ctx.currentTime

    // Sparse impulse noise for crackle character
    const crackleBuf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.12), ctx.sampleRate)
    const crackleData = crackleBuf.getChannelData(0)
    for (let i = 0; i < crackleData.length; i++) {
      crackleData[i] = Math.random() < 0.08 ? (Math.random() * 2 - 1) : 0
    }
    const crackleSource = ctx.createBufferSource()
    crackleSource.buffer = crackleBuf
    const crackleFilter = ctx.createBiquadFilter()
    crackleFilter.type = 'bandpass'
    crackleFilter.frequency.value = 3000
    crackleFilter.Q.value = 0.5
    const crackleGain = ctx.createGain()
    crackleGain.gain.setValueAtTime(0.28, now)
    crackleGain.gain.linearRampToValueAtTime(0, now + 0.12)
    crackleSource.connect(crackleFilter).connect(crackleGain).connect(ctx.destination)
    crackleSource.start(now)

    // Primary 60Hz zap burst
    const zapOsc = ctx.createOscillator()
    const zapGain = ctx.createGain()
    zapOsc.type = 'sawtooth'
    zapOsc.frequency.value = 60
    zapGain.gain.setValueAtTime(0.0, now)
    zapGain.gain.linearRampToValueAtTime(0.14, now + 0.015)
    zapGain.gain.linearRampToValueAtTime(0, now + 0.10)
    zapOsc.connect(zapGain).connect(ctx.destination)
    zapOsc.start(now)
    zapOsc.stop(now + 0.11)

    // Secondary micro-flicker at a random short offset
    const delay = 0.05 + Math.random() * 0.06
    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.type = 'sawtooth'
    osc2.frequency.value = 60
    gain2.gain.setValueAtTime(0, now + delay)
    gain2.gain.linearRampToValueAtTime(0.07, now + delay + 0.01)
    gain2.gain.linearRampToValueAtTime(0, now + delay + 0.05)
    osc2.connect(gain2).connect(ctx.destination)
    osc2.start(now + delay)
    osc2.stop(now + delay + 0.06)
  }

  // ─── Bulb hum: continuous 60Hz fundamental + 120Hz + 180Hz harmonics ───
  function startBulbHum() {
    if (muted) return
    const ctx = getCtx()
    const now = ctx.currentTime

    // Master gain envelope — fade in over 0.6s
    humGain = ctx.createGain()
    humGain.gain.setValueAtTime(0, now)
    humGain.gain.linearRampToValueAtTime(1, now + 0.6)
    humGain.connect(ctx.destination)

    // 60Hz fundamental
    const osc1 = ctx.createOscillator()
    const g1 = ctx.createGain()
    osc1.type = 'sine'
    osc1.frequency.value = 60
    g1.gain.value = 0.010
    osc1.connect(g1).connect(humGain)
    osc1.start(now)

    // 120Hz — dominant electrical hum component
    const osc2 = ctx.createOscillator()
    const g2 = ctx.createGain()
    osc2.type = 'sine'
    osc2.frequency.value = 120
    g2.gain.value = 0.022
    osc2.connect(g2).connect(humGain)
    osc2.start(now)

    // 180Hz — 3rd harmonic for gritty character
    const osc3 = ctx.createOscillator()
    const g3 = ctx.createGain()
    osc3.type = 'sine'
    osc3.frequency.value = 180
    g3.gain.value = 0.007
    osc3.connect(g3).connect(humGain)
    osc3.start(now)

    // Store all three for cleanup
    humOsc = [osc1, osc2, osc3]
  }

  function stopBulbHum() {
    if (humOsc && humGain && audioCtx) {
      const now = audioCtx.currentTime
      humGain.gain.linearRampToValueAtTime(0, now + 0.3)
      const oscs = Array.isArray(humOsc) ? humOsc : [humOsc]
      oscs.forEach(osc => osc.stop(now + 0.35))
      humOsc = null
      humGain = null
    }
  }

  // ─── Logo reveal: soft rising shimmer ───
  function playLogoReveal() {
    if (muted) return
    const ctx = getCtx()
    const now = ctx.currentTime

    // Rising sine tone
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(220, now)
    osc.frequency.exponentialRampToValueAtTime(660, now + 1.4)
    gain.gain.setValueAtTime(0, now)
    gain.gain.linearRampToValueAtTime(0.07, now + 0.3)
    gain.gain.linearRampToValueAtTime(0.03, now + 1.0)
    gain.gain.linearRampToValueAtTime(0, now + 1.5)
    osc.connect(gain).connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 1.5)

    // Harmonic pad
    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.type = 'triangle'
    osc2.frequency.setValueAtTime(330, now)
    osc2.frequency.exponentialRampToValueAtTime(880, now + 1.4)
    gain2.gain.setValueAtTime(0, now)
    gain2.gain.linearRampToValueAtTime(0.025, now + 0.5)
    gain2.gain.linearRampToValueAtTime(0, now + 1.5)
    osc2.connect(gain2).connect(ctx.destination)
    osc2.start(now)
    osc2.stop(now + 1.5)
  }

  // ─── Enter whoosh: cinematic filtered noise sweep ───
  function playEnterWhoosh() {
    if (muted) return
    const ctx = getCtx()
    const now = ctx.currentTime

    const bufferSize = Math.floor(ctx.sampleRate * 0.9)
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }

    const source = ctx.createBufferSource()
    source.buffer = buffer

    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(200, now)
    filter.frequency.exponentialRampToValueAtTime(4000, now + 0.25)
    filter.frequency.exponentialRampToValueAtTime(80, now + 0.9)
    filter.Q.value = 1.2

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0, now)
    gain.gain.linearRampToValueAtTime(0.14, now + 0.12)
    gain.gain.linearRampToValueAtTime(0, now + 0.9)

    source.connect(filter).connect(gain).connect(ctx.destination)
    source.start(now)
    source.stop(now + 0.9)
  }

  // ─── Mute control ───
  function toggleMute() {
    muted = !muted
    if (muted) stopBulbHum()
    return muted
  }

  function isMuted() {
    return muted
  }

  return {
    playDoorCreak,
    playSwitchClick,
    playBulbFlicker,
    startBulbHum,
    stopBulbHum,
    playLogoReveal,
    playEnterWhoosh,
    toggleMute,
    isMuted,
  }
}
