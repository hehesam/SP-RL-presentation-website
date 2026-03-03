/* ============================================================
   SLIDE 10 — Q-Learning Implementation Details
   Layered architecture: State → RBF → Weights → Q-values → ε-greedy
   ============================================================ */
import { createSVG, drawBox, drawArrow, cssVar } from '../utils/d3-helpers.js';

export function initSlide10() {
  const container = document.getElementById('chart-qlearning-impl');
  if (!container) return;

  const W = 520, H = 420;
  const svg = createSVG(container, W, H);

  const bw = 130, bh = 38;
  const cx = W / 2 - bw / 2;  // center x for boxes

  // ---- Layered pipeline (top to bottom) ----
  const layers = [
    { y: 15,  label: 'State s',                 fill: 'var(--bg-card)' },
    { y: 75,  label: 'RBF Features φ(s)',        fill: 'var(--bg-card)' },
    { y: 135, label: 'Linear Weights (×3)',       fill: 'var(--accent-1-light)', stroke: 'var(--accent-1)' },
    { y: 195, label: 'Q(s,a₀)  Q(s,a₁)  Q(s,a₂)', fill: 'var(--accent-1-light)', stroke: 'var(--accent-1)' },
    { y: 265, label: 'ε-greedy Selection',        fill: 'var(--accent-3)', stroke: 'var(--accent-3)', textColor: '#1A1A2E' },
  ];

  layers.forEach(l => {
    drawBox(svg, cx, l.y, bw, bh, l.label, {
      fill: l.fill, stroke: l.stroke || 'var(--border)',
      textColor: l.textColor, fontSize: '12px', fontWeight: '500'
    });
  });

  // Arrows between layers
  for (let i = 0; i < layers.length - 1; i++) {
    drawArrow(svg, cx + bw / 2, layers[i].y + bh, cx + bw / 2, layers[i + 1].y, {});
  }

  // ---- Weight detail: 3 columns for 3 actions ----
  const colW = 35, colH = 25, colY = 140;
  const colStartX = cx + bw + 20;
  ['w₀', 'w₁', 'w₂'].forEach((label, i) => {
    const x = colStartX + i * (colW + 6);
    svg.append('rect')
      .attr('x', x).attr('y', colY)
      .attr('width', colW).attr('height', colH)
      .attr('rx', 4)
      .attr('fill', i === 2 ? 'var(--accent-1)' : 'var(--bg-card)')
      .attr('stroke', 'var(--border)')
      .attr('stroke-width', 1)
      .attr('opacity', i === 2 ? 0.6 : 1);
    svg.append('text')
      .attr('x', x + colW / 2).attr('y', colY + colH / 2 + 1)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('fill', 'var(--text-muted)')
      .style('font-size', '11px')
      .style('font-family', "'JetBrains Mono', monospace")
      .text(label);
  });
  // Label
  svg.append('text')
    .attr('x', colStartX + (3 * colW + 12) / 2).attr('y', colY - 8)
    .attr('text-anchor', 'middle')
    .attr('fill', 'var(--text-muted)')
    .style('font-size', '10px')
    .text('one per action');

  // ---- ε-greedy annotation ----
  const epsY = layers[4].y + bh + 10;
  svg.append('text')
    .attr('x', cx + bw / 2).attr('y', epsY + 5)
    .attr('text-anchor', 'middle')
    .attr('fill', 'var(--text-muted)')
    .style('font-size', '11px')
    .style('font-style', 'italic')
    .text('prob ε: random · prob 1−ε: greedy');

  // ---- "Deadly Triad" warning box (side annotation) ----
  const warnX = 10, warnY = 330;
  const warnW = W - 20, warnH = 60;
  svg.append('rect')
    .attr('x', warnX).attr('y', warnY)
    .attr('width', warnW).attr('height', warnH)
    .attr('rx', 8)
    .attr('fill', 'var(--accent-2-light)')
    .attr('stroke', 'var(--accent-2)')
    .attr('stroke-width', 1.5)
    .attr('stroke-dasharray', '6,4');

  svg.append('text')
    .attr('x', warnX + 14).attr('y', warnY + 20)
    .attr('fill', 'var(--accent-2)')
    .style('font-size', '12px')
    .style('font-weight', '600')
    .text('⚠ Deadly Triad');

  svg.append('text')
    .attr('x', warnX + 14).attr('y', warnY + 40)
    .attr('fill', 'var(--text-muted)')
    .style('font-size', '11px')
    .text('Bootstrapping + Off-policy + Function approximation → potential instability');
}
