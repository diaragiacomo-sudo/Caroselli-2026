// Web Audio API Procedural Background Music Synthesizer
// Synthesizes pleasant electronic rhythms, retro space-synths, and lofi ambient tracks on-the-fly.

export class ProceduralSynthesizer {
  private ctx: AudioContext | null = null;
  private isRunning = false;
  private intervalId: any = null;
  private currentTrack: "lofi" | "synthwave" | "minimal" | "ambient" | "chillhop" | "retropop" | "deephouse" = "lofi";
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

  public play(track: "lofi" | "synthwave" | "minimal" | "ambient" | "chillhop" | "retropop" | "deephouse" = "lofi") {
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

    const tempo = 
      this.currentTrack === "synthwave" ? 120 : 
      this.currentTrack === "minimal" ? 124 : 
      this.currentTrack === "ambient" ? 55 : 
      this.currentTrack === "deephouse" ? 122 : 
      this.currentTrack === "retropop" ? 116 : 
      this.currentTrack === "chillhop" ? 82 : 80; // BPM
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

  public toggle(track: "lofi" | "synthwave" | "minimal" | "ambient" | "chillhop" | "retropop" | "deephouse" = "lofi"): boolean {
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
      case "chillhop":
        this.playChillhopStep(step, time);
        break;
      case "retropop":
        this.playRetropopStep(step, time);
        break;
      case "deephouse":
        this.playDeephouseStep(step, time);
        break;
    }
  }

  // --- Track 1: Lofi Beats ---
  private playLofiStep(step: number, time: number) {
    const ctx = this.ctx!;
    const dest = this.mainVolumeNode!;

    if (step === 0 || step === 8) {
      this.triggerKick(time, 100, 45, 0.4);
    }
    if (step === 10 || step === 14) {
      this.triggerKick(time, 90, 40, 0.2);
    }

    if (step === 4 || step === 12) {
      this.triggerSnareNoise(time, 0.15, 0.3);
    }

    if (step % 2 === 1) {
      this.triggerHihat(time, 0.04, 0.08);
    }

    if (step === 0 || step === 4 || step === 8 || step === 12) {
      const chordIndex = Math.floor(step / 4);
      let freqs: number[] = [];

      if (chordIndex === 0) {
        freqs = [196.00, 233.08, 293.66, 349.23]; // Gm7
      } else if (chordIndex === 1) {
        freqs = [130.81, 164.81, 196.00, 233.08]; // C7
      } else if (chordIndex === 2) {
        freqs = [174.61, 220.00, 261.63, 329.63]; // Fmaj7
      } else {
        freqs = [116.54, 146.83, 174.61, 220.00]; // Bbmaj7
      }

      freqs.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(f, time);

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
  private playSynthwaveStep(step: number, time: number) {
    const ctx = this.ctx!;
    const dest = this.mainVolumeNode!;

    if (step % 4 === 0) {
      this.triggerKick(time, 150, 52, 0.61);
    }

    if (step === 4 || step === 12) {
      this.triggerSnareNoise(time, 0.22, 0.45);
    }

    if (step % 2 === 1) {
      this.triggerHihat(time, 0.08, 0.13);
    }

    const baseFreqs = [110.00, 110.00, 130.81, 146.83, 164.81, 164.81, 146.83, 130.81];
    const freqIndex = Math.floor(step / 2) % baseFreqs.length;
    let baseF = baseFreqs[freqIndex];
    if (step % 2 === 1) {
      baseF *= 2;
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

    const melodSteps = [0, 3, 6, 8, 11, 14];
    if (melodSteps.includes(step)) {
      const notes = [440.00, 523.25, 587.33, 659.25, 783.99, 880.00];
      const selectedNote = notes[(step * 2) % notes.length];

      const leadOsc1 = ctx.createOscillator();
      const leadOsc2 = ctx.createOscillator();
      const leadGain = ctx.createGain();

      leadOsc1.type = "sawtooth";
      leadOsc1.frequency.setValueAtTime(selectedNote, time);

      leadOsc2.type = "triangle";
      leadOsc2.frequency.setValueAtTime(selectedNote * 1.005, time);

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
  private playMinimalStep(step: number, time: number) {
    const ctx = this.ctx!;
    const dest = this.mainVolumeNode!;

    if (step % 4 === 0) {
      this.triggerKick(time, 80, 50, 0.45, 0.08);
    }

    if (step % 4 === 2) {
      this.triggerHihat(time, 0.015, 0.15);
    } else if (step % 2 === 1) {
      this.triggerHihat(time, 0.008, 0.06);
    }

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
  private playAmbientStep(step: number, time: number) {
    const ctx = this.ctx!;
    const dest = this.mainVolumeNode!;

    if (step === 0 || step === 8) {
      const chords = [
        [82.41, 146.83, 164.81, 207.65, 311.13, 369.99],
        [110.00, 164.81, 220.00, 277.18, 415.30, 493.88]
      ];
      const currentChord = chords[step === 0 ? 0 : 1];

      currentChord.forEach((f) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(f, time);

        const lp = ctx.createBiquadFilter();
        lp.type = "lowpass";
        lp.frequency.setValueAtTime(200, time);
        lp.frequency.exponentialRampToValueAtTime(1200, time + 2.0);
        lp.frequency.exponentialRampToValueAtTime(150, time + 4.5);

        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.06, time + 1.5);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 4.8);

        osc.connect(lp);
        lp.connect(gain);
        gain.connect(dest);

        osc.start(time);
        osc.stop(time + 5.0);
      });
    }
  }

  // --- Track 5: Chillhop Sunset ---
  private playChillhopStep(step: number, time: number) {
    const ctx = this.ctx!;
    const dest = this.mainVolumeNode!;

    // Kick on 0, 8, 11 (accentuated chill hop feel)
    if (step === 0 || step === 8) {
      this.triggerKick(time, 95, 42, 0.45);
    }
    if (step === 11 || step === 14) {
      this.triggerKick(time, 85, 38, 0.25);
    }

    // Soft rim shot/dusty snare at 4, 12
    if (step === 4 || step === 12) {
      this.triggerSnareNoise(time, 0.12, 0.25);
    }

    // Crisp soft hihat on odd steps
    if (step % 2 === 1) {
      this.triggerHihat(time, 0.03, 0.08);
    }

    // Melodious Chillhop EP Chords on 0, 8
    if (step === 0 || step === 8) {
      const chords = [
        [261.63, 329.63, 392.00, 493.88], // Cmaj7
        [220.00, 261.63, 311.13, 392.00]  // Am7/chord variation
      ];
      const activeChord = chords[step === 0 ? 0 : 1];
      activeChord.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(f, time);

        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(900 + (idx * 30), time);

        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.06, time + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 1.4);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(dest);

        osc.start(time);
        osc.stop(time + 1.5);
      });
    }
  }

  // --- Track 6: Retro Funk Pop ---
  private playRetropopStep(step: number, time: number) {
    const ctx = this.ctx!;
    const dest = this.mainVolumeNode!;

    // Four-on-the-floor Pop Kick
    if (step % 4 === 0) {
      this.triggerKick(time, 130, 52, 0.55);
    }

    // Pop Snare on 4, 12
    if (step === 4 || step === 12) {
      this.triggerSnareNoise(time, 0.18, 0.4);
      // Snare tone support (giving that acoustic snare punch)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(180, time);
      gain.gain.setValueAtTime(0.2, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);
      osc.connect(gain);
      gain.connect(dest);
      osc.start(time);
      osc.stop(time + 0.12);
    }

    // Upbeat Hihat (bright & open pop style)
    if (step % 4 === 2) {
      this.triggerHihat(time, 0.1, 0.14); // Open
    } else if (step % 2 === 1) {
      this.triggerHihat(time, 0.04, 0.08); // Closed
    }

    // Upbeat Disco-style Bassline
    const bassline = [110.00, 110.00, 130.81, 130.81, 146.83, 146.83, 164.81, 196.00];
    const note = bassline[Math.floor(step / 2) % bassline.length];
    
    // Play bass arpeggio rhythm
    if (step % 2 === 0) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(note / 2, time); // 1 octave down

      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.setValueAtTime(320, time);

      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.14, time + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.16);

      osc.connect(lp);
      lp.connect(gain);
      gain.connect(dest);

      osc.start(time);
      osc.stop(time + 0.2);
    }

    // High brassy synth chord stab on step 4, 10
    if (step === 4 || step === 10) {
      const chords = [523.25, 659.25, 783.99, 987.77]; // Cmaj7 in high registers
      chords.forEach((f) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(f, time);

        const bandpass = ctx.createBiquadFilter();
        bandpass.type = "bandpass";
        bandpass.frequency.setValueAtTime(2000, time);
        bandpass.frequency.exponentialRampToValueAtTime(900, time + 0.2);

        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.03, time + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.22);

        osc.connect(bandpass);
        bandpass.connect(gain);
        gain.connect(dest);

        osc.start(time);
        osc.stop(time + 0.25);
      });
    }
  }

  // --- Track 7: Deep House Pulse ---
  private playDeephouseStep(step: number, time: number) {
    const ctx = this.ctx!;
    const dest = this.mainVolumeNode!;

    // Consistent House Kick (Four on the Floor)
    if (step % 4 === 0) {
      this.triggerKick(time, 100, 48, 0.58, 0.18);
    }

    // Open Hihat on offbeat (2, 6, 10, 14)
    if (step % 4 === 2) {
      this.triggerHihat(time, 0.14, 0.16);
    } else if (step % 2 === 1) {
      this.triggerHihat(time, 0.02, 0.06);
    }

    // Syncopated Deep House Bass (organ bass feel)
    const baseNotes = [73.42, 73.42, 87.31, 98.00, 110.00, 110.05, 98.00, 87.31]; // D, F, G, A
    const activeNote = baseNotes[Math.floor(step / 2) % baseNotes.length];
    
    // Play on syncopated house beats
    if (step % 4 === 0 || step === 3 || step === 6 || step === 10 || step === 13) {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = "sine";
      osc1.frequency.setValueAtTime(activeNote, time);

      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(activeNote * 2, time);

      const lowpass = ctx.createBiquadFilter();
      lowpass.type = "lowpass";
      lowpass.frequency.setValueAtTime(280, time);

      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.16, time + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.2);

      osc1.connect(lowpass);
      osc2.connect(lowpass);
      lowpass.connect(gain);
      gain.connect(dest);

      osc1.start(time);
      osc1.stop(time + 0.22);
      osc2.start(time);
      osc2.stop(time + 0.22);
    }

    // Occasional filter swept dub chord stab
    if (step === 4 || step === 12) {
      const dubChord = [196.00, 233.08, 293.66, 349.23, 440.00]; // Gm9 chord
      dubChord.forEach((f) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(f, time);

        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.Q.setValueAtTime(5, time);
        filter.frequency.setValueAtTime(150, time);
        filter.frequency.exponentialRampToValueAtTime(1400, time + 0.08);
        filter.frequency.exponentialRampToValueAtTime(180, time + 0.4);

        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.04, time + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.65);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(dest);

        osc.start(time);
        osc.stop(time + 0.7);
      });
    }
  }

  // --- Sound Generation Toolbox ---
  private triggerKick(time: number, startFreq: number, endFreq: number, vol: number, release = 0.25) {
    if (!this.ctx || !this.mainVolumeNode) return;
    const ctx = this.ctx;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(startFreq, time);
    osc.frequency.exponentialRampToValueAtTime(endFreq, time + 0.1);

    gain.gain.setValueAtTime(vol, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + release);

    osc.connect(gain);
    gain.connect(this.mainVolumeNode);

    osc.start(time);
    osc.stop(time + release + 0.05);
  }

  private triggerSnareNoise(time: number, release: number, vol: number) {
    if (!this.ctx || !this.mainVolumeNode) return;
    const ctx = this.ctx;

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

  private triggerHihat(time: number, duration: number, vol: number) {
    if (!this.ctx || !this.mainVolumeNode) return;
    const ctx = this.ctx;

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

export const soundManager = new ProceduralSynthesizer();
