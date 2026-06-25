/**
 * script.js — Main orchestrator for Sorry Aaru website
 * Handles: Loading, AOS, cursor, scroll, theme, reasons, promises,
 *          hidden notes, Easter eggs, love popup, counter, Typed.js, navbar
 */

/* =========================================================
   1. DOM READY
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
  initLoading();
  initCursor();
  initScrollProgress();
  initTheme();
  initNavbar();
  initTyped();
  initReasonsGrid();
  initPromisesGrid();
  initHiddenNotes();
  initEasterEggs();
  initForgiveButton();
  initLetterDate();
  initFooterHearts();
  initLovePopup();
  AOS.init({ duration: 800, once: false, offset: 80, easing: 'ease-out-cubic' });
});

/* =========================================================
   2. LOADING SCREEN
   ========================================================= */
function initLoading() {
  const bar     = document.getElementById('loading-bar');
  const pct     = document.getElementById('loading-percent');
  const screen  = document.getElementById('loading-screen');
  const canvas  = document.getElementById('loading-canvas');

  // Resize canvas
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d');

  // Draw floating hearts on loading canvas
  const loadParticles = Array.from({ length: 40 }, () => ({
    x: Math.random() * canvas.width,
    y: canvas.height + Math.random() * 200,
    s: Math.random() * 20 + 10,
    spd: Math.random() * 1.5 + 0.5,
    drift: (Math.random() - 0.5) * 0.5,
    opacity: Math.random() * 0.5 + 0.2
  }));

  let raf;
  function drawLoading() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    loadParticles.forEach(p => {
      p.y -= p.spd;
      p.x += p.drift;
      if (p.y < -50) {
        p.y = canvas.height + 50;
        p.x = Math.random() * canvas.width;
      }
      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.font = `${p.s}px serif`;
      ctx.fillText('❤️', p.x, p.y);
      ctx.restore();
    });
    raf = requestAnimationFrame(drawLoading);
  }
  drawLoading();

  // Simulate loading progress
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 8 + 2;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      setTimeout(() => {
        cancelAnimationFrame(raf);
        screen.classList.add('hidden');
        setTimeout(() => screen.remove(), 800);
      }, 400);
    }
    bar.style.width = progress + '%';
    pct.textContent = Math.floor(progress) + '%';
  }, 80);
}

/* =========================================================
   3. CUSTOM CURSOR
   ========================================================= */
function initCursor() {
  const cursor = document.getElementById('cursor');
  const trailContainer = document.getElementById('cursor-trail');

  let mouseX = 0, mouseY = 0;
  let curX = 0, curY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Create heart trail
    const trail = document.createElement('div');
    trail.className = 'heart-trail-piece';
    trail.style.left = e.clientX + 'px';
    trail.style.top  = e.clientY + 'px';
    trail.textContent = '❤️';
    trail.style.fontSize = (Math.random() * 10 + 8) + 'px';
    document.body.appendChild(trail);
    setTimeout(() => trail.remove(), 800);
  });

  // Smooth cursor follow
  function smoothCursor() {
    curX += (mouseX - curX) * 0.15;
    curY += (mouseY - curY) * 0.15;
    cursor.style.left = curX + 'px';
    cursor.style.top  = curY + 'px';
    requestAnimationFrame(smoothCursor);
  }
  smoothCursor();

  // Scale on interactive elements
  document.querySelectorAll('a, button, [role="button"], .reason-card, .promise-card, .timeline-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(1.8)';
      cursor.style.background = 'var(--purple)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(1)';
      cursor.style.background = 'var(--pink)';
    });
  });
}

/* =========================================================
   4. SCROLL PROGRESS BAR
   ========================================================= */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  window.addEventListener('scroll', () => {
    const scrollTop    = window.scrollY;
    const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled     = (scrollTop / docHeight) * 100;
    bar.style.width    = scrolled + '%';
  }, { passive: true });
}

/* =========================================================
   5. THEME TOGGLE
   ========================================================= */
function initTheme() {
  const btn  = document.getElementById('theme-toggle');
  const icon = document.getElementById('theme-icon');
  const body = document.body;

  const saved = localStorage.getItem('aaru-theme') || 'dark';
  if (saved === 'light') {
    body.classList.replace('dark-mode', 'light-mode');
    icon.className = 'fas fa-sun';
  }

  btn.addEventListener('click', () => {
    if (body.classList.contains('dark-mode')) {
      body.classList.replace('dark-mode', 'light-mode');
      icon.className = 'fas fa-sun';
      localStorage.setItem('aaru-theme', 'light');
    } else {
      body.classList.replace('light-mode', 'dark-mode');
      icon.className = 'fas fa-moon';
      localStorage.setItem('aaru-theme', 'dark');
    }
  });
}

/* =========================================================
   6. NAVBAR
   ========================================================= */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const toggle = document.getElementById('nav-toggle');
  const links  = document.getElementById('nav-links');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  toggle.addEventListener('click', () => links.classList.toggle('open'));

  // Close on link click
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => links.classList.remove('open'));
  });
}

/* =========================================================
   7. TYPED.JS — Hero subtitle
   ========================================================= */
function initTyped() {
  const el = document.getElementById('typed-text');
  if (!el || typeof Typed === 'undefined') return;

  new Typed(el, {
    strings: [
      "I never wanted to hurt you.",
      "You mean everything to me.",
      "You are my world, Aaru.",
      "I'm sorry from the deepest part of my heart.",
      "Every day without your smile feels incomplete.",
      "You are my safe place.",
      "I love you more than words can say.",
      "Please forgive me, my love. ❤️"
    ],
    typeSpeed: 50,
    backSpeed: 30,
    backDelay: 2000,
    loop: true,
    smartBackspace: true
  });
}


/* =========================================================
   9. LETTER DATE
   ========================================================= */
function initLetterDate() {
  const el = document.getElementById('letter-date');
  if (!el) return;
  const now = new Date();
  el.textContent = now.toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
}

/* =========================================================
   10. 100 REASONS I LOVE YOU
   ========================================================= */
function initReasonsGrid() {
  const grid = document.getElementById('reasons-grid');
  if (!grid) return;

  const reasons = [
    "Your smile lights up every room",
    "The way you laugh from your soul",
    "How you care for everyone around you",
    "Your beautiful, kind heart",
    "The way you say my name",
    "How you remember the little things",
    "Your strength when life gets hard",
    "The warmth in your voice",
    "Your dreams and the fire behind them",
    "How you make everything feel safe",
    "Your honesty, even when it's hard",
    "The way you hug me like you mean it",
    "How you understand without words",
    "Your passion for what you love",
    "The way your eyes sparkle",
    "How you forgive so beautifully",
    "Your patience with my flaws",
    "The way you love so fiercely",
    "How you find joy in small things",
    "Your creativity and imagination",
    "The way you smell like home",
    "How you make me want to be better",
    "Your courage to feel deeply",
    "The way you dance when you think no one watches",
    "How you support me unconditionally",
    "Your wisdom beyond your years",
    "The way you look when you're thinking",
    "How you bring peace into chaos",
    "Your gentle touch",
    "The way you say goodnight",
    "How you make ordinary days special",
    "Your belief in me",
    "The way you read my moods",
    "How you always have the right words",
    "Your unique perspective on the world",
    "The way you love your family",
    "How your presence calms every storm",
    "Your curiosity about everything",
    "The way you protect your loved ones",
    "How you give without expecting anything back",
    "Your beautiful, soulful eyes",
    "The way you handle challenges with grace",
    "How you make me feel chosen",
    "Your infectious enthusiasm",
    "The way you listen with your whole heart",
    "How you turn my worst days into better ones",
    "Your sensitivity — it's your superpower",
    "The way you hold space for my feelings",
    "How you always show up",
    "Your resilience that inspires me",
    "The way you say 'I love you' back",
    "How you make silence feel comfortable",
    "Your beautiful handwriting",
    "The way you light up talking about things you love",
    "How you never give up on what matters",
    "Your kindness to strangers",
    "The way you notice when I'm hurting",
    "How you grow and evolve every day",
    "Your willingness to be vulnerable",
    "The way you make me feel seen",
    "How you celebrate others' wins",
    "Your commitment to your values",
    "The way you love deeply",
    "How you make me feel like home",
    "Your gentle correction when I'm wrong",
    "The way you hold my hand",
    "How you turn boring moments into memories",
    "Your deep empathy",
    "The way you pray and trust",
    "How you encourage me to dream bigger",
    "Your beautiful mind",
    "The way you see the best in people",
    "How you forgive without keeping score",
    "Your adventurous spirit",
    "The way you make every occasion feel special",
    "How you bring out the best in me",
    "Your grace under pressure",
    "The way you smell when it rains",
    "How you find beauty in unexpected places",
    "Your gentleness with children",
    "The way you stand by your loved ones",
    "How you communicate from the heart",
    "Your ability to make me laugh",
    "The way you turn pain into growth",
    "How you remain kind even when hurt",
    "Your radiant inner light",
    "The way you make me feel worthy of love",
    "How you fill every space with life",
    "Your voice — it's my favorite sound",
    "The way you inspire without trying",
    "How your love makes me brave",
    "Your loyalty that never wavers",
    "The way you shine, even on cloudy days",
    "How you understand me without explanation",
    "Your prayers for the people you love",
    "The way you remain hopeful",
    "How you make my world so much richer",
    "Your endless heart",
    "The way you love me — exactly as I am",
    "How simply being with you feels like everything"
  ];

  const hearts = ['💗','💕','💖','💓','💞','❤️','💝','🌹','✨','💗'];

  reasons.forEach((reason, i) => {
    const card = document.createElement('div');
    card.className = 'reason-card card-shimmer';
    card.setAttribute('data-aos', 'fade-up');
    card.setAttribute('data-aos-delay', String((i % 8) * 50));
    card.innerHTML = `
      <span class="reason-num">#${String(i+1).padStart(2,'0')}</span>
      <span class="reason-heart">${hearts[i % hearts.length]}</span>
      <p class="reason-text">${reason}</p>
    `;
    grid.appendChild(card);
  });
}

/* =========================================================
   11. 50 PROMISE CARDS
   ========================================================= */
function initPromisesGrid() {
  const grid = document.getElementById('promises-grid');
  if (!grid) return;

  const promises = [
    "I promise to listen — truly listen — to your heart.",
    "I promise to never take your love for granted.",
    "I promise to be your safe place, always.",
    "I promise to understand before I speak.",
    "I promise to never stop saying 'I love you'.",
    "I promise to protect your smile.",
    "I promise to hold your hand through every storm.",
    "I promise to choose you, every single day.",
    "I promise to celebrate every version of you.",
    "I promise to be patient with your feelings.",
    "I promise to communicate openly and honestly.",
    "I promise to never make you feel invisible.",
    "I promise to be your biggest supporter.",
    "I promise to grow alongside you.",
    "I promise to remember what matters to you.",
    "I promise to never hurt you intentionally again.",
    "I promise to be present — not just physically.",
    "I promise to respect your boundaries.",
    "I promise to make you laugh, every day.",
    "I promise to show up when it's hard.",
    "I promise to put your happiness first.",
    "I promise to be the man you deserve.",
    "I promise to cherish every moment with you.",
    "I promise to never stop trying to understand you.",
    "I promise to keep our love a safe place.",
    "I promise to hold you when you cry.",
    "I promise to cheer loudest for your dreams.",
    "I promise to never walk away from us.",
    "I promise to apologize when I am wrong.",
    "I promise to be honest, even when it's difficult.",
    "I promise to make you feel loved in your love language.",
    "I promise to value your opinion above all others.",
    "I promise to fight for us, not with you.",
    "I promise to see you at your worst and still choose you.",
    "I promise to protect your secrets.",
    "I promise to be your home in every weather.",
    "I promise to never compare you to anyone.",
    "I promise to trust you completely.",
    "I promise to work on myself — for us.",
    "I promise to keep the magic alive between us.",
    "I promise to be gentle with your heart.",
    "I promise to never make you feel alone.",
    "I promise to put my phone down and look into your eyes.",
    "I promise to be grateful for you, every day.",
    "I promise to make ordinary moments extraordinary.",
    "I promise to love your quirks as much as your perfections.",
    "I promise forever, not just for now.",
    "I promise to be worthy of your forgiveness.",
    "I promise to love you when you can't love yourself.",
    "I promise to love you completely, Aaru — forever and beyond."
  ];

  promises.forEach((promise, i) => {
    const card = document.createElement('div');
    card.className = 'promise-card card-shimmer';
    card.setAttribute('data-aos', 'fade-up');
    card.setAttribute('data-aos-delay', String((i % 6) * 60));
    card.innerHTML = `
      <div class="promise-check">✓</div>
      <p class="promise-text">${promise}</p>
    `;
    grid.appendChild(card);
  });
}

/* =========================================================
   12. HIDDEN LOVE NOTES
   ========================================================= */
function initHiddenNotes() {
  const grid = document.getElementById('hidden-notes-grid');
  if (!grid) return;

  const notes = [
    { icon: '🌹', message: 'I Love You' },
    { icon: '💌', message: "I'm Sorry" },
    { icon: '🦋', message: 'You Are Beautiful' },
    { icon: '⭐', message: 'My Forever' },
    { icon: '👑', message: 'My Princess' },
    { icon: '🌍', message: 'My World' },
    { icon: '💖', message: 'My Aaru' },
    { icon: '🌸', message: 'My Happiness' },
    { icon: '🎀', message: 'My Heart Belongs to You' },
    { icon: '🌙', message: 'My Moonlight' },
    { icon: '✨', message: 'My Everything' },
    { icon: '🌺', message: 'You Complete Me' },
    { icon: '🎶', message: 'You Are My Song' },
    { icon: '🌈', message: 'You Are My Color' },
    { icon: '🕯️', message: 'You Light My Way' },
    { icon: '🦢', message: 'My Grace, My Love' },
  ];

  notes.forEach(({ icon, message }) => {
    const item = document.createElement('div');
    item.className = 'hidden-note-item';
    item.setAttribute('data-aos', 'zoom-in');
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', 'Reveal love note');
    item.textContent = icon;

    const reveal = () => {
      if (item.classList.contains('revealed')) {
        item.classList.remove('revealed');
        item.textContent = icon;
        return;
      }
      item.classList.add('revealed');
      item.textContent = message;
      showLovePopup(message);
      // Add sparkles
      for (let i = 0; i < 6; i++) {
        const spark = document.createElement('div');
        spark.className = 'sparkle-particle';
        spark.textContent = ['✨','💖','🌸'][i % 3];
        spark.style.left = item.getBoundingClientRect().left + Math.random() * item.offsetWidth + 'px';
        spark.style.top  = item.getBoundingClientRect().top  + Math.random() * item.offsetHeight + 'px';
        document.body.appendChild(spark);
        setTimeout(() => spark.remove(), 800);
      }
    };

    item.addEventListener('click', reveal);
    item.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') reveal(); });
    grid.appendChild(item);
  });
}

/* =========================================================
   13. LOVE POPUP
   ========================================================= */
function showLovePopup(message) {
  const popup = document.getElementById('love-popup');
  const msg   = document.getElementById('popup-message');
  if (!popup || !msg) return;
  msg.textContent = message;
  popup.classList.add('active');
  setTimeout(() => popup.classList.remove('active'), 3000);
}

function initLovePopup() {
  const closeBtn = document.getElementById('popup-close');
  const popup    = document.getElementById('love-popup');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => popup.classList.remove('active'));
  }
  if (popup) {
    popup.addEventListener('click', e => {
      if (e.target === popup) popup.classList.remove('active');
    });
  }
}

/* =========================================================
   14. FORGIVE BUTTON + FIREWORKS
   ========================================================= */
function initForgiveButton() {
  const btn = document.getElementById('forgive-btn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    // Trigger confetti
    if (typeof confetti !== 'undefined') {
      confetti({ particleCount: 200, spread: 120, origin: { y: 0.6 }, colors: ['#ff6b9d','#9b59b6','#f7d060','#ffffff'] });
      setTimeout(() => confetti({ particleCount: 100, spread: 100, angle: 60, origin: { x: 0, y: 0.7 } }), 400);
      setTimeout(() => confetti({ particleCount: 100, spread: 100, angle: 120, origin: { x: 1, y: 0.7 } }), 700);
    }

    // Launch fireworks on canvas
    launchFireworks();

    // Change button text
    btn.innerHTML = '<span>💝 Thank You, My Love! I Promise 💝</span>';
    btn.style.background = 'linear-gradient(135deg, #f7d060, #e4a011, #f7d060)';

    // Show message
    showLovePopup("Thank you for forgiving me, Aaru 💕");

    // Balloons
    if (window.releaseBalloons) window.releaseBalloons(10);
  });
}

function launchFireworks() {
  const canvas = document.getElementById('fireworks-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width  = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  const particles = [];
  const colors = ['#ff6b9d','#9b59b6','#f7d060','#ffffff','#ff9ff3','#54a0ff'];

  function createBurst(x, y) {
    for (let i = 0; i < 60; i++) {
      const angle  = (Math.PI * 2 / 60) * i;
      const speed  = Math.random() * 5 + 2;
      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 4 + 2
      });
    }
  }

  // Create multiple bursts
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      createBurst(
        Math.random() * canvas.width,
        Math.random() * canvas.height * 0.6
      );
    }, i * 300);
  }

  function animateFireworks() {
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.08; // gravity
      p.alpha -= 0.015;
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Remove dead particles
    for (let i = particles.length - 1; i >= 0; i--) {
      if (particles[i].alpha <= 0) particles.splice(i, 1);
    }

    if (particles.length > 0) requestAnimationFrame(animateFireworks);
    else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
  animateFireworks();
}

/* =========================================================
   15. EASTER EGGS
   ========================================================= */
function initEasterEggs() {
  const overlay = document.getElementById('easter-egg-overlay');
  const icon    = document.getElementById('egg-icon');
  const msg     = document.getElementById('egg-message');
  const closeBtn= document.getElementById('egg-close');

  if (!overlay) return;

  const eggs = [
    { trigger: 'konami', icon: '🎮', message: 'You found the secret! You are my Player 1 forever, Aaru ❤️' },
    { trigger: 'double-heart', icon: '💖', message: 'Two clicks, infinite love! You are my forever, Aaru 💕' },
    { trigger: 'keyboard', icon: '✨', message: 'You pressed LOVE! That\'s all I want from you, Aaru 🌹' },
    { trigger: 'triple-flower', icon: '🌸', message: 'Three taps for three words: I. Love. You. Aaru 💗' }
  ];

  function showEgg(eggKey) {
    const egg = eggs.find(e => e.trigger === eggKey);
    if (!egg) return;
    icon.textContent = egg.icon;
    msg.textContent  = egg.message;
    overlay.classList.add('active');
    if (typeof confetti !== 'undefined') {
      confetti({ particleCount: 80, spread: 90, origin: { y: 0.5 } });
    }
  }

  closeBtn.addEventListener('click', () => overlay.classList.remove('active'));
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.classList.remove('active'); });

  // Konami Code: ↑↑↓↓←→←→BA
  const konamiCode = [38,38,40,40,37,39,37,39,66,65];
  let konamiIndex  = 0;
  document.addEventListener('keydown', e => {
    if (e.keyCode === konamiCode[konamiIndex]) {
      konamiIndex++;
      if (konamiIndex === konamiCode.length) {
        showEgg('konami');
        konamiIndex = 0;
      }
    } else {
      konamiIndex = 0;
    }

    // Secret: type "LOVE"
    loveBuffer += e.key.toUpperCase();
    if (loveBuffer.endsWith('LOVE')) {
      showEgg('keyboard');
      loveBuffer = '';
    }
  });

  let loveBuffer = '';

  // Double-click the hero heart
  const heroHeart = document.getElementById('hero-heart');
  if (heroHeart) {
    heroHeart.addEventListener('dblclick', () => showEgg('double-heart'));
  }

  // Triple-tap a flower
  let flowerTaps = 0;
  let flowerTimer;
  document.querySelectorAll('.flower').forEach(f => {
    f.addEventListener('click', () => {
      flowerTaps++;
      clearTimeout(flowerTimer);
      flowerTimer = setTimeout(() => { flowerTaps = 0; }, 600);
      if (flowerTaps >= 3) {
        showEgg('triple-flower');
        flowerTaps = 0;
      }
    });
  });
}

/* =========================================================
   16. FOOTER HEARTS
   ========================================================= */
function initFooterHearts() {
  const container = document.getElementById('footer-hearts');
  if (!container) return;

  function spawnFooterHeart() {
    const h = document.createElement('div');
    h.className = 'footer-heart-particle';
    h.textContent = ['❤️','🌹','✨','💕','🌸'][Math.floor(Math.random()*5)];
    h.style.left   = Math.random() * 100 + '%';
    h.style.bottom = '0';
    const dur = Math.random() * 4 + 3;
    h.style.animationDuration = dur + 's';
    h.style.animationDelay   = Math.random() * 2 + 's';
    container.appendChild(h);
    setTimeout(() => h.remove(), (dur + 2) * 1000);
  }

  // Initial batch
  for (let i = 0; i < 8; i++) setTimeout(spawnFooterHeart, i * 300);
  setInterval(spawnFooterHeart, 800);
}

/* =========================================================
   EXPORT for cross-file use
   ========================================================= */
window.showLovePopup = showLovePopup;
