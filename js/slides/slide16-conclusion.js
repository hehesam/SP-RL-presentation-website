/* ============================================================
   SLIDE 16 — Conclusion
   Subtle background valley motif (reuse from slide 01)
   ============================================================ */
import { createSVG } from '../utils/d3-helpers.js';

export function initSlide16() {
  const container = document.getElementById('conclusionBgArt');
  if (!container) return;

  // Apply same styles as title bg
  container.style.position = 'absolute';
  container.style.inset = '0';
  container.style.pointerEvents = 'none';
  container.style.opacity = '0.05';

  const W = 1200, H = 700;
  const svg = createSVG(container, W, H);

  // Valley curve (same as slide 01, slightly shifted)
  const pts = [];
  for (let x = 0; x <= W; x += 4) {
    const t = x / W;
    const y = H * 0.55 + Math.cos(3 * Math.PI * t) * H * 0.18 - t * H * 0.08;
    pts.push([x, y]);
  }

  // Fill
  const areaData = [...pts, [W, H], [0, H]];
  svg.append('path')
    .attr('d', d3.line()(areaData))
    .attr('fill', 'var(--text-secondary)')
    .attr('opacity', 0.5);

  // Line
  svg.append('path')
    .attr('d', d3.line().curve(d3.curveBasis)(pts))
    .attr('fill', 'none')
    .attr('stroke', 'var(--accent-1)')
    .attr('stroke-width', 2)
    .attr('opacity', 0.4);

  // A few dots
  const rng = d3.randomUniform.source(d3.randomLcg(77));
  for (let i = 0; i < 15; i++) {
    svg.append('circle')
      .attr('cx', rng(0, W)())
      .attr('cy', rng(H * 0.25, H * 0.6)())
      .attr('r', rng(2, 5)())
      .attr('fill', 'var(--accent-1)')
      .attr('opacity', rng(0.15, 0.35)());
  }
}
