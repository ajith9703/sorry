/**
 * animations.js — GSAP + Three.js + Aurora + Falling effects
 * Hero section 3D particles, aurora background, GSAP scroll triggers
 */

document.addEventListener('DOMContentLoaded', () => {
  initAurora();
  initThreeParticles();
  initFallingElements();
  initBalloons();
  initHeroHeartCanvas();
  initGSAP();
  initInteractiveHeart();

});

/* =========================================================
   1. AURORA CANVAS BACKGROUND
   ========================================================= */
function initAurora() {
  const canvas = document.getElementById('aurora-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const blobs = Array.from({ length: 6 }, (_, i) => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 300 + 200,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    hue: [300, 280, 320, 340, 260, 310][i]
  }));

  let t = 0;

  function drawAurora() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    t += 0.005;

    blobs.forEach((b, i) => {
      b.x += b.vx + Math.sin(t + i) * 0.4;
      b.y += b.vy + Math.cos(t + i * 0.7) * 0.3;

      // Wrap around
      if (b.x < -b.r) b.x = canvas.width + b.r;
      if (b.x > canvas.width + b.r) b.x = -b.r;
      if (b.y < -b.r) b.y = canvas.height + b.r;
      if (b.y > canvas.height + b.r) b.y = -b.r;

      const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
      grad.addColorStop(0, `hsla(${b.hue + Math.sin(t)*20}, 80%, 50%, 0.12)`);
      grad.addColorStop(0.5, `hsla(${b.hue + 30}, 70%, 40%, 0.07)`);
      grad.addColorStop(1, 'transparent');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fill();
    });

    // Stars
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    for (let i = 0; i < 60; i++) {
      const sx = (Math.sin(i * 137.5 + t * 0.1) + 1) / 2 * canvas.width;
      const sy = (Math.cos(i * 113.7 + t * 0.08) + 1) / 2 * canvas.height;
      const ss = (Math.sin(t * 2 + i) + 1) * 0.8 + 0.2;
      ctx.globalAlpha = ss * 0.5;
      ctx.beginPath();
      ctx.arc(sx, sy, ss * 0.8, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    requestAnimationFrame(drawAurora);
  }
  drawAurora();
}

/* =========================================================
   2. THREE.JS PARTICLE FIELD
   ========================================================= */
function initThreeParticles() {
  const wrap = document.getElementById('three-canvas-wrap');
  if (!wrap || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(wrap.offsetWidth, wrap.offsetHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  wrap.appendChild(renderer.domElement);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, wrap.offsetWidth / wrap.offsetHeight, 0.1, 1000);
  camera.position.z = 5;

  // Particles geometry
  const count  = 800;
  const pos    = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const pinkColor   = new THREE.Color('#ff6b9d');
  const purpleColor = new THREE.Color('#9b59b6');
  const goldColor   = new THREE.Color('#f7d060');
  const palette     = [pinkColor, purpleColor, goldColor];

  for (let i = 0; i < count; i++) {
    pos[i*3]   = (Math.random() - 0.5) * 20;
    pos[i*3+1] = (Math.random() - 0.5) * 20;
    pos[i*3+2] = (Math.random() - 0.5) * 10;

    const col = palette[Math.floor(Math.random() * palette.length)];
    colors[i*3]   = col.r;
    colors[i*3+1] = col.g;
    colors[i*3+2] = col.b;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color',    new THREE.BufferAttribute(colors, 3));

  const mat = new THREE.PointsMaterial({
    size: 0.06,
    vertexColors: true,
    transparent: true,
    opacity: 0.7,
    depthWrite: false
  });

  const points = new THREE.Points(geo, mat);
  scene.add(points);

  // Mouse interaction
  let mx = 0, my = 0;
  window.addEventListener('mousemove', e => {
    mx = (e.clientX / window.innerWidth  - 0.5) * 2;
    my = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // Resize
  window.addEventListener('resize', () => {
    camera.aspect = wrap.offsetWidth / wrap.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(wrap.offsetWidth, wrap.offsetHeight);
  });

  let frameId;
  function animate() {
    frameId = requestAnimationFrame(animate);
    const t = Date.now() * 0.001;
    points.rotation.y = t * 0.05 + mx * 0.3;
    points.rotation.x = Math.sin(t * 0.03) * 0.2 + my * 0.15;
    renderer.render(scene, camera);
  }
  animate();

  // Stop Three.js when hero is out of view (performance)
  const hero = document.getElementById('hero');
  if (hero && 'IntersectionObserver' in window) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { if (!frameId) animate(); }
        else { cancelAnimationFrame(frameId); frameId = null; }
      });
    }, { threshold: 0 });
    obs.observe(hero);
  }
}

/* =========================================================
   3. FALLING ELEMENTS
   ========================================================= */
function initFallingElements() {
  const container = document.getElementById('falling-container');
  if (!container) return;

  const emojis = ['❤️','🌹','✨','🦋','⭐','🌸','💕','💖','🌺','🌟'];

  function createFalling() {
    const el   = document.createElement('div');
    el.className = 'falling-elem';
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.left     = Math.random() * 100 + 'vw';
    el.style.fontSize = (Math.random() * 16 + 10) + 'px';
    const dur = Math.random() * 8 + 5;
    el.style.animationDuration = dur + 's';
    el.style.animationDelay   = Math.random() * 2 + 's';
    el.style.opacity = (Math.random() * 0.5 + 0.3).toString();
    container.appendChild(el);
    setTimeout(() => el.remove(), (dur + 2) * 1000);
  }

  for (let i = 0; i < 20; i++) setTimeout(createFalling, i * 300);
  setInterval(createFalling, 600);
}

/* =========================================================
   4. BALLOONS
   ========================================================= */
function releaseBalloons(count = 5) {
  const container = document.getElementById('balloons-container');
  if (!container) return;

  const balloons = ['🎈','❤️','🌹','💕','🎀','💝'];
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const b = document.createElement('div');
      b.className = 'balloon';
      b.textContent = balloons[Math.floor(Math.random() * balloons.length)];
      b.style.left = Math.random() * 90 + 5 + '%';
      const dur = Math.random() * 5 + 5;
      b.style.animationDuration = dur + 's';
      b.style.fontSize = (Math.random() * 20 + 24) + 'px';
      container.appendChild(b);
      setTimeout(() => b.remove(), dur * 1000);
    }, i * 200);
  }
}
window.releaseBalloons = releaseBalloons;

// Release some balloons on page load
setTimeout(() => releaseBalloons(6), 3000);
setInterval(() => releaseBalloons(3), 12000);

/* =========================================================
   5. HERO INTERACTIVE HEART CANVAS
   ========================================================= */
function initHeroHeartCanvas() {
  const heroHeart = document.getElementById('hero-heart');
  if (!heroHeart) return;

  heroHeart.addEventListener('click', () => {
    // Burst mini hearts
    const rect = heroHeart.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;
    const cy   = rect.top  + rect.height / 2;

    for (let i = 0; i < 12; i++) {
      const h = document.createElement('div');
      h.className = 'sparkle-particle';
      h.textContent = ['❤️','💕','💖','🌹'][i % 4];
      h.style.left = cx + (Math.random()-0.5)*100 + 'px';
      h.style.top  = cy + (Math.random()-0.5)*100 + 'px';
      h.style.fontSize = (Math.random() * 16 + 10) + 'px';
      document.body.appendChild(h);
      setTimeout(() => h.remove(), 800);
    }

    // Vibration
    if (navigator.vibrate) navigator.vibrate([50, 30, 50]);
  });
}

/* =========================================================
   6. INTERACTIVE HEART CANVAS (Heart section)
   ========================================================= */
function initInteractiveHeart() {
  const canvas  = document.getElementById('heart-canvas');
  if (!canvas) return;
  const ctx     = canvas.getContext('2d');
  const msgEl   = document.getElementById('heart-message');

  const SIZE = Math.min(500, window.innerWidth * 0.9);
  canvas.width  = SIZE;
  canvas.height = SIZE;

  const particles = [];
  const messages  = [
    "I Love You, Aaru 💕",
    "You Are My Everything ❤️",
    "Forever Yours 🌹",
    "My Heart Beats for You 💓",
    "You Are My Peace ✨",
    "I'm Sorry, Truly 💌",
    "You Are Irreplaceable 💖",
    "My Aaru, Always 🌸"
  ];
  let msgIdx = 0;
  let frame;
  let heartScale = 1;
  let heartTarget = 1;

  // Draw heart shape using parametric equation
  function heartPath(cx, cy, size) {
    ctx.beginPath();
    for (let angle = 0; angle <= Math.PI * 2; angle += 0.01) {
      const x = 16 * Math.pow(Math.sin(angle), 3);
      const y = -(13 * Math.cos(angle) - 5 * Math.cos(2*angle) - 2 * Math.cos(3*angle) - Math.cos(4*angle));
      if (angle === 0) ctx.moveTo(cx + x * size, cy + y * size);
      else             ctx.lineTo(cx + x * size, cy + y * size);
    }
    ctx.closePath();
  }

  // Particle class
  class HeartParticle {
    constructor(x, y, color) {
      this.x    = x;
      this.y    = y;
      this.vx   = (Math.random() - 0.5) * 6;
      this.vy   = (Math.random() - 0.5) * 6 - 2;
      this.life = 1;
      this.decay= Math.random() * 0.02 + 0.015;
      this.size = Math.random() * 16 + 8;
      this.color= color;
      this.emoji= ['❤️','💕','💖','🌹','✨'][Math.floor(Math.random()*5)];
    }
    update() {
      this.x    += this.vx;
      this.y    += this.vy;
      this.vy   += 0.1;
      this.life -= this.decay;
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.life);
      ctx.font        = this.size + 'px serif';
      ctx.fillText(this.emoji, this.x, this.y);
      ctx.restore();
    }
  }

  let t = 0;

  function drawHeartCanvas() {
    frame = requestAnimationFrame(drawHeartCanvas);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    t += 0.02;

    // Smooth scale
    heartScale += (heartTarget - heartScale) * 0.1;

    const cx = canvas.width  / 2;
    const cy = canvas.height / 2;

    // Outer glow rings
    for (let i = 3; i >= 1; i--) {
      ctx.save();
      ctx.globalAlpha = 0.05 + Math.sin(t + i) * 0.03;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 160 + i * 30);
      grad.addColorStop(0, '#ff6b9d');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, 160 + i * 30, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Main heart
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(heartScale + Math.sin(t) * 0.02, heartScale + Math.sin(t) * 0.02);
    ctx.translate(-cx, -cy);

    heartPath(cx, cy, 12);

    // Gradient fill
    const grad = ctx.createRadialGradient(cx, cy-30, 10, cx, cy, 130);
    grad.addColorStop(0, '#ff9ff3');
    grad.addColorStop(0.4, '#ff6b9d');
    grad.addColorStop(1, '#9b59b6');
    ctx.fillStyle   = grad;
    ctx.shadowColor = '#ff6b9d';
    ctx.shadowBlur  = 40 + Math.sin(t) * 20;
    ctx.fill();

    // Shimmer
    ctx.fillStyle = `rgba(255,255,255,${0.05 + Math.sin(t*2)*0.03})`;
    heartPath(cx - 20, cy - 20, 8);
    ctx.fill();

    ctx.restore();

    // Sparkle dots around heart
    for (let i = 0; i < 12; i++) {
      const a  = (Math.PI * 2 / 12) * i + t * 0.3;
      const r  = 150 + Math.sin(t * 2 + i) * 10;
      const sx = cx + Math.cos(a) * r;
      const sy = cy + Math.sin(a) * r;
      const ss = (Math.sin(t * 3 + i * 1.2) + 1) * 0.5;
      ctx.save();
      ctx.globalAlpha = ss * 0.7;
      ctx.fillStyle   = ['#ff6b9d','#f7d060','#ffffff','#c39bd3'][i % 4];
      ctx.beginPath();
      ctx.arc(sx, sy, ss * 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Update particles
    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].draw();
      if (particles[i].life <= 0) particles.splice(i, 1);
    }
  }
  drawHeartCanvas();

  function burstHeart() {
    heartTarget = 1.3;
    setTimeout(() => { heartTarget = 1; }, 200);

    // Spawn particles
    const cx = canvas.width  / 2;
    const cy = canvas.height / 2;
    for (let i = 0; i < 30; i++) {
      particles.push(new HeartParticle(
        cx + (Math.random()-0.5)*80,
        cy + (Math.random()-0.5)*80,
        '#ff6b9d'
      ));
    }

    // Show message
    if (msgEl) {
      msgEl.textContent = messages[msgIdx % messages.length];
      msgEl.classList.add('visible');
      msgIdx++;
      setTimeout(() => msgEl.classList.remove('visible'), 2500);
    }

    // Vibration
    if (navigator.vibrate) navigator.vibrate([30, 20, 30]);

    // Mini confetti
    if (typeof confetti !== 'undefined') {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: {
          x: canvas.getBoundingClientRect().left / window.innerWidth + 0.5 * canvas.width / window.innerWidth,
          y: canvas.getBoundingClientRect().top  / window.innerHeight + 0.3
        },
        colors: ['#ff6b9d','#9b59b6','#f7d060']
      });
    }
  }

  canvas.addEventListener('click',  burstHeart);
  canvas.addEventListener('touchstart', e => { e.preventDefault(); burstHeart(); }, { passive: false });
  canvas.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') burstHeart(); });
}

/* =========================================================
   7. GSAP SCROLL ANIMATIONS
   ========================================================= */
function initGSAP() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  // Hero title entrance
  gsap.from('#hero-title', {
    y: 60, opacity: 0, duration: 1.2,
    ease: 'back.out(1.5)', delay: 0.5
  });

  gsap.from('.hero-badges', {
    y: -30, opacity: 0, duration: 1,
    ease: 'power3.out', delay: 0.2
  });

  gsap.from('.hero-cta', {
    y: 40, opacity: 0, duration: 1,
    ease: 'power3.out', delay: 1.2
  });

  // Parallax: letter paper
  gsap.to('.letter-paper', {
    y: -30,
    scrollTrigger: {
      trigger: '#letter',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1
    }
  });

  // Timeline cards stagger (supplementing AOS)
  gsap.from('.timeline-card', {
    scale: 0.85, opacity: 0, duration: 0.7,
    stagger: 0.15,
    ease: 'back.out(1.3)',
    scrollTrigger: {
      trigger: '#timeline',
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    }
  });

  // Counter section parallax
  gsap.to('.counter-grid', {
    y: -20,
    scrollTrigger: {
      trigger: '#counter',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.5
    }
  });

  // Footer heartbeat
  gsap.from('.footer-text', {
    opacity: 0, y: 20, duration: 1,
    scrollTrigger: {
      trigger: '.footer',
      start: 'top 90%',
      toggleActions: 'play none none reverse'
    }
  });
}

/* =========================================================
   8. COUNTER BACKGROUND (Animated canvas)
   ========================================================= */
function initCounterBackground() {
  const el = document.getElementById('counter-bg');
  if (!el) return;

  const canvas = document.createElement('canvas');
  el.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = el.offsetWidth;
    canvas.height = el.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const dots = Array.from({ length: 30 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 2 + 1,
    vx: (Math.random()-0.5) * 0.4,
    vy: (Math.random()-0.5) * 0.4,
    c: ['#ff6b9d','#9b59b6','#f7d060'][Math.floor(Math.random()*3)]
  }));

  function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    dots.forEach(d => {
      d.x += d.vx; d.y += d.vy;
      if (d.x < 0 || d.x > canvas.width)  d.vx *= -1;
      if (d.y < 0 || d.y > canvas.height) d.vy *= -1;

      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI*2);
      ctx.fillStyle = d.c;
      ctx.globalAlpha = 0.4;
      ctx.fill();
    });

    // Draw connections
    ctx.globalAlpha = 0.08;
    ctx.strokeStyle = '#ff6b9d';
    ctx.lineWidth   = 1;
    for (let i = 0; i < dots.length; i++) {
      for (let j = i+1; j < dots.length; j++) {
        const dx = dots[i].x - dots[j].x;
        const dy = dots[i].y - dots[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 150) {
          ctx.beginPath();
          ctx.moveTo(dots[i].x, dots[i].y);
          ctx.lineTo(dots[j].x, dots[j].y);
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }
  draw();
}
