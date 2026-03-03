/* ============================================================
   SLIDE 07 — RBF Feature Map
   Grid of RBF centers over 2D state space + activation visualization
   ============================================================ */
import { createSVG, drawXAxis, drawYAxis, cssVar } from '../utils/d3-helpers.js';
import { generateRBFCenters, RBF_SIGMA } from '../utils/data.js';

export function initSlide07() {
  const container = document.getElementById('chart-rbf');
  if (!container) return;

  const W = 500, H = 400;
  const svg = createSVG(container, W, H);
  const m = { top: 25, right: 25, bottom: 50, left: 55 };
  const w = W - m.left - m.right;
  const h = H - m.top - m.bottom;
  const g = svg.append('g').attr('transform', `translate(${m.left},${m.top})`);

  // Scales (normalized [0,1])
  const xScale = d3.scaleLinear().domain([0, 1]).range([0, w]);
  const yScale = d3.scaleLinear().domain([0, 1]).range([h, 0]);

  drawXAxis(g, xScale, h, 'Normalized Position', 5);
  drawYAxis(g, yScale, 'Normalized Velocity', 5);

  // ---- RBF Centers ----
  const centers = generateRBFCenters();

  // Draw center dots
  g.selectAll('.rbf-center')
    .data(centers)
    .enter()
    .append('circle')
    .attr('class', 'rbf-center')
    .attr('cx', d => xScale(d.x))
    .attr('cy', d => yScale(d.y))
    .attr('r', 0)
    .attr('fill', 'var(--text-secondary)')
    .attr('opacity', 0.5)
    .transition()
    .delay((d, i) => i * 8)
    .duration(400)
    .attr('r', 4);

  // ---- Example state point ----
  const exState = { x: 0.35, y: 0.6 };

  // Draw activation rings around nearby centers
  const sigma = RBF_SIGMA;
  centers.forEach(c => {
    const dist2 = (c.x - exState.x) ** 2 + (c.y - exState.y) ** 2;
    const activation = Math.exp(-dist2 / (2 * sigma * sigma));
    if (activation > 0.05) {
      g.append('circle')
        .attr('cx', xScale(c.x))
        .attr('cy', yScale(c.y))
        .attr('r', 0)
        .attr('fill', 'var(--accent-1)')
        .attr('opacity', 0)
        .transition()
        .delay(600)
        .duration(600)
        .attr('r', 4 + activation * 18)
        .attr('opacity', activation * 0.5);
    }
  });

  // The example state point itself
  g.append('circle')
    .attr('cx', xScale(exState.x))
    .attr('cy', yScale(exState.y))
    .attr('r', 0)
    .attr('fill', 'var(--accent-2)')
    .attr('stroke', 'var(--text-primary)')
    .attr('stroke-width', 1.5)
    .transition()
    .delay(500)
    .duration(400)
    .attr('r', 7);

  // Example state label
  g.append('text')
    .attr('x', xScale(exState.x) + 12)
    .attr('y', yScale(exState.y) - 10)
    .attr('fill', 'var(--accent-2)')
    .style('font-size', '12px')
    .style('font-weight', '600')
    .text('example state');

  // ---- Small radial influence inset (bottom-right) ----
  const insetSize = 80;
  const insetX = w - insetSize - 5;
  const insetY = h - insetSize - 5;
  const insetG = g.append('g').attr('transform', `translate(${insetX},${insetY})`);

  // Background
  insetG.append('rect')
    .attr('width', insetSize).attr('height', insetSize)
    .attr('rx', 6)
    .attr('fill', 'var(--bg-card)')
    .attr('stroke', 'var(--border)')
    .attr('stroke-width', 1);

  // Concentric rings
  const rings = [0.2, 0.4, 0.6, 0.8, 1.0];
  rings.forEach(r => {
    insetG.append('circle')
      .attr('cx', insetSize / 2).attr('cy', insetSize / 2)
      .attr('r', r * (insetSize / 2 - 5))
      .attr('fill', 'none')
      .attr('stroke', 'var(--accent-1)')
      .attr('stroke-width', 1)
      .attr('opacity', 1.1 - r);
  });

  // Center dot
  insetG.append('circle')
    .attr('cx', insetSize / 2).attr('cy', insetSize / 2)
    .attr('r', 3)
    .attr('fill', 'var(--accent-1)');

  // Label
  insetG.append('text')
    .attr('x', insetSize / 2).attr('y', insetSize + 14)
    .attr('text-anchor', 'middle')
    .attr('fill', 'var(--text-muted)')
    .style('font-size', '10px')
    .text('Radial influence');
}
