const typewriter = document.querySelector('#typewriter');
const phrases = ['Zero-Day. Zero Trust. Zero Compromise.', 'Decode threats. Defend what matters.', 'Research. Report. Reinforce.'];
if (typewriter && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  let phrase = 0, letter = phrases[0].length, deleting = true;
  const tick = () => {
    const text = phrases[phrase];
    letter += deleting ? -1 : 1;
    typewriter.textContent = text.slice(0, letter);
    let delay = deleting ? 28 : 48;
    if (!deleting && letter === text.length) { deleting = true; delay = 1800; }
    if (deleting && letter === 0) { deleting = false; phrase = (phrase + 1) % phrases.length; delay = 280; }
    setTimeout(tick, delay);
  };
  setTimeout(tick, 1800);
}

const bootScreen = document.querySelector('#boot-screen');
if (bootScreen) {
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let hasBooted = false;
  try { hasBooted = sessionStorage.getItem('zeroday-booted') === 'true'; } catch { hasBooted = false; }
  if (hasBooted || reduceMotion) {
    bootScreen.hidden = true;
  } else {
    const progress = document.querySelector('#boot-progress');
    const count = document.querySelector('#boot-count');
    const terminal = document.querySelector('#boot-terminal');
    const lines = [
      '> initializing secure connection...',
      '> loading threat intelligence...',
      '> verifying research node...',
      '> access granted.'
    ];
    const started = performance.now();
    let lastLine = -1;
    const load = (now) => {
      const elapsed = now - started;
      const value = Math.min(100, Math.floor((elapsed / 5000) * 100));
      progress.style.width = `${value}%`;
      count.textContent = `${String(value).padStart(3, '0')}%`;
      const line = Math.min(lines.length - 1, Math.floor(value / 28));
      if (line !== lastLine) { terminal.textContent = lines[line]; lastLine = line; }
      if (value < 100) requestAnimationFrame(load);
      else {
        try { sessionStorage.setItem('zeroday-booted', 'true'); } catch { /* Storage may be disabled. */ }
        setTimeout(() => {
          bootScreen.classList.add('boot-exit');
          setTimeout(() => { bootScreen.hidden = true; }, 750);
        }, 180);
      }
    };
    requestAnimationFrame(load);
  }
}

const siteHeader = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
if (siteHeader && menuToggle) {
  const setMenu = (open) => {
    siteHeader.classList.toggle('menu-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };
  menuToggle.addEventListener('click', () => setMenu(!siteHeader.classList.contains('menu-open')));
  document.querySelectorAll('#site-nav a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', (event) => { if (event.key === 'Escape') setMenu(false); });
  addEventListener('scroll', () => siteHeader.classList.toggle('scrolled', scrollY > 24), { passive: true });
}

const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -30px' });
  reveals.forEach((element) => observer.observe(element));
} else {
  reveals.forEach((element) => element.classList.add('visible'));
}

document.querySelectorAll('[data-year]').forEach((element) => { element.textContent = new Date().getFullYear(); });

const canvas = document.querySelector('#network-canvas');
if (canvas && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const ctx = canvas.getContext('2d');
  let nodes = [], frame;
  const resize = () => {
    const ratio = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = innerWidth * ratio; canvas.height = innerHeight * ratio;
    canvas.style.width = `${innerWidth}px`; canvas.style.height = `${innerHeight}px`;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    nodes = Array.from({length: Math.min(44, Math.floor(innerWidth / 28))}, () => ({x:Math.random()*innerWidth,y:Math.random()*innerHeight,vx:(Math.random()-.5)*.12,vy:(Math.random()-.5)*.12}));
  };
  const draw = () => {
    ctx.clearRect(0,0,innerWidth,innerHeight);
    nodes.forEach((a,i) => { a.x+=a.vx;a.y+=a.vy;if(a.x<0||a.x>innerWidth)a.vx*=-1;if(a.y<0||a.y>innerHeight)a.vy*=-1;ctx.fillStyle='rgba(0,255,157,.25)';ctx.fillRect(a.x,a.y,1.3,1.3);nodes.slice(i+1).forEach(b=>{const d=Math.hypot(a.x-b.x,a.y-b.y);if(d<130){ctx.strokeStyle=`rgba(0,255,157,${.055*(1-d/130)})`;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}}); });
    frame=requestAnimationFrame(draw);
  };
  resize(); draw(); addEventListener('resize', () => { cancelAnimationFrame(frame); resize(); draw(); }, {passive:true});
}
