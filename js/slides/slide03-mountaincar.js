/* ============================================================
   SLIDE 03 — The MountainCar Problem
   Shows Q-Learning and Actor-Critic training GIFs side-by-side.
   GIFs restart each time the slide becomes visible.
   ============================================================ */

export function initSlide03() {
  const imgs = document.querySelectorAll('#mc-gifs .mc-gif');
  if (!imgs.length) return;

  /* Set initial src from data-src */
  imgs.forEach(img => {
    const base = img.dataset.src;
    if (base) img.src = base;
  });

  /* Restart GIFs each time slide-3 re-enters the viewport */
  const slide = document.getElementById('slide-3');
  if (!slide) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        imgs.forEach(img => {
          const base = (img.dataset.src || img.src).split('?')[0];
          img.src = '';
          requestAnimationFrame(() => {
            img.src = base + '?_=' + Date.now();
          });
        });
      }
    });
  }, { threshold: 0.4 });

  obs.observe(slide);
}
