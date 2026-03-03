/* ============================================================
   SLIDE 12 — Hyperparameter Tuning & Fairness
   Two side-by-side D3 heatmaps with placeholder data
   ============================================================ */
import { createSVG, cssVar } from '../utils/d3-helpers.js';
import { HEATMAP_QLEARNING, HEATMAP_ACTOR_CRITIC } from '../utils/data.js';

export function initSlide12() {
  const container = document.getElementById('chart-hyperparams');
  if (!container) return;

  const W = 560, H = 400;
  const svg = createSVG(container, W, H);

  // Draw two heatmaps side by side
  drawHeatmap(svg, HEATMAP_QLEARNING,    15, 30, 240, 300, 'Q-Learning', 'var(--accent-1)');
  drawHeatmap(svg, HEATMAP_ACTOR_CRITIC, 290, 30, 240, 300, 'Actor-Critic', 'var(--accent-2)');

  // PLACEHOLDER watermark
  svg.append('text')
    .attr('x', W / 2).attr('y', H - 15)
    .attr('text-anchor', 'middle')
    .attr('fill', 'var(--text-muted)')
    .style('font-size', '11px')
    .style('font-style', 'italic')
    .text('PLACEHOLDER DATA — replace with actual grid search results');
}

function drawHeatmap(svg, data, ox, oy, w, h, title, accentColor) {
  const g = svg.append('g').attr('transform', `translate(${ox},${oy})`);
  const rows = data.values.length;
  const cols = data.values[0].length;
  const margin = { top: 40, right: 10, bottom: 40, left: 55 };
  const plotW = w - margin.left - margin.right;
  const plotH = h - margin.top - margin.bottom;
  const cellW = plotW / cols;
  const cellH = plotH / rows;

  const pg = g.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

  // Title
  g.append('text')
    .attr('x', w / 2).attr('y', 15)
    .attr('text-anchor', 'middle')
    .attr('fill', accentColor)
    .style('font-size', '13px')
    .style('font-weight', '600')
    .text(title);

  // Color scale
  const allVals = data.values.flat();
  const vMin = d3.min(allVals);
  const vMax = d3.max(allVals);
  const colorScale = d3.scaleSequential()
    .domain([vMin, vMax])
    .interpolator(d3.interpolateRgb('#E07A5F', '#2EC4B6'));

  // Cells
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const val = data.values[r][c];
      pg.append('rect')
        .attr('x', c * cellW).attr('y', r * cellH)
        .attr('width', cellW - 2).attr('height', cellH - 2)
        .attr('rx', 4)
        .attr('fill', colorScale(val))
        .attr('opacity', 0)
        .transition()
        .delay((r * cols + c) * 30)
        .duration(400)
        .attr('opacity', 0.85);

      // Value text
      pg.append('text')
        .attr('x', c * cellW + cellW / 2 - 1)
        .attr('y', r * cellH + cellH / 2)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'central')
        .attr('fill', val > (vMin + vMax) / 2 ? '#1A1A2E' : '#F0F0F5')
        .style('font-size', '10px')
        .style('font-weight', '600')
        .style('font-family', "'JetBrains Mono', monospace")
        .text(val);
    }
  }

  // Row labels
  data.rowLabels.forEach((label, r) => {
    pg.append('text')
      .attr('x', -6).attr('y', r * cellH + cellH / 2)
      .attr('text-anchor', 'end')
      .attr('dominant-baseline', 'central')
      .attr('fill', 'var(--text-muted)')
      .style('font-size', '10px')
      .text(label);
  });

  // Col labels
  data.colLabels.forEach((label, c) => {
    pg.append('text')
      .attr('x', c * cellW + cellW / 2 - 1)
      .attr('y', plotH + 14)
      .attr('text-anchor', 'middle')
      .attr('fill', 'var(--text-muted)')
      .style('font-size', '10px')
      .text(label);
  });
}
