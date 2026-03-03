/* ============================================================
   SLIDE 14 — Final Results Summary
   Grouped bar chart: 3 metrics × 2 methods
   ============================================================ */
import { createSVG, drawXAxis, drawYAxis, drawGrid, drawLegend, cssVar } from '../utils/d3-helpers.js';
import { FINAL_RESULTS } from '../utils/data.js';

export function initSlide14() {
  const container = document.getElementById('chart-final-results');
  if (!container) return;

  const W = 640, H = 360;
  const svg = createSVG(container, W, H);
  const m = { top: 30, right: 30, bottom: 55, left: 60 };
  const w = W - m.left - m.right;
  const h = H - m.top - m.bottom;
  const g = svg.append('g').attr('transform', `translate(${m.left},${m.top})`);

  // We need to normalize metrics to comparable scale for grouped bars
  // Approach: 3 separate grouped bar clusters
  const metrics = FINAL_RESULTS;

  // For each metric, determine a suitable max for its scale
  // We'll draw 3 sub-charts horizontally within one SVG
  const clusterW = w / metrics.length;
  const barW = clusterW * 0.3;
  const gapBetweenBars = 8;

  metrics.forEach((metric, mi) => {
    const cx = mi * clusterW + clusterW / 2;

    // Determine scale for this metric
    const maxVal = Math.max(
      Math.abs(metric.qlearning),
      Math.abs(metric.actorcritic)
    ) * 1.2;

    const isRate = metric.metric === 'Success Rate';
    const scaleMax = isRate ? 1 : maxVal;

    const yScale = d3.scaleLinear()
      .domain([0, scaleMax])
      .range([0, h * 0.7]);

    // Q-Learning bar
    const qlVal = Math.abs(metric.qlearning);
    const qlBarH = yScale(qlVal);
    g.append('rect')
      .attr('x', cx - barW - gapBetweenBars / 2)
      .attr('y', h)
      .attr('width', barW)
      .attr('height', 0)
      .attr('rx', 4)
      .attr('fill', 'var(--accent-1)')
      .attr('opacity', 0.8)
      .transition()
      .delay(300 + mi * 200)
      .duration(700)
      .ease(d3.easeCubicOut)
      .attr('y', h - qlBarH)
      .attr('height', qlBarH);

    // Q-Learning value label
    g.append('text')
      .attr('x', cx - barW / 2 - gapBetweenBars / 2)
      .attr('y', h - qlBarH - 8)
      .attr('text-anchor', 'middle')
      .attr('fill', 'var(--accent-1)')
      .style('font-size', '12px')
      .style('font-weight', '600')
      .style('font-family', "'JetBrains Mono', monospace")
      .attr('opacity', 0)
      .transition()
      .delay(600 + mi * 200)
      .duration(400)
      .attr('opacity', 1)
      .text(isRate ? (metric.qlearning * 100).toFixed(0) + '%' : metric.qlearning);

    // Actor-Critic bar
    const acVal = Math.abs(metric.actorcritic);
    const acBarH = yScale(acVal);
    g.append('rect')
      .attr('x', cx + gapBetweenBars / 2)
      .attr('y', h)
      .attr('width', barW)
      .attr('height', 0)
      .attr('rx', 4)
      .attr('fill', 'var(--accent-2)')
      .attr('opacity', 0.8)
      .transition()
      .delay(400 + mi * 200)
      .duration(700)
      .ease(d3.easeCubicOut)
      .attr('y', h - acBarH)
      .attr('height', acBarH);

    // Actor-Critic value label
    g.append('text')
      .attr('x', cx + barW / 2 + gapBetweenBars / 2)
      .attr('y', h - acBarH - 8)
      .attr('text-anchor', 'middle')
      .attr('fill', 'var(--accent-2)')
      .style('font-size', '12px')
      .style('font-weight', '600')
      .style('font-family', "'JetBrains Mono', monospace")
      .attr('opacity', 0)
      .transition()
      .delay(700 + mi * 200)
      .duration(400)
      .attr('opacity', 1)
      .text(isRate ? (metric.actorcritic * 100).toFixed(0) + '%' : metric.actorcritic);

    // Metric label
    g.append('text')
      .attr('x', cx)
      .attr('y', h + 20)
      .attr('text-anchor', 'middle')
      .attr('fill', 'var(--text-primary)')
      .style('font-size', '12px')
      .style('font-weight', '500')
      .text(metric.metric);
  });

  // Baseline line
  g.append('line')
    .attr('x1', 0).attr('y1', h)
    .attr('x2', w).attr('y2', h)
    .attr('stroke', 'var(--svg-grid)')
    .attr('stroke-width', 1);

  // Legend
  drawLegend(svg,
    [
      { label: 'Q-Learning', color: cssVar('--accent-1') },
      { label: 'Actor-Critic', color: cssVar('--accent-2') },
    ],
    W - 140, 12
  );

  // PLACEHOLDER note
  g.append('text')
    .attr('x', w / 2).attr('y', h + 42)
    .attr('text-anchor', 'middle')
    .attr('fill', 'var(--text-muted)')
    .style('font-size', '9px')
    .style('font-style', 'italic')
    .text('PLACEHOLDER — replace with actual final results');
}
