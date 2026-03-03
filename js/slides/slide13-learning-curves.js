/* ============================================================
   SLIDE 13 — Learning Curves Comparison (CENTERPIECE)
   Two D3 line charts with confidence bands:
   1. Evaluation Return vs Episodes
   2. Success Rate vs Episodes
   ============================================================ */
import { createSVG, drawXAxis, drawYAxis, drawGrid, drawLegend, cssVar } from '../utils/d3-helpers.js';
import { LEARNING_CURVES } from '../utils/data.js';

export function initSlide13() {
  drawCurveChart(
    '#chart-return-curve',
    LEARNING_CURVES.returnQL,
    LEARNING_CURVES.returnAC,
    'Evaluation Return',
    'Episodes',
    'Return',
    [-200, -80]
  );

  drawCurveChart(
    '#chart-success-curve',
    LEARNING_CURVES.successQL,
    LEARNING_CURVES.successAC,
    'Success Rate',
    'Episodes',
    'Rate',
    [0, 1]
  );
}

function drawCurveChart(selector, dataQL, dataAC, title, xLabel, yLabel, yDomain) {
  const container = document.querySelector(selector);
  if (!container) return;

  const W = 440, H = 340;
  const svg = createSVG(container, W, H);
  const m = { top: 35, right: 20, bottom: 48, left: 55 };
  const w = W - m.left - m.right;
  const h = H - m.top - m.bottom;
  const g = svg.append('g').attr('transform', `translate(${m.left},${m.top})`);

  // Scales
  const xScale = d3.scaleLinear()
    .domain([0, d3.max([...dataQL, ...dataAC], d => d.episode)])
    .range([0, w]);

  const yScale = d3.scaleLinear()
    .domain(yDomain)
    .range([h, 0])
    .nice();

  // Grid + Axes
  drawGrid(g, yScale, w, 5);
  drawXAxis(g, xScale, h, xLabel, 6);
  drawYAxis(g, yScale, yLabel, 5);

  // Title
  svg.append('text')
    .attr('x', m.left + w / 2).attr('y', 18)
    .attr('text-anchor', 'middle')
    .attr('fill', 'var(--text-primary)')
    .style('font-size', '14px')
    .style('font-weight', '600')
    .style('font-family', "'Source Serif 4', serif")
    .text(title);

  // ---- Confidence band + line for Q-Learning ----
  drawBandAndLine(g, dataQL, xScale, yScale, 'var(--accent-1)', 600);

  // ---- Confidence band + line for Actor-Critic ----
  drawBandAndLine(g, dataAC, xScale, yScale, 'var(--accent-2)', 800);

  // Legend
  drawLegend(g,
    [
      { label: 'Q-Learning', color: cssVar('--accent-1') },
      { label: 'Actor-Critic', color: cssVar('--accent-2') },
    ],
    w - 110, 5
  );

  // PLACEHOLDER note
  g.append('text')
    .attr('x', w / 2).attr('y', h + 40)
    .attr('text-anchor', 'middle')
    .attr('fill', 'var(--text-muted)')
    .style('font-size', '9px')
    .style('font-style', 'italic')
    .text('PLACEHOLDER — replace with actual training data');
}

function drawBandAndLine(g, data, xScale, yScale, color, delay) {
  // Confidence band
  const area = d3.area()
    .x(d => xScale(d.episode))
    .y0(d => yScale(d.lower))
    .y1(d => yScale(d.upper))
    .curve(d3.curveBasis);

  g.append('path')
    .datum(data)
    .attr('d', area)
    .attr('fill', color)
    .attr('opacity', 0)
    .transition()
    .delay(delay)
    .duration(600)
    .attr('opacity', 0.15);

  // Mean line
  const line = d3.line()
    .x(d => xScale(d.episode))
    .y(d => yScale(d.mean))
    .curve(d3.curveBasis);

  const path = g.append('path')
    .datum(data)
    .attr('d', line)
    .attr('fill', 'none')
    .attr('stroke', color)
    .attr('stroke-width', 2.5);

  // Animate line drawing
  const totalLength = path.node().getTotalLength();
  path
    .attr('stroke-dasharray', totalLength)
    .attr('stroke-dashoffset', totalLength)
    .transition()
    .delay(delay)
    .duration(1000)
    .ease(d3.easeCubicOut)
    .attr('stroke-dashoffset', 0);
}
