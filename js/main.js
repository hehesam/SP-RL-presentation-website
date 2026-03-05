/* ============================================================
   MAIN.JS — Navigation, theme toggle, lazy slide init
   ============================================================ */

// ---- Slide module imports (lazy-initialized) ----
import { initSlide01 } from './slides/slide01-title.js';
import { initSlide02 } from './slides/slide02-motivation.js';
import { initSlide03 } from './slides/slide03-mountaincar.js';
import { initSlide04 } from './slides/slide04-qlearning.js';
import { initSlide05 } from './slides/slide05-actor-critic.js';
import { initSlide06 } from './slides/slide06-func-approx.js';
import { initSlide07 } from './slides/slide07-rbf.js';
import { initSlide08 } from './slides/slide08-roadmap.js';
import { initSlide11 as initSlide09 } from './slides/slide11-experiment2.js';
import { initSlide12 as initSlide10 } from './slides/slide12-multiseed-intro.js';
import { initSlide13 as initSlide11 } from './slides/slide13-ql-curves.js';
import { initSlide14 as initSlide12 } from './slides/slide14-ac-curves.js';
import { initSlide15 as initSlide13 } from './slides/slide15-best-comparison.js';
import { initSlide16 as initSlide14 } from './slides/slide16-heatmaps.js';
import { initSlide17 as initSlide15 } from './slides/slide17-scatter.js';
import { initSlide18 as initSlide16 } from './slides/slide18-success-curves.js';
import { initSlide20 as initSlide17 } from './slides/slide20-summary.js';

const slideInits = {
  1: initSlide01, 2: initSlide02, 3: initSlide03, 4: initSlide04,
  5: initSlide05, 6: initSlide06, 7: initSlide07, 8: initSlide08,
  9: initSlide09, 10: initSlide10, 11: initSlide11, 12: initSlide12,
  13: initSlide13, 14: initSlide14, 15: initSlide15, 16: initSlide16,
  17: initSlide17,
};

/* ---- DOM refs ---- */
const container   = document.getElementById('slidesContainer');
const progressFill = document.getElementById('progressFill');
const slideCounter = document.getElementById('slideCounter');
const navDots     = document.getElementById('navDots');
const themeToggle = document.getElementById('themeToggle');
const TOTAL       = 17;

let currentIndex  = 0;
const initialized = new Set();

/* ============================================================
   THEME
   ============================================================ */
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  themeToggle.textContent = theme === 'dark' ? '☾' : '☀';
  localStorage.setItem('theme', theme);
}
(function initTheme() {
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(saved || (prefersDark ? 'dark' : 'light'));
})();
themeToggle.addEventListener('click', () => {
  applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
});

/* ============================================================
   NAV DOTS
   ============================================================ */
for (let i = 0; i < TOTAL; i++) {
  const dot = document.createElement('button');
  dot.className = 'nav-dot' + (i === 0 ? ' active' : '');
  dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
  dot.addEventListener('click', () => goToSlide(i));
  navDots.appendChild(dot);
}
const dots = navDots.querySelectorAll('.nav-dot');

/* ============================================================
   NAVIGATION HELPERS
   ============================================================ */
function isVerticalMode() {
  return window.matchMedia('(max-width: 899px)').matches;
}

function goToSlide(index) {
  index = Math.max(0, Math.min(TOTAL - 1, index));
  if (isVerticalMode()) {
    const slide = document.getElementById(`slide-${index + 1}`);
    if (slide) slide.scrollIntoView({ behavior: 'smooth' });
  } else {
    container.scrollTo({ left: index * window.innerWidth, behavior: 'smooth' });
  }
}

function updateUI(index) {
  if (index === currentIndex && initialized.size > 1) return; // avoid redundant updates on init
  currentIndex = index;

  // dots
  dots.forEach((d, i) => d.classList.toggle('active', i === index));

  // counter
  slideCounter.textContent = `${String(index + 1).padStart(2, '0')} / ${TOTAL}`;

  // progress bar
  const pct = TOTAL > 1 ? (index / (TOTAL - 1)) * 100 : 0;
  progressFill.style.width = pct + '%';

  // URL hash (no scroll trigger)
  history.replaceState(null, '', `#slide-${index + 1}`);
}

/* ============================================================
   SCROLL LISTENER — update UI on scroll
   ============================================================ */
let ticking = false;
container.addEventListener('scroll', () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    const idx = isVerticalMode()
      ? Math.round(container.scrollTop / window.innerHeight)
      : Math.round(container.scrollLeft / window.innerWidth);
    updateUI(idx);
    ticking = false;
  });
});

/* ============================================================
   KEYBOARD NAVIGATION
   ============================================================ */
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
    e.preventDefault();
    goToSlide(currentIndex + 1);
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    e.preventDefault();
    goToSlide(currentIndex - 1);
  }
});

/* ============================================================
   INTERSECTION OBSERVER — lazy init slides + visibility class
   ============================================================ */
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const slide = entry.target;
    const num = parseInt(slide.dataset.slide, 10);

    if (entry.isIntersecting) {
      slide.classList.add('is-visible');

      // lazy-init D3 chart for this slide
      if (!initialized.has(num) && slideInits[num]) {
        slideInits[num]();
        initialized.add(num);
      }
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.slide').forEach((s) => observer.observe(s));

/* ============================================================
   ON LOAD — hash navigation + KaTeX render
   ============================================================ */
window.addEventListener('load', () => {
  // Render KaTeX
  if (window.renderMathInElement) {
    renderMathInElement(document.body, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '\\[', right: '\\]', display: true },
        { left: '\\(', right: '\\)', display: false },
        { left: '$', right: '$', display: false },
      ],
      throwOnError: false,
    });
  }

  // Jump to hash if present
  const hash = window.location.hash;
  if (hash) {
    const match = hash.match(/slide-(\d+)/);
    if (match) {
      const idx = parseInt(match[1], 10) - 1;
      setTimeout(() => goToSlide(idx), 100);
    }
  }

  // Mark first slide visible immediately
  const firstSlide = document.getElementById('slide-1');
  if (firstSlide) firstSlide.classList.add('is-visible');
  updateUI(0);
});

/* ============================================================
   RESIZE HANDLER — recalc scroll position
   ============================================================ */
window.addEventListener('resize', () => {
  if (!isVerticalMode()) {
    container.scrollTo({ left: currentIndex * window.innerWidth, behavior: 'auto' });
  }
});
