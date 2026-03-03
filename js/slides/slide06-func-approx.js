/* ============================================================
   SLIDE 06 — Why Function Approximation
   2D state-space scatter (position × velocity) showing continuous space
   ============================================================ */
import { createSVG, drawXAxis, drawYAxis, drawGrid, cssVar } from '../utils/d3-helpers.js';

export function initSlide06() {
  const container = document.getElementById('chart-funcapprox');
  if (!container) return;

  const W = 480, H = 380;
  const svg = createSVG(container, W, H);
  const m = { top: 25, right: 25, bottom: 50, left: 55 };
  const w = W - m.left - m.right;
  const h = H - m.top - m.bottom;
  const g = svg.append('g').attr('transform', `translate(${m.left},${m.top})`);

  const xScale = d3.scaleLinear().domain([-1.2, 0.6]).range([0, w]);
  const yScale = d3.scaleLinear().domain([-0.07, 0.07]).range([h, 0]);

  drawGrid(g, yScale, w, 6);
  drawXAxis(g, xScale, h, 'Position', 6);
  drawYAxis(g, yScale, 'Velocity', 6);

  // Generate dense random state samples
  const rng = d3.randomUniform.source(d3.randomLcg(12345));
  const points = [];
  for (let i = 0; i < 500; i++) {
    points.push({
      x: rng(-1.2, 0.6)(),
      y: rng(-0.07, 0.07)(),
    });
  }

  // Draw points with entrance animation
  g.selectAll('.state-dot')
    .data(points)
    .enter()
    .append('circle')
    .attr('class', 'state-dot')
    .attr('cx', d => xScale(d.x))
    .attr('cy', d => yScale(d.y))
    .attr('r', 0)
    .attr('fill', 'var(--accent-1)')
    .attr('opacity', 0.35)
    .transition()
    .delay((d, i) => i * 1.2)
    .duration(400)
    .attr('r', 2.5);

  // Overlay a faint grid to show "mapping to features" idea
  const gridN = 7;
  const gridOpacity = 0.0;
  // Vertical lines
  for (let i = 0; i <= gridN; i++) {
    const px = xScale(-1.2 + (0.6 + 1.2) * (i / gridN));
    g.append('line')
      .attr('x1', px).attr('y1', 0)
      .attr('x2', px).attr('y2', h)
      .attr('stroke', 'var(--accent-2)')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '4,4')
      .attr('opacity', gridOpacity)
      .transition()
      .delay(700)
      .duration(800)
      .attr('opacity', 0.25);
  }
  // Horizontal lines
  for (let j = 0; j <= gridN; j++) {
    const py = yScale(-0.07 + 0.14 * (j / gridN));
    g.append('line')
      .attr('x1', 0).attr('y1', py)
      .attr('x2', w).attr('y2', py)
      .attr('stroke', 'var(--accent-2)')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '4,4')
      .attr('opacity', 0)
      .transition()
      .delay(700)
      .duration(800)
      .attr('opacity', 0.25);
  }

  // "Continuous → Features" annotation
  g.append('text')
    .attr('x', w / 2).attr('y', -8)
    .attr('text-anchor', 'middle')
    .attr('fill', 'var(--text-muted)')
    .style('font-size', '12px')
    .style('font-style', 'italic')
    .text('Continuous state space → mapped to RBF features');
}
