/**
 * music.js — Background music player with playlist, volume, mute
 * Uses Web Audio API oscillators to generate romantic ambient tones
 * (No external files needed — generates music procedurally)
 */

document.addEventListener('DOMContentLoaded', initMusicPlayer);

function initMusicPlayer() {
  const playBtn  = document.getElementById('play-pause-btn');
  const playIcon = document.getElementById('play-icon');
  const muteBtn  = document.getElementById('mute-btn');
  const muteIcon = document.getElementById('mute-icon');
  const volSlider= document.getElementById('volume-slider');
  const prevBtn  = document.getElementById('prev-track');
  const nextBtn  = document.getElementById('next-track');
  const trackTitle = document.getElementById('track-title');
  const vinyl    = document.querySelector('.vinyl-disc');

  if (!playBtn) return;

  // Playlist metadata
  const playlist = [
    { title: 'Eternal Love Waltz',    desc: 'A gentle, romantic waltz' },
    { title: 'Moonlight Serenade',    desc: 'Soft moonlit melody' },
    { title: 'Promise of Forever',    desc: 'Tender piano notes' },
    { title: 'Cherry Blossom Dream',  desc: 'Delicate spring harmony' },
    { title: 'Heartbeat Symphony',    desc: 'Warm orchestral love theme' }
  ];

  let trackIdx    = 0;
  let isPlaying   = false;
  let isMuted     = false;
  let audioCtx    = null;
  let masterGain  = null;
  let allNodes    = [];
  let fadeTimer   = null;

  // Initialize Web Audio
  function initAudio() {
    if (audioCtx) return;
    audioCtx   = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = parseFloat(volSlider.value);
    masterGain.connect(audioCtx.destination);
  }

  // Generate a romantic ambient soundscape
  function startAmbient(trackNum) {
    stopAmbient();
    initAudio();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    // Different chord progressions per track
    const progressions = [
      // Track 0: C major waltz feel — C, Am, F, G
      [[261.63, 329.63, 392.00], [220.00, 261.63, 329.63], [174.61, 220.00, 261.63], [196.00, 246.94, 329.63]],
      // Track 1: Moonlight — Cm, Ab, Eb, Bb
      [[261.63, 311.13, 392.00], [207.65, 261.63, 311.13], [155.56, 195.99, 261.63], [233.08, 293.66, 349.23]],
      // Track 2: Promise — D, Bm, G, A
      [[293.66, 369.99, 440.00], [246.94, 293.66, 369.99], [196.00, 246.94, 293.66], [220.00, 277.18, 349.23]],
      // Track 3: Cherry Blossom — E, C#m, A, B
      [[329.63, 415.30, 493.88], [277.18, 329.63, 415.30], [220.00, 277.18, 329.63], [246.94, 311.13, 369.99]],
      // Track 4: Heartbeat — F, Dm, Bb, C
      [[349.23, 440.00, 523.25], [293.66, 349.23, 440.00], [233.08, 293.66, 349.23], [261.63, 329.63, 415.30]]
    ];

    const chords = progressions[trackNum % progressions.length];
    const BPM    = 60;
    const beat   = 60 / BPM;

    let time = audioCtx.currentTime + 0.1;
    const duration = 60; // 60 seconds per track

    // Build the track over time
    function scheduleChord(chord, startTime, duration) {
      chord.forEach(freq => {
        // Main tone (sine)
        const osc  = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(masterGain);
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.04, startTime + 0.3);
        gain.gain.linearRampToValueAtTime(0.03, startTime + duration * 0.8);
        gain.gain.linearRampToValueAtTime(0, startTime + duration);
        osc.start(startTime);
        osc.stop(startTime + duration);
        allNodes.push(osc, gain);

        // Soft octave above
        const osc2  = audioCtx.createOscillator();
        const gain2 = audioCtx.createGain();
        osc2.connect(gain2);
        gain2.connect(masterGain);
        osc2.type = 'sine';
        osc2.frequency.value = freq * 2;
        gain2.gain.setValueAtTime(0, startTime);
        gain2.gain.linearRampToValueAtTime(0.012, startTime + 0.5);
        gain2.gain.linearRampToValueAtTime(0, startTime + duration);
        osc2.start(startTime);
        osc2.stop(startTime + duration);
        allNodes.push(osc2, gain2);
      });
    }

    // Melodic arp on top
    const melodies = [
      [523.25, 587.33, 659.25, 698.46, 659.25, 587.33, 523.25, 493.88],
      [493.88, 523.25, 587.33, 659.25, 587.33, 523.25, 493.88, 440.00],
      [587.33, 659.25, 739.99, 783.99, 739.99, 659.25, 587.33, 523.25],
      [659.25, 739.99, 830.61, 880.00, 830.61, 739.99, 659.25, 587.33],
      [440.00, 493.88, 523.25, 587.33, 523.25, 493.88, 440.00, 392.00]
    ];
    const melody = melodies[trackNum % melodies.length];

    // Schedule chords
    for (let i = 0; i < duration / (beat * 4); i++) {
      const chordIdx = i % chords.length;
      scheduleChord(chords[chordIdx], time + i * beat * 4, beat * 4);
    }

    // Schedule melody notes
    for (let i = 0; i < duration / (beat * 0.5); i++) {
      const noteIdx  = i % melody.length;
      const noteTime = time + i * beat * 0.5;
      const osc      = audioCtx.createOscillator();
      const gain     = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(masterGain);
      osc.type = 'triangle';
      osc.frequency.value = melody[noteIdx];
      gain.gain.setValueAtTime(0, noteTime);
      gain.gain.linearRampToValueAtTime(0.05, noteTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + beat * 0.45);
      osc.start(noteTime);
      osc.stop(noteTime + beat * 0.5);
      allNodes.push(osc, gain);
    }

    // Auto-advance after track finishes
    clearTimeout(fadeTimer);
    fadeTimer = setTimeout(() => {
      if (isPlaying) nextTrack();
    }, (duration + 1) * 1000);
  }

  function stopAmbient() {
    allNodes.forEach(n => {
      try { n.disconnect(); } catch(e) {}
    });
    allNodes = [];
    clearTimeout(fadeTimer);
  }

  function play() {
    isPlaying = true;
    playIcon.className = 'fas fa-pause';
    vinyl?.classList.add('playing');
    startAmbient(trackIdx);
  }

  function pause() {
    isPlaying = false;
    playIcon.className = 'fas fa-play';
    vinyl?.classList.remove('playing');
    stopAmbient();
    if (audioCtx) audioCtx.suspend();
  }

  function nextTrack() {
    trackIdx = (trackIdx + 1) % playlist.length;
    updateTrackInfo();
    if (isPlaying) { stopAmbient(); startAmbient(trackIdx); }
  }

  function prevTrack() {
    trackIdx = (trackIdx - 1 + playlist.length) % playlist.length;
    updateTrackInfo();
    if (isPlaying) { stopAmbient(); startAmbient(trackIdx); }
  }

  function updateTrackInfo() {
    if (trackTitle) trackTitle.textContent = playlist[trackIdx].title;
  }

  // Event listeners
  playBtn.addEventListener('click', () => {
    if (isPlaying) pause(); else play();
  });

  muteBtn.addEventListener('click', () => {
    isMuted = !isMuted;
    if (masterGain) masterGain.gain.value = isMuted ? 0 : parseFloat(volSlider.value);
    muteIcon.className = isMuted ? 'fas fa-volume-xmark' : 'fas fa-volume-high';
  });

  volSlider.addEventListener('input', () => {
    if (masterGain && !isMuted) masterGain.gain.value = parseFloat(volSlider.value);
  });

  nextBtn.addEventListener('click', nextTrack);
  prevBtn.addEventListener('click', prevTrack);

  // Auto-play on first user interaction (required by browsers)
  const startOnInteract = () => {
    if (!isPlaying) play();
    document.removeEventListener('click', startOnInteract);
    document.removeEventListener('keydown', startOnInteract);
    document.removeEventListener('touchstart', startOnInteract);
  };
  document.addEventListener('click', startOnInteract, { once: true });
  document.addEventListener('keydown', startOnInteract, { once: true });
  document.addEventListener('touchstart', startOnInteract, { once: true });

  // Initialize track title
  updateTrackInfo();
}
