import './human.css';
import './palette.css';
import './editorial.css';
import './responsive.css';
import './cyber-background.css';

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const root = document.documentElement;

requestAnimationFrame(() => document.body.classList.add('page-ready'));

/* The old five-second "secure boot" was a deliberate cyber trope, but it made the
   site feel like a template. The reference jumps straight into the experience. */
const bootScreen = document.querySelector('#boot-screen');
if (bootScreen) bootScreen.hidden = true;

/* Give every hero a lightweight geometric scene. It is made from ordinary DOM
   lines so it stays sharp, responsive and easy to tune. */
const hero = document.querySelector('.hero, .page-hero');
if (hero) {
  const scene = document.createElement('div');
  scene.className = 'cyber-scene';
  scene.setAttribute('aria-hidden', 'true');
  scene.innerHTML = `
    <div class="scene-ribbon"><span>CYBER DEFENCE / THREAT INTELLIGENCE</span></div>
    <i class="scene-route route-a"></i><i class="scene-route route-b"></i><i class="scene-route route-c"></i><i class="scene-route route-d"></i>
    <div class="scene-chip chip-iam"><i></i><b>IAM</b><small>IDENTITY</small></div>
    <div class="scene-chip chip-cti"><i></i><b>CTI</b><small>THREAT INTEL</small></div>
    <div class="scene-chip chip-soc"><i></i><b>SOC</b><small>MONITOR</small></div>
    <div class="scene-chip chip-net"><i></i><b>NET</b><small>TRAFFIC</small></div>
    <i class="scene-node node-a"></i><i class="scene-node node-b"></i><i class="scene-node node-c"></i>
    <div class="scene-axis"><i></i><i></i><i></i><i></i></div>
  `;
  hero.prepend(scene);

  const stage = document.createElement('div');
  stage.className = 'ambient-stage';
  stage.setAttribute('aria-hidden', 'true');
  stage.innerHTML = '<i class="ambient-ring"></i><i class="ambient-ring"></i><i class="ambient-ring"></i><i class="ambient-ring"></i><i class="ambient-ring"></i>';
  hero.appendChild(stage);

  const stamp = document.createElement('div');
  stamp.className = 'issue-stamp';
  stamp.setAttribute('aria-hidden', 'true');
  const pageCode = hero.dataset.code || 'ISSUE 01';
  stamp.innerHTML = `<span>ZERODAY / ${pageCode}</span><b>AUG 2026</b>`;
  hero.appendChild(stamp);
}

/* Type remains part of the ZeroDay personality, but the cadence is intentionally
   less machine-perfect than a stock typewriter loop. */
const typewriter = document.querySelector('#typewriter');
const phrases = [
  'Zero-Day. Zero Trust. Zero Compromise.',
  'Decode threats. Defend what matters.',
  'Research. Report. Reinforce.'
];
if (typewriter && !reduceMotion) {
  let phrase = 0;
  let letter = phrases[0].length;
  let deleting = true;
  const tick = () => {
    const text = phrases[phrase];
    letter += deleting ? -1 : 1;
    typewriter.textContent = text.slice(0, letter);
    const humanJitter = Math.round(Math.random() * 26);
    let delay = deleting ? 34 + humanJitter : 52 + humanJitter;
    if (!deleting && letter === text.length) {
      deleting = true;
      delay = 2100;
    }
    if (deleting && letter === 0) {
      deleting = false;
      phrase = (phrase + 1) % phrases.length;
      delay = 360;
    }
    setTimeout(tick, delay);
  };
  setTimeout(tick, 2100);
}

/* Header and mobile navigation. */
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
  addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setMenu(false);
  });
}

/* Stagger reveal timing by visual group, rather than applying the exact same
   entrance to every block. */
const reveals = [...document.querySelectorAll('.reveal')];
reveals.forEach((element, index) => {
  element.style.setProperty('--reveal-delay', `${(index % 4) * 65}ms`);
});

if ('IntersectionObserver' in window && !reduceMotion) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -42px' });
  reveals.forEach((element) => observer.observe(element));
} else {
  reveals.forEach((element) => element.classList.add('visible'));
}

/* A tiny section rail echoes the reference site's "moving through chapters"
   feeling without turning the newsletter into a one-page presentation. */
const mainSections = [...document.querySelectorAll('main > section')];
if (mainSections.length > 1) {
  const rail = document.createElement('aside');
  rail.className = 'scroll-rail';
  rail.setAttribute('aria-hidden', 'true');
  mainSections.forEach(() => rail.appendChild(document.createElement('i')));
  document.body.appendChild(rail);
  const railItems = [...rail.children];

  const setActiveSection = () => {
    const target = innerHeight * 0.48;
    let bestIndex = 0;
    let bestDistance = Infinity;
    mainSections.forEach((section, index) => {
      const rect = section.getBoundingClientRect();
      const distance = Math.abs(Math.min(Math.max(target, rect.top), rect.bottom) - target);
      if (rect.top <= target && rect.bottom >= target) {
        bestIndex = index;
        bestDistance = -1;
      } else if (bestDistance !== -1 && distance < bestDistance) {
        bestDistance = distance;
        bestIndex = index;
      }
    });
    railItems.forEach((item, index) => item.classList.toggle('active', index === bestIndex));
  };
  setActiveSection();
  addEventListener('scroll', setActiveSection, { passive: true });
}

/* Pointer light + low-amplitude parallax. */
let pointerFrame = 0;
addEventListener('pointermove', (event) => {
  if (reduceMotion || pointerFrame) return;
  pointerFrame = requestAnimationFrame(() => {
    root.style.setProperty('--px', `${event.clientX}px`);
    root.style.setProperty('--py', `${event.clientY}px`);
    pointerFrame = 0;
  });
}, { passive: true });

let scrollFrame = 0;
const updateScrollMotion = () => {
  if (siteHeader) siteHeader.classList.toggle('scrolled', scrollY > 24);
  if (!reduceMotion && hero) {
    const shift = Math.min(scrollY * 0.055, 28);
    root.style.setProperty('--hero-shift', `${shift}px`);
    root.style.setProperty('--ambient-shift', `${Math.min(scrollY * -0.035, 0)}px`);
  }
};
updateScrollMotion();
addEventListener('scroll', () => {
  if (scrollFrame) return;
  scrollFrame = requestAnimationFrame(() => {
    updateScrollMotion();
    scrollFrame = 0;
  });
}, { passive: true });

/* Keep the object-like tilt only on the hero terminal. Flat editorial rows stay flat. */
if (!reduceMotion && matchMedia('(pointer:fine)').matches) {
  const tiltTargets = document.querySelectorAll('.terminal-card');
  tiltTargets.forEach((card) => {
    card.classList.add('tilt-target');
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.setProperty('--ry', `${(x * 2.2).toFixed(2)}deg`);
      card.style.setProperty('--rx', `${(-y * 2.0).toFixed(2)}deg`);
    });
    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--ry', '0deg');
      card.style.setProperty('--rx', '0deg');
    });
  });
}

/* Short curtain between real pages. Hash jumps and modified clicks stay native. */
const curtain = document.createElement('div');
curtain.className = 'page-transition';
curtain.setAttribute('aria-hidden', 'true');
document.body.appendChild(curtain);

document.querySelectorAll('a[href]').forEach((link) => {
  link.addEventListener('click', (event) => {
    if (
      reduceMotion ||
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      link.target === '_blank' ||
      link.hasAttribute('download')
    ) return;

    const url = new URL(link.href, location.href);
    const sameDocument = url.pathname === location.pathname && url.search === location.search;
    if (url.origin !== location.origin || (sameDocument && url.hash)) return;

    event.preventDefault();
    document.body.classList.add('page-leaving');
    setTimeout(() => { location.href = url.href; }, 360);
  });
});

document.querySelectorAll('[data-year]').forEach((element) => {
  element.textContent = new Date().getFullYear();
});

/* Home-only network layer. Keep it quiet; the geometric stage carries the
   personality and the canvas simply adds a little depth. */
const canvas = document.querySelector('#network-canvas');
if (canvas && !reduceMotion) {
  const ctx = canvas.getContext('2d');
  let nodes = [];
  let frame;

  const resize = () => {
    const ratio = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = innerWidth * ratio;
    canvas.height = innerHeight * ratio;
    canvas.style.width = `${innerWidth}px`;
    canvas.style.height = `${innerHeight}px`;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    nodes = Array.from(
      { length: Math.min(30, Math.floor(innerWidth / 42)) },
      () => ({
        x: Math.random() * innerWidth,
        y: Math.random() * innerHeight,
        vx: (Math.random() - 0.5) * 0.09,
        vy: (Math.random() - 0.5) * 0.09
      })
    );
  };

  const draw = () => {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    nodes.forEach((a, index) => {
      a.x += a.vx;
      a.y += a.vy;
      if (a.x < 0 || a.x > innerWidth) a.vx *= -1;
      if (a.y < 0 || a.y > innerHeight) a.vy *= -1;

      ctx.fillStyle = 'rgba(216,200,170,.25)';
      ctx.fillRect(a.x, a.y, 1.2, 1.2);

      nodes.slice(index + 1).forEach((b) => {
        const distance = Math.hypot(a.x - b.x, a.y - b.y);
        if (distance < 150) {
          ctx.strokeStyle = `rgba(154,169,186,${0.045 * (1 - distance / 150)})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      });
    });
    frame = requestAnimationFrame(draw);
  };

  resize();
  draw();
  addEventListener('resize', () => {
    cancelAnimationFrame(frame);
    resize();
    draw();
  }, { passive: true });
}
