/**
 * effects.js — Ripple effects, sparkle utilities, and misc UI effects
 */

document.addEventListener('DOMContentLoaded', () => {
  initRippleEffect();
  initSectionBgOverlays();
  initScrollRevealCards();
});

/* =========================================================
   RIPPLE EFFECT on buttons
   ========================================================= */
function initRippleEffect() {
  document.querySelectorAll('.cta-btn, .game-start-btn, .forgive-btn, .game-tab').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const rect   = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size   = Math.max(rect.width, rect.height);
      ripple.className = 'ripple';
      ripple.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${e.clientX - rect.left - size/2}px;
        top:  ${e.clientY - rect.top  - size/2}px;
      `;
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });
}

/* =========================================================
   SECTION BG OVERLAYS (subtle animated gradient)
   ========================================================= */
function initSectionBgOverlays() {
  document.querySelectorAll('.section-bg-overlay').forEach(overlay => {
    let t = 0;
    function anim() {
      t += 0.002;
      const hue = 280 + Math.sin(t) * 30;
      overlay.style.background = `radial-gradient(ellipse at ${50 + Math.sin(t)*30}% ${50 + Math.cos(t)*20}%,
        hsla(${hue},60%,25%,0.15) 0%, transparent 70%)`;
      requestAnimationFrame(anim);
    }
    anim();
  });
}

/* =========================================================
   SCROLL REVEAL — Stagger cards as they enter viewport
   ========================================================= */
function initScrollRevealCards() {
  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const card = entry.target;
        card.style.opacity   = '1';
        card.style.transform = 'translateY(0) scale(1)';
        observer.unobserve(card);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  // Observe reason and promise cards (supplement AOS)
  document.querySelectorAll('.reason-card, .promise-card').forEach((card, i) => {
    card.style.opacity    = '0';
    card.style.transform  = 'translateY(20px) scale(0.95)';
    card.style.transition = `opacity 0.5s ease ${(i % 10) * 50}ms, transform 0.5s ease ${(i % 10) * 50}ms`;
    observer.observe(card);
  });
}

/* =========================================================
   SPARKLE BURST utility (exported)
   ========================================================= */
window.createSparkle = function(x, y, count = 8) {
  const emojis = ['✨','💖','🌸','🌟','💕'];
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'sparkle-particle';
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.left = (x + (Math.random()-0.5)*80) + 'px';
    el.style.top  = (y + (Math.random()-0.5)*80) + 'px';
    el.style.fontSize = (Math.random() * 12 + 10) + 'px';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 900);
  }
};
