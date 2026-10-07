/* ==========================================================================
   WEB AUDIO API AMBIENT SOUND SYNTHESIZER
   Generates a warm, minimal, low-frequency ambient pad drone.
   ========================================================================== */

class AmbientSoundManager {
  constructor() {
    this.audioCtx = null;
    this.masterGain = null;
    this.isPlaying = false;
    this.oscillators = [];
    this.filter = null;
  }

  init() {
    if (this.audioCtx) return;
    
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioCtx = new AudioContext();

    this.masterGain = this.audioCtx.createGain();
    this.masterGain.gain.setValueAtTime(0.001, this.audioCtx.currentTime);

    // Subtle low-pass filter for dark, warm cinematic tone
    this.filter = this.audioCtx.createBiquadFilter();
    this.filter.type = 'lowpass';
    this.filter.frequency.setValueAtTime(350, this.audioCtx.currentTime);

    this.masterGain.connect(this.filter);
    this.filter.connect(this.audioCtx.destination);
  }

  start() {
    this.init();
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    if (this.isPlaying) return;

    // F frequencies forming a deep, soft ambient chord (F2, C3, A3, C4)
    const frequencies = [87.31, 130.81, 220.00, 261.63];

    this.oscillators = frequencies.map((freq, index) => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      // Sine wave with slight detune for warm analog feel
      osc.type = index % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
      osc.detune.setValueAtTime((index - 1.5) * 4, this.audioCtx.currentTime);

      gain.gain.setValueAtTime(0.04 / frequencies.length, this.audioCtx.currentTime);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start();

      return osc;
    });

    // Smooth gain fade-in over 2 seconds
    const now = this.audioCtx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
    this.masterGain.gain.linearRampToValueAtTime(0.4, now + 2.0);

    this.isPlaying = true;
  }

  stop() {
    if (!this.isPlaying || !this.audioCtx) return;

    const now = this.audioCtx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
    this.masterGain.gain.linearRampToValueAtTime(0.0001, now + 1.2);

    setTimeout(() => {
      this.oscillators.forEach(osc => {
        try { osc.stop(); osc.disconnect(); } catch (e) {}
      });
      this.oscillators = [];
      this.isPlaying = false;
    }, 1300);
  }

  toggle() {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  // Play subtle UI tap feedback click tone
  playClick() {
    if (!this.audioCtx || this.audioCtx.state === 'suspended') return;
    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, this.audioCtx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.03, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.06);
    } catch (e) {}
  }
}

window.ambientSound = new AmbientSoundManager();
