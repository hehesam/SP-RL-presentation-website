/* ============================================================
   SLIDE 03 — The MountainCar Problem
   D3 schematic: valley curve, car, goal flag, momentum arrows
   ============================================================ */
import { createSVG, cssVar } from '../utils/d3-helpers.js';

export function initSlide03() {
  const container = document.getElementById('chart-mountaincar');
  if (!container) return;

  const W = 560, H = 380;
  const svg = createSVG(container, W, H);
  const margin = { top: 20, right: 30, bottom: 40, left: 30 };
  const w = W - margin.left - margin.right;
  const h = H - margin.top - margin.bottom;
  const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

  // ---- Valley curve: height(x) = sin(3x) style ----
  const xScale = d3.scaleLinear().domain([-1.2, 0.6]).range([0, w]);
  const height = (x) => Math.sin(3 * x);
  const yMin = -1.1, yMax = 1.2;
  const yScale = d3.scaleLinear().domain([yMin, yMax]).range([h, 0]);

  // Generate valley curve points
  const curveData = [];
  for (let x = -1.2; x <= 0.6; x += 0.01) {
    curveData.push({ x, y: height(x) });
  }

  // Fill under curve
  const area = d3.area()
    .x(d => xScale(d.x))
    .y0(h)
    .y1(d => yScale(d.y))
    .curve(d3.curveBasis);

  g.append('path')
    .datum(curveData)
    .attr('d', area)
    .attr('fill', 'var(--accent-1)')
    .attr('opacity', 0.08);

  // Valley line
  const line = d3.line()
    .x(d => xScale(d.x))
    .y(d => yScale(d.y))
    .curve(d3.curveBasis);

  g.append('path')
    .datum(curveData)
    .attr('d', line)
    .attr('fill', 'none')
    .attr('stroke', 'var(--text-secondary)')
    .attr('stroke-width', 2.5);

  // ---- Car (circle on the valley) ----
  const carX = -0.5; // near the bottom
  const carY = height(carX);
  g.append('circle')
    .attr('cx', xScale(carX))
    .attr('cy', yScale(carY) - 8)
    .attr('r', 10)
    .attr('fill', 'var(--accent-2)')
    .attr('stroke', 'var(--text-primary)')
    .attr('stroke-width', 1.5);

  // Car label
  g.append('text')
    .attr('x', xScale(carX))
    .attr('y', yScale(carY) - 24)
    .attr('text-anchor', 'middle')
    .attr('fill', 'var(--accent-2)')
    .style('font-size', '12px')
    .style('font-weight', '600')
    .text('Car');

  // ---- Goal flag on right hill ----
  const goalX = 0.5;
  const goalY = height(goalX);
  const flagX = xScale(goalX);
  const flagY = yScale(goalY) - 8;

  // Flag pole
  g.append('line')
    .attr('x1', flagX).attr('y1', flagY)
    .attr('x2', flagX).attr('y2', flagY - 35)
    .attr('stroke', 'var(--accent-1)')
    .attr('stroke-width', 2);

  // Flag
  g.append('polygon')
    .attr('points', `${flagX},${flagY - 35} ${flagX + 20},${flagY - 28} ${flagX},${flagY - 20}`)
    .attr('fill', 'var(--accent-1)');

  // Goal label
  g.append('text')
    .attr('x', flagX + 8)
    .attr('y', flagY - 40)
    .attr('text-anchor', 'start')
    .attr('fill', 'var(--accent-1)')
    .style('font-size', '12px')
    .style('font-weight', '600')
    .text('Goal');

  // ---- Momentum arrows ----
  // Left arrow (push left to build momentum)
  const arrowY = yScale(height(-0.5)) + 30;
  drawMomentumArrow(g, xScale(-0.5), arrowY, xScale(-1.0), arrowY, 'var(--accent-3)');
  drawMomentumArrow(g, xScale(-0.5) + 10, arrowY, xScale(0.1), arrowY, 'var(--accent-3)');

  // Momentum label
  g.append('text')
    .attr('x', xScale(-0.5))
    .attr('y', arrowY + 18)
    .attr('text-anchor', 'middle')
    .attr('fill', 'var(--accent-3)')
    .style('font-size', '11px')
    .style('font-style', 'italic')
    .text('build momentum');

  // ---- State/Action/Reward annotations ----
  const infoY = h + 30;
  const labels = [
    { x: w * 0.15, text: 'State: (pos, vel)', col: 'var(--text-muted)' },
    { x: w * 0.5,  text: 'Actions: ← · · →',  col: 'var(--text-muted)' },
    { x: w * 0.85, text: 'Reward: −1/step',    col: 'var(--accent-2)' },
  ];
  labels.forEach(l => {
    g.append('text')
      .attr('x', l.x).attr('y', infoY)
      .attr('text-anchor', 'middle')
      .attr('fill', l.col)
      .style('font-size', '11px')
      .text(l.text);
  });
}

function drawMomentumArrow(g, x1, y1, x2, y2, color) {
  const id = 'mcarrow-' + Math.random().toString(36).substr(2, 6);
  const defs = g.select('defs').empty() ? g.append('defs') : g.select('defs');
  defs.append('marker')
    .attr('id', id)
    .attr('viewBox', '0 0 10 10')
    .attr('refX', 8).attr('refY', 5)
    .attr('markerWidth', 6).attr('markerHeight', 6)
    .attr('orient', 'auto-start-reverse')
    .append('path')
    .attr('d', 'M 0 0 L 10 5 L 0 10 Z')
    .attr('fill', color);

  g.append('line')
    .attr('x1', x1).attr('y1', y1)
    .attr('x2', x2).attr('y2', y2)
    .attr('stroke', color)
    .attr('stroke-width', 2)
    .attr('stroke-dasharray', '6,4')
    .attr('marker-end', `url(#${id})`);
}
