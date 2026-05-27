// Web Audio API Procedural Background Music Synthesizer
// Synthesizes pleasant electronic rhythms, retro space-synths, and lofi ambient tracks on-the-fly.

export class ProceduralSynthesizer {
  private ctx: AudioContext | null = null;
  private isRunning = false;
  private intervalId: any = null;
  private currentTrack: "lofi" | "synthwave" | "minimal" | "ambient" = "lofi";
  private step = 0;
  private mainVolumeNode: GainNode | null = null;
  private volumeValue = 0.3;

  constructor() {
    // Initialized lazily upon first interaction (browser policy)
  }

  private init() {
    if (this.ctx) return;
    try {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.mainVolumeNode = this.ctx.createGain();
      this.mainVolumeNode.gain.setValueAtTime(this.volumeValue, this.ctx.currentTime);
      this.mainVolumeNode.connect(this.ctx.destination);
    } catch (e) {
      console.error("Web Audio API non supportata in questo browser.", e);
    }
  }

  public setVolume(volume: number) {
    this.volumeValue = Math.min(Math.max(volume, 0), 1);
    this.init();
    if (this.mainVolumeNode && this.ctx) {
      this.mainVolumeNode.gain.setTargetAtTime(this.volumeValue, this.ctx.currentTime, 0.05);
    }
  }

  public play(track: "lofi" | "synthwave" | "minimal" | "ambient" = "lofi") {
    this.init();
    if (!this.ctx) return;

    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }

    if (this.isRunning && this.currentTrack === track) {
      return; // Already playing this track
    }

    this.stop();
    this.currentTrack = track;
    this.isRunning = true;
    this.step = 0;

    const tempo = this.currentTrack === "synthwave" ? 120 : this.currentTrack === "minimal" ? 124 : this.currentTrack === "ambient" ? 60 : 80; // BPM
    const stepDuration = 60 / tempo / 2; // Eighth notes or quarter notes depending on tempo

    let nextStepTime = this.ctx.currentTime;

    const scheduleNextEvents = () => {
      while (nextStepTime < this.ctx!.currentTime + 0.1) {
        this.playStep(this.step, nextStepTime);
        nextStepTime += stepDuration;
        this.step = (this.step + 1) % 16;
      }
    };

    // Run scheduling loop
    this.intervalId = setInterval(scheduleNextEvents, 40);
  }

  public stop() {
    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  public toggle(track: "lofi" | "synthwave" | "minimal" | "ambient" = "lofi"): boolean {
    if (this.isRunning && this.currentTrack === track) {
      this.stop();
      return false;
    } else {
      this.play(track);
      return true;
    }
  }

  public getIsPlaying(): boolean {
    return this.isRunning;
  }

  public getCurrentTrack() {
    return this.isRunning ? this.currentTrack : null;
  }

  private playStep(step: number, time: number) {
    if (!this.ctx || !this.mainVolumeNode) return;

    // Track selector: custom synthesize logic
    switch (this.currentTrack) {
      case "lofi":
        this.playLofiStep(step, time);
        break;
      case "synthwave":
        this.playSynthwaveStep(step, time);
        break;
      case "minimal":
        this.playMinimalStep(step, time);
        break;
      case "ambient":
        this.playAmbientStep(step, time);
        break;
    }
  }

  // --- Track 1: Lofi Beats ---
  // Soft Rhodes chords, warm sub beat, tick high-hats
  private playLofiStep(step: number, time: number) {
    const ctx = this.ctx!;
    const dest = this.mainVolumeNode!;

    // 1. Warm kick bass on step 0, 4, 8, 12
    if (step === 0 || step === 8) {
      this.triggerKick(time, 100, 45, 0.4);
    }
    if (step === 10 || step === 14) {
      this.triggerKick(time, 90, 40, 0.2);
    }

    // 2. Soft snare/rim clap on step 4, 12
    if (step === 4 || step === 12) {
      this.triggerSnareNoise(time, 0.15, 0.3);
    }

    // 3. Chilled high hat ticker on odd steps
    if (step % 2 === 1) {
      this.triggerHihat(time, 0.04, 0.08);
    }

    // 4. Lofi piano chords progress
    // Roman numerals: ii - V - I - IV in F major (Gm7 - C7 - Fmaj7 - Bbmaj7)
    // Gm7: G3, Bb3, D4, F4   |  C7: C3, E3, G3, Bb3  |  Fmaj7: F3, A3, C4, E4  | Bbmaj7: Bb2, D3, F3, A3
    if (step === 0 || step === 4 || step === 8 || step === 12) {
      const chordIndex = Math.floor(step / 4);
      let freqs: number[] = [];

      if (chordIndex === 0) {
        freqs = [196.00, 233.08, 293.66, 349.23]; // Gm7 (G3, Bb3, D4, F4)
      } else if (chordIndex === 1) {
        freqs = [130.81, 164.81, 196.00, 233.08]; // C7 (C3, E3, G3, Bb3)
      } else if (chordIndex === 2) {
        freqs = [174.61, 220.00, 261.63, 329.63]; // Fmaj7 (F3, A3, C4, E4)
      } else {
        freqs = [116.54, 146.83, 174.61, 220.00]; // Bbmaj7 (Bb2, D3, F3, A3)
      }

      // Synthesize soft, warm Rhodes electric piano notes
      freqs.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(f, time);

        // Low pass filter to make it sound vintage
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(800 + (idx * 50), time);

        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.08, time + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 1.2);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(dest);

        osc.start(time);
        osc.stop(time + 1.3);
      });
    }
  }

  // --- Track 2: Cyber Synthwave ---
  // Punchy bass, brighter synth lead, driving high-hats
  private playSynthwaveStep(step: number, time: number) {
    const ctx = this.ctx!;
    const dest = this.mainVolumeNode!;

    // 1. Kick on 0, 4, 8, 12
    if (step % 4 === 0) {
      this.triggerKick(time, 150, 52, 0.61);
    }

    // 2. Bright snare on step 4, 12
    if (step === 4 || step === 12) {
      this.triggerSnareNoise(time, 0.22, 0.45);
    }

    // 3. Regular cyber high-hats on off-beats
    if (step % 2 === 1) {
      this.triggerHihat(time, 0.08, 0.13);
    }

    // 4. Bassline: 4 sixteenth-like notes rhythmic octave jumping (A minor)
    const baseFreqs = [110.00, 110.00, 130.81, 146.83, 164.81, 164.81, 146.83, 130.81]; // A2, C3, D3, E3
    const freqIndex = Math.floor(step / 2) % baseFreqs.length;
    let baseF = baseFreqs[freqIndex];
    if (step % 2 === 1) {
      baseF *= 2; // Jump an octave up for groove
    }

    const bassOsc = ctx.createOscillator();
    const bassGain = ctx.createGain();
    bassOsc.type = "sawtooth";
    bassOsc.frequency.setValueAtTime(baseF, time);

    const bassFilter = ctx.createBiquadFilter();
    bassFilter.type = "lowpass";
    bassFilter.frequency.setValueAtTime(450, time);

    bassGain.gain.setValueAtTime(0, time);
    bassGain.gain.linearRampToValueAtTime(0.12, time + 0.02);
    bassGain.gain.exponentialRampToValueAtTime(0.001, time + 0.18);

    bassOsc.connect(bassFilter);
    bassFilter.connect(bassGain);
    bassGain.connect(dest);

    bassOsc.start(time);
    bassOsc.stop(time + 0.2);

    // 5. Synthwave melodic hook (on step 0, 3, 6, 8, 11, 14)
    const melodSteps = [0, 3, 6, 8, 11, 14];
    if (melodSteps.includes(step)) {
      // Notes from localized keyboard scale: A4, C5, D5, E5, G5, A5
      const notes = [440.00, 523.25, 587.33, 659.25, 783.99, 880.00];
      const selectedNote = notes[(step * 2) % notes.length];

      const leadOsc1 = ctx.createOscillator();
      const leadOsc2 = ctx.createOscillator();
      const leadGain = ctx.createGain();

      leadOsc1.type = "sawtooth";
      leadOsc1.frequency.setValueAtTime(selectedNote, time);

      leadOsc2.type = "triangle";
      // Slightly detuned to sound fat & retro
      leadOsc2.frequency.setValueAtTime(selectedNote * 1.005, time);

      const delay = ctx.createDelay();
      delay.delayTime.setValueAtTime(0.12, time);

      leadGain.gain.setValueAtTime(0, time);
      leadGain.gain.linearRampToValueAtTime(0.05, time + 0.05);
      leadGain.gain.exponentialRampToValueAtTime(0.001, time + 0.35);

      leadOsc1.connect(leadGain);
      leadOsc2.connect(leadGain);
      leadGain.connect(dest);

      leadOsc1.start(time);
      leadOsc1.stop(time + 0.4);
      leadOsc2.start(time);
      leadOsc2.stop(time + 0.4);
    }
  }

  // --- Track 3: Minimal Tech Focus ---
  // Clicking hi-hat, ticking click kick, hypnotic woodblock sine bell melody
  private playMinimalStep(step: number, time: number) {
    const ctx = this.ctx!;
    const dest = this.mainVolumeNode!;

    // 1. Precise low click kick on 0, 4, 8, 12
    if (step % 4 === 0) {
      this.triggerKick(time, 80, 50, 0.45, 0.08); // shorter envelope
    }

    // 2. High-speed electronic high-hat clicks
    if (step % 4 === 2) {
      this.triggerHihat(time, 0.015, 0.15); // tiny release
    } else if (step % 2 === 1) {
      this.triggerHihat(time, 0.008, 0.06); 
    }

    // 3. Minimal woodblock bell on step 2, 6, 11, 15
    if (step === 2 || step === 6 || step === 11 || step === 15) {
      const bellFreqs = [1200, 1500, 1000, 1300];
      const bellFreq = bellFreqs[Math.floor(step / 4) % bellFreqs.length];

      const bellOsc = ctx.createOscillator();
      const bellGain = ctx.createGain();

      bellOsc.type = "sine";
      bellOsc.frequency.setValueAtTime(bellFreq, time);

      bellGain.gain.setValueAtTime(0, time);
      bellGain.gain.linearRampToValueAtTime(0.04, time + 0.005);
      bellGain.gain.exponentialRampToValueAtTime(0.001, time + 0.08);

      bellOsc.connect(bellGain);
      bellGain.connect(dest);

      bellOsc.start(time);
      bellOsc.stop(time + 0.1);
    }
  }

  // --- Track 4: Relaxing Ambient ---
  // Slow sweeping wash chord progressions, no harsh percussion
  private playAmbientStep(step: number, time: number) {
    const ctx = this.ctx!;
    const dest = this.mainVolumeNode!;

    // Ambient sweeps are extremely slow. We only play chords on step 0 and 8.
    if (step === 0 || step === 8) {
      // Beautiful Lush chords: E major 9, A major 9
      // Emaj9: E2, B2, E3, G#3, D#4, F#4
      // Amaj9: A2, E3, A3, C#4, G#4, B4
      const chords = [
        [82.41, 146.83, 164.81, 207.65, 311.13, 369.99], // Emaj9-ish
        [110.00, 164.81, 220.00, 277.18, 415.30, 493.88] // Amaj9-ish
      ];
      const currentChord = chords[step === 0 ? 0 : 1];

      currentChord.forEach((f) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine"; // silky smooth
        osc.frequency.setValueAtTime(f, time);

        // Low speed filter sweep
        const lp = ctx.createBiquadFilter();
        lp.type = "lowpass";
        lp.frequency.setValueAtTime(200, time);
        lp.frequency.exponentialRampToValueAtTime(1200, time + 2.0);
        lp.frequency.exponentialRampToValueAtTime(150, time + 4.5);

        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.06, time + 1.5); // long fade-in
        gain.gain.exponentialRampToValueAtTime(0.001, time + 4.8); // long fade-out

        osc.connect(lp);
        lp.connect(gain);
        gain.connect(dest);

        osc.start(time);
        osc.stop(time + 5.0);
      });
    }
  }

  // --- Sound Generation Toolbox ---

  // Trigger synthetic deep kick punch
  private triggerKick(time: number, startFreq: number, endFreq: number, vol: number, release = 0.25) {
    if (!this.ctx || !this.mainVolumeNode) return;
    const ctx = this.ctx;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(startFreq, time);
    // Pitch drop
    osc.frequency.exponentialRampToValueAtTime(endFreq, time + 0.1);

    gain.gain.setValueAtTime(vol, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + release);

    osc.connect(gain);
    gain.connect(this.mainVolumeNode);

    osc.start(time);
    osc.stop(time + release + 0.05);
  }

  // Trigger high pass snare noise clap
  private triggerSnareNoise(time: number, release: number, vol: number) {
    if (!this.ctx || !this.mainVolumeNode) return;
    const ctx = this.ctx;

    // Generate white noise buffer
    const bufferSize = ctx.sampleRate * release;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(1500, time);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + release);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.mainVolumeNode);

    noise.start(time);
    noise.stop(time + release + 0.05);
  }

  // Trigger high-pitched hihat tick
  private triggerHihat(time: number, duration: number, vol: number) {
    if (!this.ctx || !this.mainVolumeNode) return;
    const ctx = this.ctx;

    // Use a high pass filter on random noise to synthesize high hat cymbal clicks
    const bufferSize = ctx.sampleRate * 0.1;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.setValueAtTime(8000, time);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.mainVolumeNode);

    source.start(time);
    source.stop(time + duration + 0.02);
  }
}

// Export a single instance for the applet
export const soundManager = new ProceduralSynthesizer();
