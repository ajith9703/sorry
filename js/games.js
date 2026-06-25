/**
 * games.js — Mini games: Heart Catcher, Memory Match, Love Quiz
 */

document.addEventListener('DOMContentLoaded', initGames);

function initGames() {
  initGameTabs();
  initHeartCatcher();
  initMemoryMatch();
  initLoveQuiz();
}

/* =========================================================
   GAME TABS
   ========================================================= */
function initGameTabs() {
  const tabs   = document.querySelectorAll('.game-tab');
  const panels = document.querySelectorAll('.game-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const target = document.getElementById('game-' + tab.dataset.game);
      if (target) target.classList.add('active');
    });
  });
}

/* =========================================================
   HEART CATCHER GAME
   ========================================================= */
function initHeartCatcher() {
  const canvas    = document.getElementById('catcher-canvas');
  const startBtn  = document.getElementById('catcher-start');
  const scoreEl   = document.getElementById('catcher-score');
  const timeEl    = document.getElementById('catcher-time');
  const livesEl   = document.getElementById('catcher-lives');

  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width  = canvas.offsetWidth  || 550;
  canvas.height = canvas.offsetHeight || 400;

  const W = canvas.width, H = canvas.height;

  let gameActive = false;
  let score      = 0;
  let lives      = 3;
  let timeLeft   = 30;
  let timer;
  let frame;

  // Basket (player)
  const basket = { x: W/2, y: H - 50, w: 80, h: 30, speed: 0 };

  // Falling objects
  const objects = [];
  const goodItems = ['❤️','💕','🌹','✨','💖'];
  const badItems  = ['💔','👎'];

  function spawnObject() {
    if (!gameActive) return;
    const isGood = Math.random() > 0.25;
    objects.push({
      x: Math.random() * (W - 40) + 20,
      y: -30,
      emoji: isGood
        ? goodItems[Math.floor(Math.random() * goodItems.length)]
        : badItems[Math.floor(Math.random() * badItems.length)],
      speed: Math.random() * 2 + 1.5 + (30 - timeLeft) * 0.05,
      good: isGood
    });
    setTimeout(spawnObject, Math.random() * 600 + 400);
  }

  // Mouse / touch control
  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    basket.x = (e.clientX - rect.left) - basket.w / 2;
    basket.x = Math.max(0, Math.min(W - basket.w, basket.x));
  });

  canvas.addEventListener('touchmove', e => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    basket.x = (e.touches[0].clientX - rect.left) - basket.w / 2;
    basket.x = Math.max(0, Math.min(W - basket.w, basket.x));
  }, { passive: false });

  function startGame() {
    score     = 0; lives = 3; timeLeft = 30;
    objects.length = 0;
    gameActive = true;
    startBtn.style.display = 'none';
    scoreEl.textContent  = '0';
    livesEl.textContent  = '❤️❤️❤️';
    timeEl.textContent   = '30';

    // Timer
    clearInterval(timer);
    timer = setInterval(() => {
      timeLeft--;
      timeEl.textContent = timeLeft;
      if (timeLeft <= 0) endGame();
    }, 1000);

    spawnObject();
    gameLoop();
  }

  function endGame() {
    gameActive = false;
    clearInterval(timer);
    cancelAnimationFrame(frame);

    // Draw end screen
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(0,0,W,H);
    ctx.fillStyle = '#ff6b9d';
    ctx.font = 'bold 28px Playfair Display, serif';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over! 💖', W/2, H/2 - 40);
    ctx.fillStyle = '#f7d060';
    ctx.font = '20px Montserrat, sans-serif';
    ctx.fillText(`Score: ${score} hearts caught!`, W/2, H/2 + 10);
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.font = '14px Montserrat, sans-serif';
    ctx.fillText('Click "Start Game" to play again', W/2, H/2 + 50);

    startBtn.textContent = '🎮 Play Again';
    startBtn.style.display = 'block';

    if (score >= 15 && window.showLovePopup) {
      window.showLovePopup('Amazing! You caught ' + score + ' hearts for Aaru! 💕');
    }
  }

  function gameLoop() {
    if (!gameActive) return;
    frame = requestAnimationFrame(gameLoop);

    ctx.clearRect(0, 0, W, H);

    // Background
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, 'rgba(10,0,20,0.9)');
    bg.addColorStop(1, 'rgba(20,0,40,0.9)');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Draw basket
    ctx.save();
    ctx.fillStyle = 'rgba(255,107,157,0.3)';
    ctx.strokeStyle = '#ff6b9d';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(basket.x, basket.y, basket.w, basket.h, 8);
    ctx.fill();
    ctx.stroke();
    ctx.font = '20px serif';
    ctx.textAlign = 'center';
    ctx.fillText('❤️', basket.x + basket.w/2, basket.y + basket.h*0.7);
    ctx.restore();

    // Draw and update objects
    ctx.font = '26px serif';
    for (let i = objects.length - 1; i >= 0; i--) {
      const obj = objects[i];
      obj.y += obj.speed;
      ctx.fillText(obj.emoji, obj.x, obj.y);

      // Catch check
      if (
        obj.y >= basket.y && obj.y <= basket.y + basket.h &&
        obj.x >= basket.x && obj.x <= basket.x + basket.w
      ) {
        objects.splice(i, 1);
        if (obj.good) {
          score++;
          scoreEl.textContent = score;
          // Mini burst
          if (typeof confetti !== 'undefined') {
            confetti({ particleCount: 15, spread: 40, origin: {
              x: (basket.x + basket.w/2) / W,
              y: (basket.y) / H + 0.05
            }, colors: ['#ff6b9d','#f7d060'] });
          }
        } else {
          lives--;
          livesEl.textContent = '❤️'.repeat(lives);
          if (lives <= 0) { endGame(); return; }
        }
        continue;
      }

      // Miss
      if (obj.y > H + 30) objects.splice(i, 1);
    }

    // Score display
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '12px Montserrat, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Move mouse / swipe to catch hearts!', 10, H - 10);
  }

  startBtn?.addEventListener('click', startGame);
}

/* =========================================================
   MEMORY MATCH GAME
   ========================================================= */
function initMemoryMatch() {
  const grid    = document.getElementById('memory-grid');
  const matchEl = document.getElementById('memory-matches');
  const movesEl = document.getElementById('memory-moves');
  const restart = document.getElementById('memory-restart');

  if (!grid) return;

  const emojis = ['❤️','🌹','🦋','✨','💕','🌸','🎀','💝'];
  let cards    = [];
  let flipped  = [];
  let matched  = 0;
  let moves    = 0;
  let canFlip  = true;

  function buildBoard() {
    grid.innerHTML = '';
    matched = 0; moves = 0; flipped = []; canFlip = true;
    if (matchEl) matchEl.textContent = '0/8';
    if (movesEl) movesEl.textContent = '0';

    const deck = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
    cards = deck.map((emoji, i) => {
      const card = document.createElement('div');
      card.className = 'memory-card';
      card.dataset.emoji = emoji;
      card.dataset.idx   = i;
      const span = document.createElement('span');
      span.textContent = emoji;
      card.appendChild(span);

      card.addEventListener('click', () => flipCard(card, span));
      grid.appendChild(card);
      return card;
    });
  }

  function flipCard(card, span) {
    if (!canFlip) return;
    if (card.classList.contains('flipped') || card.classList.contains('matched')) return;
    if (flipped.length >= 2) return;

    card.classList.add('flipped');
    span.style.display = 'block';
    flipped.push(card);

    if (flipped.length === 2) {
      moves++;
      if (movesEl) movesEl.textContent = moves;
      canFlip = false;
      setTimeout(checkMatch, 700);
    }
  }

  function checkMatch() {
    const [a, b] = flipped;
    if (a.dataset.emoji === b.dataset.emoji) {
      a.classList.add('matched');
      b.classList.add('matched');
      matched++;
      if (matchEl) matchEl.textContent = `${matched}/8`;

      if (matched === 8) {
        setTimeout(() => {
          if (typeof confetti !== 'undefined') {
            confetti({ particleCount: 150, spread: 120, colors: ['#ff6b9d','#9b59b6','#f7d060'] });
          }
          if (window.showLovePopup) window.showLovePopup('You matched all hearts! Perfect like our love! 💖');
        }, 300);
      }
    } else {
      a.classList.remove('flipped');
      b.classList.remove('flipped');
      a.querySelector('span').style.display = '';
      b.querySelector('span').style.display = '';
    }
    flipped = [];
    canFlip = true;
  }

  restart?.addEventListener('click', buildBoard);
  buildBoard();
}

/* =========================================================
   LOVE QUIZ GAME
   ========================================================= */
function initLoveQuiz() {
  const questionEl = document.getElementById('quiz-question');
  const optionsEl  = document.getElementById('quiz-options');
  const resultEl   = document.getElementById('quiz-result');
  const progressEl = document.getElementById('quiz-progress');
  const startBtn   = document.getElementById('quiz-start');

  if (!questionEl || !startBtn) return;

  const questions = [
    {
      q: 'What does Aaru mean to me?',
      options: ['Just a friend', 'My everything ❤️', 'Someone I know', 'My colleague'],
      correct: 1,
      response: 'Yes! You are my entire world! 💖'
    },
    {
      q: 'How much do I love Aaru?',
      options: ['A little bit', 'Sometimes', 'Infinitely and beyond ❤️', 'Not sure'],
      correct: 2,
      response: 'More than all the stars in the sky! ✨'
    },
    {
      q: 'What is my biggest wish for Aaru?',
      options: ['Fame', 'Aaru\'s happiness and smile 😊', 'Wealth', 'Success only'],
      correct: 1,
      response: 'Your smile is all I ever want to protect! 🌸'
    },
    {
      q: 'When do I think of Aaru?',
      options: ['Only weekends', 'Every single moment ❤️', 'Sometimes', 'Only when sad'],
      correct: 1,
      response: 'Every breath, every heartbeat — you are there! 💕'
    },
    {
      q: 'What do I promise Aaru forever?',
      options: ['Nothing', 'My love, loyalty and respect ❤️', 'Only gifts', 'Just fun times'],
      correct: 1,
      response: 'My love for you has no expiration date! 💝'
    },
    {
      q: 'How does Aaru\'s smile make me feel?',
      options: ['Normal', 'Like the luckiest person alive 💫', 'Okay', 'Indifferent'],
      correct: 1,
      response: 'Your smile is my greatest treasure! 🌟'
    },
    {
      q: 'What is Aaru\'s best quality?',
      options: ['Everything about her ❤️', 'Her hair only', 'Just her looks', 'Her jokes'],
      correct: 0,
      response: 'Everything — her soul, her heart, her mind! 💖'
    },
    {
      q: 'How long will I love Aaru?',
      options: ['For a year', 'Until we disagree', 'Forever and beyond ❤️', 'For now'],
      correct: 2,
      response: 'Love without an end — that is what you deserve! 🌹'
    }
  ];

  let currentQ = 0;
  let quizScore = 0;
  let quizActive = false;

  function startQuiz() {
    currentQ = 0; quizScore = 0; quizActive = true;
    startBtn.style.display = 'none';
    if (resultEl) resultEl.textContent = '';
    showQuestion();
  }

  function showQuestion() {
    if (currentQ >= questions.length) {
      endQuiz();
      return;
    }
    const q = questions[currentQ];
    if (progressEl) progressEl.style.width = ((currentQ / questions.length) * 100) + '%';
    if (questionEl) questionEl.textContent = q.q;
    if (optionsEl) {
      optionsEl.innerHTML = '';
      q.options.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option';
        btn.textContent = opt;
        btn.addEventListener('click', () => answerQuestion(i, btn));
        optionsEl.appendChild(btn);
      });
    }
    if (resultEl) resultEl.textContent = '';
  }

  function answerQuestion(idx, btn) {
    const q = questions[currentQ];
    const allBtns = optionsEl.querySelectorAll('.quiz-option');
    allBtns.forEach(b => b.disabled = true);

    if (idx === q.correct) {
      quizScore++;
      btn.classList.add('correct');
      if (resultEl) resultEl.textContent = '✓ ' + q.response;
    } else {
      btn.classList.add('wrong');
      allBtns[q.correct].classList.add('correct');
      if (resultEl) resultEl.textContent = '❌ The answer is: ' + q.options[q.correct];
    }

    currentQ++;
    setTimeout(showQuestion, 2000);
  }

  function endQuiz() {
    if (progressEl) progressEl.style.width = '100%';
    const pct = Math.round((quizScore / questions.length) * 100);
    const msgs = [
      pct === 100 ? '💯 Perfect! You know my love for you is real! 💖' :
      pct >= 75   ? '💕 Wonderful! My love for you overflows! 🌹' :
      pct >= 50   ? '💗 Pretty good! Let me show you more! ✨' :
                   '❤️ Start again — you are always worth my effort! 💌'
    ];
    if (questionEl) questionEl.textContent = `You scored ${quizScore}/${questions.length}! ${msgs[0]}`;
    if (optionsEl)  optionsEl.innerHTML = '';
    if (resultEl)   resultEl.textContent = '';

    if (pct >= 75 && typeof confetti !== 'undefined') {
      confetti({ particleCount: 100, spread: 100, colors: ['#ff6b9d','#9b59b6','#f7d060'] });
    }

    startBtn.textContent = '🔄 Play Again';
    startBtn.style.display = 'block';
    quizActive = false;
  }

  startBtn.addEventListener('click', startQuiz);
}
