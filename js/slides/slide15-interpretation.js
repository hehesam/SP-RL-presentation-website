/* ============================================================
   SLIDE 15 — Interpretation
   Horizontal bar comparison: 4 dimensions × 2 methods
   ============================================================ */
import { createSVG, drawLegend, cssVar } from '../utils/d3-helpers.js';
import { COMPARISON_SCORES } from '../utils/data.js';

export function initSlide15() {
  const container = document.getElementById('chart-interpretation');
  if (!container) return;

  const W = 480, H = 380;
  const svg = createSVG(container, W, H);
  const m = { top: 30, right: 20, bottom: 30, left: 120 };
  const w = W - m.left - m.right;
  const h = H - m.top - m.bottom;
  const g = svg.append('g').attr('transform', `translate(${m.left},${m.top})`);

  const dims = COMPARISON_SCORES.dimensions;
  const ql = COMPARISON_SCORES.qlearning;
  const ac = COMPARISON_SCORES.actorcritic;

  const barH = 14;
  const groupGap = h / dims.length;
  const barGap = 4;
  const maxBarW = w;
  const xScale = d3.scaleLinear().domain([0, 1]).range([0, maxBarW]);

  dims.forEach((dim, i) => {
    const gy = i * groupGap + groupGap * 0.2;

    // Dimension label (may have \n)
    const lines = dim.split('\n');
    lines.forEach((line, li) => {
      g.append('text')
        .attr('x', -10)
        .attr('y', gy + (barH + barGap) / 2 + barH / 2 + li * 14 - (lines.length - 1) * 7)
        .attr('text-anchor', 'end')
        .attr('dominant-baseline', 'central')
        .attr('fill', 'var(--text-primary)')
        .style('font-size', '12px')
        .style('font-weight', '500')
        .text(line);
    });

    // Q-Learning bar (top)
    g.append('rect')
      .attr('x', 0).attr('y', gy)
      .attr('width', 0).attr('height', barH)
      .attr('rx', 4)
      .attr('fill', 'var(--accent-1)')
      .attr('opacity', 0.75)
      .transition()
      .delay(300 + i * 150)
      .duration(700)
      .ease(d3.easeCubicOut)
      .attr('width', xScale(ql[i]));

    // Q-Learning score
    g.append('text')
      .attr('x', xScale(ql[i]) + 6).attr('y', gy + barH / 2 + 1)
      .attr('dominant-baseline', 'central')
      .attr('fill', 'var(--accent-1)')
      .style('font-size', '11px')
      .style('font-weight', '600')
      .style('font-family', "'JetBrains Mono', monospace")
      .attr('opacity', 0)
      .transition()
      .delay(600 + i * 150)
      .duration(400)
      .attr('opacity', 1)
      .text((ql[i] * 100).toFixed(0));

    // Actor-Critic bar (bottom)
    g.append('rect')
      .attr('x', 0).attr('y', gy + barH + barGap)
      .attr('width', 0).attr('height', barH)
      .attr('rx', 4)
      .attr('fill', 'var(--accent-2)')
      .attr('opacity', 0.75)
      .transition()
      .delay(400 + i * 150)
      .duration(700)
      .ease(d3.easeCubicOut)
      .attr('width', xScale(ac[i]));

    // AC score
    g.append('text')
      .attr('x', xScale(ac[i]) + 6).attr('y', gy + barH + barGap + barH / 2 + 1)
      .attr('dominant-baseline', 'central')
      .attr('fill', 'var(--accent-2)')
      .style('font-size', '11px')
      .style('font-weight', '600')
      .style('font-family', "'JetBrains Mono', monospace")
      .attr('opacity', 0)
      .transition()
      .delay(700 + i * 150)
      .duration(400)
      .attr('opacity', 1)
      .text((ac[i] * 100).toFixed(0));
  });

  // Scale marks
  [0, 0.5, 1].forEach(v => {
    g.append('line')
      .attr('x1', xScale(v)).attr('y1', -5)
      .attr('x2', xScale(v)).attr('y2', h)
      .attr('stroke', 'var(--svg-grid)')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '3,4')
      .attr('opacity', 0.5);
    g.append('text')
      .attr('x', xScale(v)).attr('y', -10)
      .attr('text-anchor', 'middle')
      .attr('fill', 'var(--text-muted)')
      .style('font-size', '10px')
      .text((v * 100).toFixed(0));
  });

  // Legend
  drawLegend(svg,
    [
      { label: 'Q-Learning', color: cssVar('--accent-1') },
      { label: 'Actor-Critic', color: cssVar('--accent-2') },
    ],
    W - 140, 8
  );

  // PLACEHOLDER note
  svg.append('text')
    .attr('x', W / 2).attr('y', H - 8)
    .attr('text-anchor', 'middle')
    .attr('fill', 'var(--text-muted)')
    .style('font-size', '9px')
    .style('font-style', 'italic')
    .text('PLACEHOLDER scores — replace with final assessment');
}
