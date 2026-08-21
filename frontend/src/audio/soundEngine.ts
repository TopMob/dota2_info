class SoundEngine {
  private ctx: AudioContext | null = null
  private isMuted: boolean = false
  private masterVolume: number = 0.8

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      this.ctx = new AudioContextClass()
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted
  }

  public getMuted(): boolean {
    return this.isMuted
  }

  public setVolume(volume: number) {
    this.masterVolume = Math.max(0, Math.min(1, volume))
  }

  public getVolume(): number {
    return this.masterVolume
  }

  public playTone(freq: number, duration: number, type: OscillatorType = 'sine', gainVal: number = 0.3) {
    if (this.isMuted) return
    this.initContext()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = type
    osc.frequency.setValueAtTime(freq, now)

    gain.gain.setValueAtTime(gainVal * this.masterVolume, now)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration)

    osc.connect(gain)
    gain.connect(this.ctx.destination)

    osc.start(now)
    osc.stop(now + duration)
  }

  public playCue(soundId: string) {
    if (this.isMuted) return
    this.initContext()
    if (!this.ctx) return

    switch (soundId) {
      case 'water_rune':
      case 'water_rune_warning':
        this.playChord([659.25, 880.00], 0.35, 'sine', 0.22)
        break
      case 'bounty_rune':
      case 'bounty_rune_warning':
        this.playChord([523.25, 659.25, 1046.50], 0.45, 'triangle', 0.2)
        break
      case 'wisdom_rune':
      case 'wisdom_rune_warning':
        this.playChord([523.25, 659.25, 783.99], 0.6, 'sine', 0.25)
        break
      case 'lotus_pool':
      case 'lotus_pool_warning':
        this.playTone(440, 0.25, 'triangle', 0.2)
        setTimeout(() => this.playTone(587.33, 0.4, 'sine', 0.25), 120)
        break
      case 'stack_alert':
        this.playTone(880, 0.15, 'sine', 0.2)
        break
      case 'neutrals_unlocked':
        this.playChord([392.00, 523.25, 659.25, 1046.50], 0.9, 'triangle', 0.22)
        break
      case 'tormentor':
      case 'tormentor_warning':
        this.playTone(330, 0.3, 'sawtooth', 0.15)
        setTimeout(() => this.playTone(440, 0.4, 'triangle', 0.2), 150)
        break
      case 'roshan_window':
        this.playChord([220.00, 277.18, 329.63], 0.7, 'sawtooth', 0.18)
        break
      case 'buyback_deficit':
        this.playTone(220, 0.2, 'square', 0.12)
        setTimeout(() => this.playTone(200, 0.3, 'square', 0.15), 150)
        break
      default:
        this.playTone(600, 0.2, 'sine', 0.2)
        break
    }
  }

  public playChord(frequencies: number[], duration: number, type: OscillatorType = 'sine', gainPerVoice: number = 0.15) {
    if (this.isMuted) return
    this.initContext()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const masterGain = this.ctx.createGain()
    masterGain.gain.setValueAtTime(this.masterVolume, now)
    masterGain.connect(this.ctx.destination)

    frequencies.forEach((freq, index) => {
      if (!this.ctx) return
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = type
      osc.frequency.setValueAtTime(freq, now + index * 0.04)

      gain.gain.setValueAtTime(gainPerVoice, now + index * 0.04)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration)

      osc.connect(gain)
      gain.connect(masterGain)

      osc.start(now + index * 0.04)
      osc.stop(now + duration)
    })
  }
}

export const soundEngine = new SoundEngine()
