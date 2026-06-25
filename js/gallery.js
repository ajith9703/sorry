/**
 * gallery.js — GIF gallery + Photo masonry gallery + Lightbox
 * Uses Canvas API to generate beautiful animated placeholders
 */

document.addEventListener('DOMContentLoaded', () => {
  initPhotoGallery();
});



function drawFloatingHearts(ctx, W, H, t, colors) {
  for (let i = 0; i < 8; i++) {
    const x = W * 0.15 + (i * W * 0.1) + Math.sin(t + i) * 20;
    const y = H * 0.5 + Math.cos(t * 0.7 + i * 0.8) * 50;
    ctx.save();
    ctx.globalAlpha = 0.7 + Math.sin(t + i) * 0.3;
    ctx.font = (20 + Math.sin(t + i) * 8) + 'px serif';
    ctx.fillText('❤️', x, y);
    ctx.restore();
  }
}

function drawPulseHeart(ctx, W, H, t, colors) {
  const cx = W/2, cy = H/2;
  const scale = 1 + Math.sin(t * 2) * 0.15;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);

  // Heart shape
  ctx.beginPath();
  for (let a = 0; a < Math.PI * 2; a += 0.05) {
    const x = 16 * Math.pow(Math.sin(a), 3) * 4;
    const y = -(13 * Math.cos(a) - 5 * Math.cos(2*a) - 2*Math.cos(3*a) - Math.cos(4*a)) * 4;
    a === 0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
  }
  ctx.closePath();
  const gr = ctx.createRadialGradient(0,-20,5,0,0,70);
  gr.addColorStop(0, colors[1] + 'ff');
  gr.addColorStop(1, colors[0] + 'ff');
  ctx.fillStyle = gr;
  ctx.shadowColor = colors[0]; ctx.shadowBlur = 30;
  ctx.fill();
  ctx.restore();
}

function drawBloom(ctx, W, H, t, colors) {
  const cx = W/2, cy = H/2;
  const petals = 6;
  for (let i = 0; i < petals; i++) {
    const angle  = (Math.PI * 2 / petals) * i + t * 0.3;
    const radius = 40 + Math.sin(t * 2) * 10;
    ctx.save();
    ctx.translate(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
    ctx.rotate(angle + t);
    ctx.beginPath();
    ctx.ellipse(0, 0, 25, 15, 0, 0, Math.PI * 2);
    ctx.fillStyle = colors[i % 2] + 'cc';
    ctx.fill();
    ctx.restore();
  }
  // Center
  ctx.beginPath();
  ctx.arc(cx, cy, 15, 0, Math.PI * 2);
  ctx.fillStyle = '#f7d060';
  ctx.fill();
}

function drawBounce(ctx, W, H, t, colors) {
  const cy = H * 0.5 + Math.abs(Math.sin(t * 2)) * -60;
  ctx.font = '80px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🧸', W/2, cy + H*0.1);
  // Shadow
  ctx.globalAlpha = 0.2;
  const sw = 60 + Math.abs(Math.sin(t*2)) * 20;
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.ellipse(W/2, H*0.8, sw, 8, 0, 0, Math.PI*2);
  ctx.fill();
  ctx.globalAlpha = 1;
}

function drawFloat(ctx, W, H, t, colors) {
  const y = H/2 + Math.sin(t) * 20;
  ctx.save();
  ctx.translate(W/2, y);
  ctx.rotate(Math.sin(t * 0.5) * 0.1);
  ctx.font = '70px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('💌', 0, 0);
  // sparkles
  for (let i = 0; i < 5; i++) {
    const a = (Math.PI * 2 / 5) * i + t;
    ctx.font = '16px serif';
    ctx.fillText('✨', Math.cos(a) * 60, Math.sin(a) * 40);
  }
  ctx.restore();
}

function drawBlush(ctx, W, H, t, colors) {
  // Simple blushing circles
  ctx.save();
  ctx.globalAlpha = 0.5 + Math.sin(t) * 0.2;
  ctx.fillStyle = '#ff9ff3';
  ctx.beginPath(); ctx.arc(W*0.35, H*0.5, 30, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(W*0.65, H*0.5, 30, 0, Math.PI*2); ctx.fill();
  ctx.restore();
  ctx.font = '60px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('😳', W/2, H/2);
}

function drawWalk(ctx, W, H, t, colors) {
  const x = (t * 30) % (W + 80) - 40;
  ctx.font = '50px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  ctx.fillText('👫', x, H * 0.75);
  // Path
  ctx.strokeStyle = colors[0] + '44';
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 10]);
  ctx.beginPath(); ctx.moveTo(0, H*0.75+10); ctx.lineTo(W, H*0.75+10); ctx.stroke();
  ctx.setLineDash([]);
}

function drawRain(ctx, W, H, t, colors) {
  // Rain drops
  ctx.fillStyle = colors[0] + '55';
  for (let i = 0; i < 20; i++) {
    const rx = (i * 50 + t * 80) % W;
    const ry = (i * 30 + t * 120) % H;
    ctx.fillRect(rx, ry, 2, 8);
  }
  ctx.font = '50px serif';
  ctx.textAlign = 'center';
  ctx.fillText('🌧️', W/2, H/2 + Math.sin(t) * 5);
}

function drawMoon(ctx, W, H, t, colors) {
  // Moon glow
  const gr = ctx.createRadialGradient(W/2, H/2, 20, W/2, H/2, 100);
  gr.addColorStop(0, '#f7d06077');
  gr.addColorStop(1, 'transparent');
  ctx.fillStyle = gr;
  ctx.fillRect(0,0,W,H);
  ctx.font = '60px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🌙', W/2, H/2 + Math.sin(t*0.5)*10);
  // Stars
  for (let i = 0; i < 8; i++) {
    const a = (Math.PI*2/8)*i + t*0.1;
    const r = 80 + Math.sin(t+i)*15;
    ctx.globalAlpha = 0.5 + Math.sin(t*2+i)*0.3;
    ctx.font = '14px serif';
    ctx.fillText('⭐', W/2+Math.cos(a)*r, H/2+Math.sin(a)*r);
  }
  ctx.globalAlpha = 1;
}

function drawFly(ctx, W, H, t, colors) {
  for (let i = 0; i < 6; i++) {
    const x = W/2 + Math.cos(t + i * Math.PI/3) * (60 + i*10);
    const y = H/2 + Math.sin(t * 1.2 + i * Math.PI/3) * 40;
    ctx.save();
    ctx.globalAlpha = 0.8;
    ctx.font = '24px serif';
    ctx.textAlign = 'center';
    ctx.fillText('🦋', x, y);
    ctx.restore();
  }
}

/* =========================================================
   PHOTO GALLERY — Masonry with Canvas art + Lightbox
   ========================================================= */
function initPhotoGallery() {
  const masonry = document.getElementById('photo-masonry');
  if (!masonry) return;

  const photos = [
    { title: 'Our Magical Beginning', caption: 'Where our story started ❤️', height: 280, palette: ['#ff6b9d','#9b59b6'], emoji: '🌹' },
    { title: 'Laughter We Share',     caption: 'Every smile is a gift 😊',   height: 220, palette: ['#f7d060','#ff6b9d'], emoji: '😊' },
    { title: 'Under the Stars',       caption: 'You are my favorite star ⭐', height: 320, palette: ['#1a0040','#9b59b6'], emoji: '⭐' },
    { title: 'Heart Full of You',     caption: 'My heart is yours 💕',        height: 240, palette: ['#ff9ff3','#ff6b9d'], emoji: '💕' },
    { title: 'Wild Butterflies',      caption: 'You give me butterflies 🦋',  height: 300, palette: ['#ff6b9d','#f7d060'], emoji: '🦋' },
    { title: 'Rose Garden Moments',   caption: 'Our love blooms 🌺',          height: 260, palette: ['#e91e8c','#9b59b6'], emoji: '🌺' },
    { title: 'Moonlit Promises',      caption: 'Forever under the moon 🌙',   height: 350, palette: ['#0d0040','#9b59b6'], emoji: '🌙' },
    { title: 'Cherry Blossom Days',   caption: 'Gentle like the spring 🌸',   height: 230, palette: ['#ffb3cc','#ff6b9d'], emoji: '🌸' },
    { title: 'Golden Hour Love',      caption: 'Every moment is golden 🌟',   height: 290, palette: ['#f7d060','#ff6b9d'], emoji: '🌟' },
    { title: 'Warm Embrace',          caption: 'Safe in your warmth 💗',       height: 270, palette: ['#9b59b6','#ff6b9d'], emoji: '💗' },
    { title: 'Eyes Full of Love',     caption: 'I see my world in you 👁️',   height: 310, palette: ['#6c3483','#9b59b6'], emoji: '👁️' },
    { title: 'Dancing Hearts',        caption: 'My heart dances for you 💃',  height: 250, palette: ['#ff6b9d','#f7d060'], emoji: '💃' },
  ];

  const lightboxImgs = [];

  photos.forEach((photo, index) => {
    const item = document.createElement('div');
    item.className = 'photo-item lazy-fade';
    item.setAttribute('data-aos', 'fade-up');
    item.setAttribute('data-aos-delay', String((index % 4) * 100));

    const canvas = document.createElement('canvas');
    canvas.width  = 400;
    canvas.height = photo.height;
    canvas.style.height = photo.height + 'px';
    canvas.setAttribute('aria-label', photo.title);

    // Draw artistic photo placeholder
    drawPhotoPlaceholder(canvas, photo);

    const caption = document.createElement('div');
    caption.className = 'photo-caption';
    caption.textContent = photo.caption;

    item.appendChild(canvas);
    item.appendChild(caption);
    masonry.appendChild(item);

    lightboxImgs.push({ canvas, caption: photo.caption, title: photo.title });

    // Lazy load observer
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          item.classList.add('loaded');
          obs.disconnect();
        }
      });
    });
    obs.observe(item);

    // Click to open lightbox
    item.addEventListener('click', () => openLightbox(index, lightboxImgs));
  });
}

function drawPhotoPlaceholder(canvas, photo) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const [c1, c2] = photo.palette;

  // Background gradient
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, c1 + '66');
  bg.addColorStop(1, c2 + '66');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Animated art - use requestAnimationFrame for subtle movement
  let t = 0;
  function draw() {
    ctx.clearRect(0, 0, W, H);
    const bg2 = ctx.createLinearGradient(0, 0, W, H);
    bg2.addColorStop(0, c1 + '55');
    bg2.addColorStop(1, c2 + '55');
    ctx.fillStyle = bg2;
    ctx.fillRect(0, 0, W, H);

    // Overlay circles
    for (let i = 0; i < 3; i++) {
      const gr = ctx.createRadialGradient(
        W * (0.3 + i * 0.2), H * (0.2 + i * 0.3), 0,
        W * (0.3 + i * 0.2), H * (0.2 + i * 0.3), 80 + Math.sin(t + i) * 20
      );
      gr.addColorStop(0, c1 + '33');
      gr.addColorStop(1, 'transparent');
      ctx.fillStyle = gr;
      ctx.fillRect(0, 0, W, H);
    }

    // Center emoji
    ctx.font = '60px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.globalAlpha = 0.4 + Math.sin(t * 0.5) * 0.1;
    ctx.fillText(photo.emoji, W/2, H/2 - 15);
    ctx.globalAlpha = 1;

    // Title text
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.font = 'bold 14px Montserrat, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(photo.title, W/2, H - 16);

    // Decorative corner hearts
    ctx.font = '14px serif';
    ctx.globalAlpha = 0.3;
    ctx.fillText('❤️', 16, 20);
    ctx.fillText('❤️', W - 30, 20);
    ctx.fillText('❤️', 16, H - 10);
    ctx.fillText('❤️', W - 30, H - 10);
    ctx.globalAlpha = 1;

    t += 0.01;
    requestAnimationFrame(draw);
  }

  // Start drawing when visible
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) draw(); });
  }, { threshold: 0.1 });
  obs.observe(canvas);
}

/* =========================================================
   LIGHTBOX
   ========================================================= */
let lightboxIndex = 0;
let lightboxData  = [];

function openLightbox(index, data) {
  lightboxIndex = index;
  lightboxData  = data;

  const lightbox = document.getElementById('lightbox');
  const img      = document.getElementById('lightbox-img');
  const cap      = document.getElementById('lightbox-caption');
  if (!lightbox || !img) return;

  const item = data[index];
  // Convert canvas to data URL for lightbox display
  img.src = item.canvas.toDataURL();
  cap.textContent = item.caption;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (lightbox) lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

function navigateLightbox(dir) {
  lightboxIndex = (lightboxIndex + dir + lightboxData.length) % lightboxData.length;
  const item = lightboxData[lightboxIndex];
  const img  = document.getElementById('lightbox-img');
  const cap  = document.getElementById('lightbox-caption');
  if (img) img.src = item.canvas.toDataURL();
  if (cap) cap.textContent = item.caption;
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('lightbox-close')?.addEventListener('click', closeLightbox);
  document.getElementById('lightbox-prev')?.addEventListener('click', () => navigateLightbox(-1));
  document.getElementById('lightbox-next')?.addEventListener('click', () => navigateLightbox(1));
  document.getElementById('lightbox')?.addEventListener('click', e => {
    if (e.target === e.currentTarget) closeLightbox();
  });

  // Keyboard navigation
  document.addEventListener('keydown', e => {
    const lb = document.getElementById('lightbox');
    if (!lb?.classList.contains('active')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });
});
