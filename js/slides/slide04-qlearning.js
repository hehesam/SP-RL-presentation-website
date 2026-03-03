/* ============================================================
   SLIDE 04 — Q-Learning Conceptual Pipeline
   state → RBF features → Q-values for 3 actions → argmax → action
   ============================================================ */
import { createSVG, drawBox, drawArrow, cssVar } from '../utils/d3-helpers.js';

export function initSlide04() {
  const container = document.getElementById('chart-qlearning');
  if (!container) return;

  const W = 540, H = 340;
  const svg = createSVG(container, W, H);

  const bw = 110, bh = 42;
  const y0 = 40;           // top row y
  const gap = 30;          // horizontal gap between boxes

  // ---- Pipeline: State → Features → Q-values → argmax ----
  const nodes = [
    { label: 'State s',         x: 20,  fill: 'var(--bg-card)' },
    { label: 'φ(s) RBF',       x: 20 + bw + gap, fill: 'var(--bg-card)' },
    { label: 'Q(s, a)',         x: 20 + 2 * (bw + gap), fill: 'var(--accent-1-light)', stroke: 'var(--accent-1)' },
    { label: 'argmax → a*',    x: 20 + 3 * (bw + gap), fill: 'var(--accent-1-light)', stroke: 'var(--accent-1)' },
  ];

  nodes.forEach(n => {
    drawBox(svg, n.x, y0, bw, bh, n.label, {
      fill: n.fill, stroke: n.stroke || 'var(--border)', fontWeight: '500'
    });
  });

  // Arrows between pipeline nodes
  for (let i = 0; i < nodes.length - 1; i++) {
    drawArrow(svg, nodes[i].x + bw, y0 + bh / 2, nodes[i + 1].x, y0 + bh / 2, {});
  }

  // ---- Q-value bars (3 actions) ----
  const barX = nodes[2].x + 10;
  const barY = y0 + bh + 25;
  const barW = 80, barH = 20, barGap = 6;
  const actions = [
    { label: 'Left  (0)',  val: 0.4, color: 'var(--accent-3)' },
    { label: 'None  (1)',  val: 0.6, color: 'var(--accent-3)' },
    { label: 'Right (2)',  val: 0.85, color: 'var(--accent-1)' },
  ];

  actions.forEach((a, i) => {
    const by = barY + i * (barH + barGap);
    // Background bar
    svg.append('rect')
      .attr('x', barX).attr('y', by)
      .attr('width', barW).attr('height', barH)
      .attr('rx', 4)
      .attr('fill', 'var(--bg-card)')
      .attr('stroke', 'var(--border)')
      .attr('stroke-width', 1);
    // Fill bar
    svg.append('rect')
      .attr('x', barX).attr('y', by)
      .attr('width', barW * a.val).attr('height', barH)
      .attr('rx', 4)
      .attr('fill', a.color)
      .attr('opacity', 0.6);
    // Label
    svg.append('text')
      .attr('x', barX - 8).attr('y', by + barH / 2 + 1)
      .attr('text-anchor', 'end')
      .attr('dominant-baseline', 'central')
      .attr('fill', 'var(--text-muted)')
      .style('font-size', '11px')
      .text(a.label);
  });

  // Bracket arrow from best Q to argmax
  const bestBarY = barY + 2 * (barH + barGap) + barH / 2;
  drawArrow(svg, barX + barW + 8, bestBarY, nodes[3].x + bw / 2, y0 + bh + 5, { color: 'var(--accent-1)', dashed: true });

  // ---- "best action" label ----
  svg.append('text')
    .attr('x', nodes[3].x + bw / 2)
    .attr('y', y0 + bh + 20)
    .attr('text-anchor', 'middle')
    .attr('fill', 'var(--accent-1)')
    .style('font-size', '11px')
    .style('font-style', 'italic')
    .text('greedy action');

  // ---- Update rule box at bottom ----
  const ruleY = barY + 3 * (barH + barGap) + 20;
  const ruleW = W - 40;
  const ruleH = 55;
  svg.append('rect')
    .attr('x', 20).attr('y', ruleY)
    .attr('width', ruleW).attr('height', ruleH)
    .attr('rx', 8)
    .attr('fill', 'var(--bg-card)')
    .attr('stroke', 'var(--border)')
    .attr('stroke-width', 1);
  svg.append('text')
    .attr('x', 30).attr('y', ruleY + 16)
    .attr('fill', 'var(--text-muted)')
    .style('font-size', '11px')
    .style('font-weight', '600')
    .text('Update Rule');
  svg.append('text')
    .attr('x', 30).attr('y', ruleY + 38)
    .attr('fill', 'var(--text-primary)')
    .style('font-size', '12px')
    .style('font-family', "'JetBrains Mono', monospace")
    .text('w ← w + α [ r + γ max Q(s\',a\') − Q(s,a) ] ∇Q(s,a)');
}
