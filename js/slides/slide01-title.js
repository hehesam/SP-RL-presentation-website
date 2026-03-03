/* ============================================================
   SLIDE 01 — Title Slide
   Subtle SVG background: abstract valley curve with trajectories
   ============================================================ */
import { createSVG, cssVar } from '../utils/d3-helpers.js';

export function initSlide01() {
  const container = document.getElementById('titleBgArt');
  if (!container) return;

  const W = 1200, H = 700;
  const svg = createSVG(container, W, H);

  // Valley curve (cosine-based hill shape)
  const valleyLine = d3.line().curve(d3.curveBasis);
  const pts = [];
  for (let x = 0; x <= W; x += 4) {
    const t = x / W;
    const y = H * 0.55 + Math.cos(3 * Math.PI * t) * H * 0.18
              - t * H * 0.08;
    pts.push([x, y]);
  }

  // Fill below valley
  const areaData = [...pts, [W, H], [0, H]];
  svg.append('path')
    .attr('d', d3.line()(areaData))
    .attr('fill', 'var(--text-secondary)')
    .attr('opacity', 0.08);

  // Valley line
  svg.append('path')
    .attr('d', valleyLine(pts))
    .attr('fill', 'none')
    .attr('stroke', 'var(--text-secondary)')
    .attr('stroke-width', 2)
    .attr('opacity', 0.25);

  // Trajectory arcs (abstract motion paths)
  const trajectories = [
    { cx: W * 0.35, cy: H * 0.48, rx: 80, ry: 25, angle: -10 },
    { cx: W * 0.5,  cy: H * 0.52, rx: 120, ry: 30, angle: 5 },
    { cx: W * 0.65, cy: H * 0.42, rx: 90, ry: 20, angle: -5 },
  ];
  trajectories.forEach((t) => {
    svg.append('ellipse')
      .attr('cx', t.cx).attr('cy', t.cy)
      .attr('rx', t.rx).attr('ry', t.ry)
      .attr('transform', `rotate(${t.angle}, ${t.cx}, ${t.cy})`)
      .attr('fill', 'none')
      .attr('stroke', 'var(--accent-1)')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '6,8')
      .attr('opacity', 0.35);
  });

  // Scattered dots (abstract state space points)
  const rng = d3.randomUniform.source(d3.randomLcg(42));
  for (let i = 0; i < 30; i++) {
    svg.append('circle')
      .attr('cx', rng(0, W)())
      .attr('cy', rng(H * 0.2, H * 0.7)())
      .attr('r', rng(1.5, 3.5)())
      .attr('fill', 'var(--text-secondary)')
      .attr('opacity', rng(0.08, 0.2)());
  }
}
