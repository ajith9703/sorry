/**
 * timeline.js — Memory Timeline section
 * Builds animated timeline cards with scroll animations
 */

document.addEventListener('DOMContentLoaded', initTimeline);

function initTimeline() {
  const wrapper = document.getElementById('timeline-wrapper');
  if (!wrapper) return;

  const memories = [
    {
      title: 'The Day We Met',
      date: 'A Beautiful Beginning',
      desc: 'I remember the exact moment I saw you. Time slowed down, and something inside me knew — this person is going to change my life forever.',
      heart: '💫'
    },
    {
      title: 'Our First Conversation',
      date: 'Words That Changed Everything',
      desc: 'We talked for hours like we had known each other forever. Every word you said made my heart race a little faster.',
      heart: '💬'
    },
    {
      title: 'When You First Smiled at Me',
      date: 'A Moment I Replay Daily',
      desc: 'Your smile. That specific smile — just for me. I knew right then that I wanted to spend every day making you smile like that.',
      heart: '😊'
    },
    {
      title: 'The First Time You Laughed',
      date: 'My Favorite Sound',
      desc: 'I had never wanted so badly to be funny. Your laugh is the most beautiful sound in the world — pure, free, and real.',
      heart: '🌟'
    },
    {
      title: 'Late Night Talks',
      date: 'When the World Was Just Us',
      desc: 'Those late nights when we talked about everything — dreams, fears, silly things and serious things. I never wanted morning to come.',
      heart: '🌙'
    },
    {
      title: 'The Day I Knew I Loved You',
      date: 'A Quiet, Certain Moment',
      desc: 'It wasn\'t a grand gesture. It was a quiet, ordinary moment when I looked at you and thought: I love this person. Completely and without condition.',
      heart: '❤️'
    },
    {
      title: 'When You Were There for Me',
      date: 'My Safe Place',
      desc: 'During one of my hardest days, you were there — not with perfect words, just with your presence. That\'s when I understood what home feels like.',
      heart: '🏠'
    },
    {
      title: 'Watching You Light Up',
      date: 'About Something You Love',
      desc: 'Watching you talk about things you\'re passionate about is one of my greatest joys. Your eyes come alive, and I fall in love all over again.',
      heart: '✨'
    },
    {
      title: 'Our Shared Silences',
      date: 'Comfortable and Warm',
      desc: 'The silence between us was never awkward — it was soft. We didn\'t need words to feel close. That\'s rare. That\'s us.',
      heart: '🕊️'
    },
    {
      title: 'The Day You Chose to Stay',
      date: 'When Love Was a Decision',
      desc: 'You could have walked away. But you didn\'t. You chose us. You chose me. I will never stop being grateful for that choice.',
      heart: '💝'
    },
    {
      title: 'Seeing You Handle Hard Times',
      date: 'Your Quiet Strength',
      desc: 'Watching you navigate pain with grace and dignity made me respect and love you on a completely different level.',
      heart: '💪'
    },
    {
      title: 'Every Ordinary Day With You',
      date: 'The Best Kind of Days',
      desc: 'Not every memory is a grand event. Some of my most precious memories are just ordinary days — made extraordinary because you were in them.',
      heart: '🌸'
    }
  ];

  memories.forEach((mem, i) => {
    const item = document.createElement('div');
    item.className = 'timeline-item';

    const dot  = document.createElement('div');
    dot.className = 'timeline-dot';

    const card = document.createElement('div');
    card.className = 'timeline-card card-shimmer';
    card.setAttribute('data-aos', i % 2 === 0 ? 'fade-right' : 'fade-left');
    card.setAttribute('data-aos-delay', String(i * 80));
    card.innerHTML = `
      <div class="timeline-heart">${mem.heart}</div>
      <div class="timeline-date">${mem.date}</div>
      <h3 class="timeline-title">${mem.title}</h3>
      <p class="timeline-desc">${mem.desc}</p>
    `;

    item.appendChild(dot);
    item.appendChild(card);
    wrapper.appendChild(item);
  });
}
