/**
 * particles.js — Particles.js-style particle field + extra effects
 * Custom canvas-based particle system for the website
 */

document.addEventListener('DOMContentLoaded', initParticleEffects);

function initParticleEffects() {
  // No external particles.js library needed
  // We run our own canvas-based particle system on hero section
  createHeroStarField();
}

/* =========================================================
   HERO STAR FIELD (CSS-based via JS injection)
   ========================================================= */
function createHeroStarField() {
  const hero = document.getElementById('hero');
  if (!hero) return;

  const starField = document.createElement('div');
  starField.className = 'star-field';
  starField.style.pointerEvents = 'none';
  starField.style.position = 'absolute';
  starField.style.inset = '0';
  starField.style.zIndex = '2';
  starField.style.overflow = 'hidden';

  for (let i = 0; i < 80; i++) {
    const star = document.createElement('div');
    const size = Math.random() * 2.5 + 0.5;
    const dur  = Math.random() * 3 + 2;
    const opacity = Math.random() * 0.6 + 0.2;

    star.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      background: ${['#ffffff','#ff9ff3','#f7d060','#c39bd3'][Math.floor(Math.random()*4)]};
      border-radius: 50%;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation: twinkle ${dur}s ease-in-out infinite;
      animation-delay: ${Math.random() * 3}s;
      --opacity: ${opacity};
      box-shadow: 0 0 ${size * 2}px currentColor;
    `;

    starField.appendChild(star);
  }

  hero.prepend(starField);
}
