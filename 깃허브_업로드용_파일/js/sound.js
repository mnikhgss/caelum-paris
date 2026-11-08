/**
 * SYNAPSE LABS — Spatial Micro-Acoustic Feedback Engine
 * Pure Web Audio API synthesis for subtle, luxurious tactile audio.
 * Zero external audio files required. Completely optional and muted by default.
 */

(function () {
  'use strict';

  let audioCtx = null;
  let isSoundEnabled = false;

  function initAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Soft high-frequency glass click (Apple-like micro-tap)
  function playClickSound() {
    if (!isSoundEnabled || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(840, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, audioCtx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.04);
    } catch (e) {}
  }

  // Harmonic chord chime for major milestones & mode changes
  function playHarmonicPulse(frequency = 523.25) { // C5
    if (!isSoundEnabled || !audioCtx) return;
    try {
      const baseFreqs = [frequency, frequency * 1.25, frequency * 1.5]; // Major chord triad
      baseFreqs.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

        const startTime = audioCtx.currentTime + idx * 0.03;
        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(0.04, startTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.45);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.5);
      });
    } catch (e) {}
  }

  // Interactive slider granular ticks
  let lastSliderTick = 0;
  function playSliderTick() {
    if (!isSoundEnabled || !audioCtx) return;
    const now = Date.now();
    if (now - lastSliderTick < 45) return;
    lastSliderTick = now;

    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200 + Math.random() * 300, audioCtx.currentTime);

      gain.gain.setValueAtTime(0.015, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.018);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.02);
    } catch (e) {}
  }

  // Toggle Sound State
  function setupSoundToggle() {
    const toggleBtn = document.getElementById('sound-toggle-btn');
    if (!toggleBtn) return;

    toggleBtn.addEventListener('click', () => {
      initAudioContext();
      isSoundEnabled = !isSoundEnabled;

      if (isSoundEnabled) {
        toggleBtn.classList.add('sound-playing');
        toggleBtn.querySelector('.sound-label').textContent = 'Acoustics ON';
        playHarmonicPulse(659.25); // E5 welcome chime
      } else {
        toggleBtn.classList.remove('sound-playing');
        toggleBtn.querySelector('.sound-label').textContent = 'Acoustics OFF';
      }
    });

    // Attach listeners to interactive elements
    document.querySelectorAll('.btn-primary, .btn-secondary, .tab-pill').forEach(el => {
      el.addEventListener('mouseenter', () => {
        if (isSoundEnabled) playClickSound();
      });
      el.addEventListener('click', () => {
        if (isSoundEnabled) playHarmonicPulse(587.33); // D5
      });
    });
  }

  // Export
  window.SynapseAudio = {
    playClick: playClickSound,
    playChime: playHarmonicPulse,
    playTick: playSliderTick,
    init: setupSoundToggle
  };

  document.addEventListener('DOMContentLoaded', setupSoundToggle);
})();
