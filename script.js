const bootScreen = document.querySelector('#boot-screen');
if (bootScreen) {
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let hasBooted = false;
  try { hasBooted = sessionStorage.getItem('zeroday-booted') === 'true'; } catch { hasBooted = false; }
  if (hasBooted || reduceMotion) {
    bootScreen.hidden = true;
  } else {
    const count = document.querySelector('#boot-count');
    const terminal = document.querySelector('#boot-terminal');
    const lines = [
      'Sharpening pencils and checking clues...',
      'Packing fresh cyber stories...',
      'Warming up the puzzle corner...',
      'Ready to learn!'
    ];
    const started = performance.now();
    let lastLine = -1;
    const load = (now) => {
      const elapsed = now - started;
      const value = Math.min(100, Math.floor((elapsed / 5000) * 100));
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

document.querySelectorAll('.bingo-board button').forEach((button) => {
  button.addEventListener('click', () => {
    const checked = button.getAttribute('aria-pressed') === 'true';
    button.setAttribute('aria-pressed', String(!checked));
  });
});
