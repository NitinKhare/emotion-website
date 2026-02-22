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

  // ─── Bulb flicker: brief electrical zap ───
  function playBulbFlicker() {
    if (muted) return
    const ctx = getCtx()
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sawtooth'
    osc.frequency.value = 60
    gain.gain.setValueAtTime(0.06, now)
    gain.gain.linearRampToValueAtTime(0, now + 0.08)
    osc.connect(gain).connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.08)
  }

  // ─── Bulb hum: continuous subtle 120Hz (2nd harmonic of mains) ───
  function startBulbHum() {
    if (muted) return
    const ctx = getCtx()
    const now = ctx.currentTime

    humOsc = ctx.createOscillator()
    humGain = ctx.createGain()
    humOsc.type = 'sine'
    humOsc.frequency.value = 120
    humGain.gain.setValueAtTime(0, now)
    humGain.gain.linearRampToValueAtTime(0.018, now + 0.6)
    humOsc.connect(humGain).connect(ctx.destination)
    humOsc.start(now)
  }

  function stopBulbHum() {
    if (humOsc && humGain && audioCtx) {
      const now = audioCtx.currentTime
      humGain.gain.linearRampToValueAtTime(0, now + 0.3)
      humOsc.stop(now + 0.35)
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
