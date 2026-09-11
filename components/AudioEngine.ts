// Procedural Web Audio API Ambient Soundscape for AquaGuard

class SoundscapeEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private noiseNode: AudioBufferSourceNode | null = null;
  private subOsc: OscillatorNode | null = null;
  private droneOsc: OscillatorNode | null = null;
  private isPlaying: boolean = false;

  private init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AudioContextClass();

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);
  }

  public start() {
    this.init();
    if (!this.ctx || !this.masterGain) return;

    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }

    // 1. Deep Sub-Ocean Drone (44 Hz)
    this.subOsc = this.ctx.createOscillator();
    this.subOsc.type = "sine";
    this.subOsc.frequency.setValueAtTime(44, this.ctx.currentTime);

    const subFilter = this.ctx.createBiquadFilter();
    subFilter.type = "lowpass";
    subFilter.frequency.setValueAtTime(80, this.ctx.currentTime);

    const subGain = this.ctx.createGain();
    subGain.gain.setValueAtTime(0.18, this.ctx.currentTime);

    this.subOsc.connect(subFilter);
    subFilter.connect(subGain);
    subGain.connect(this.masterGain);
    this.subOsc.start();

    // 2. Harmonic Engine Vibration (88 Hz)
    this.droneOsc = this.ctx.createOscillator();
    this.droneOsc.type = "triangle";
    this.droneOsc.frequency.setValueAtTime(88, this.ctx.currentTime);

    const droneGain = this.ctx.createGain();
    droneGain.gain.setValueAtTime(0.04, this.ctx.currentTime);

    this.droneOsc.connect(droneGain);
    droneGain.connect(this.masterGain);
    this.droneOsc.start();

    // 3. Underwater Hydrophone Pink/Brown Flow Noise
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5;
    }

    this.noiseNode = this.ctx.createBufferSource();
    this.noiseNode.buffer = noiseBuffer;
    this.noiseNode.loop = true;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = "bandpass";
    noiseFilter.frequency.setValueAtTime(140, this.ctx.currentTime);
    noiseFilter.Q.setValueAtTime(1.5, this.ctx.currentTime);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.09, this.ctx.currentTime);

    this.noiseNode.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.masterGain);
    this.noiseNode.start();

    // Smooth fade in
    this.masterGain.gain.linearRampToValueAtTime(0.6, this.ctx.currentTime + 1.5);
    this.isPlaying = true;
  }

  public stop() {
    if (!this.ctx || !this.masterGain || !this.isPlaying) return;

    this.masterGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.8);
    setTimeout(() => {
      try {
        this.subOsc?.stop();
        this.droneOsc?.stop();
        this.noiseNode?.stop();
      } catch {}
      this.isPlaying = false;
    }, 850);
  }

  public playSonarPing() {
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(1240, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.6);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 1.25);
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  public getActive(): boolean {
    return this.isPlaying;
  }
}

export const soundscape = typeof window !== "undefined" ? new SoundscapeEngine() : null;
