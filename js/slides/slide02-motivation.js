/* ============================================================
   SLIDE 02 — Motivation
   D3 flow diagram: RL Agent → two branches (value-based / policy-based)
   ============================================================ */
import { createSVG, drawBox, drawArrow, cssVar } from '../utils/d3-helpers.js';

export function initSlide02() {
  const container = document.getElementById('chart-motivation');
  if (!container) return;

  const W = 520, H = 380;
  const svg = createSVG(container, W, H);

  // ---- Nodes ----
  const bw = 140, bh = 42;

  // Top: RL Agent
  drawBox(svg, W / 2 - bw / 2, 15, bw, bh, 'RL Agent', { fill: 'var(--bg-card)', stroke: 'var(--accent-1)', strokeWidth: 2, fontWeight: '600' });

  // Left branch — value-based
  const lx = 40;
  drawBox(svg, lx, 100, bw, bh, 'Q-Learning',       { fill: 'var(--accent-1-light)', stroke: 'var(--accent-1)' });
  drawBox(svg, lx, 175, bw, bh, 'Learn Q(s,a)',      {});
  drawBox(svg, lx, 250, bw, bh, 'argmax → action',   {});
  drawBox(svg, lx, 325, bw, bh, 'Derived Policy',    { fill: 'var(--accent-1-light)', stroke: 'var(--accent-1)', fontWeight: '600' });

  // Right branch — policy-based
  const rx = W - bw - 40;
  drawBox(svg, rx, 100, bw, bh, 'Actor-Critic',          { fill: 'var(--accent-2-light)', stroke: 'var(--accent-2)' });
  drawBox(svg, rx, 175, bw, bh, 'Learn π(a|s)',           {});
  drawBox(svg, rx, 250, bw, bh, 'Critic baseline',        {});
  drawBox(svg, rx, 325, bw, bh, 'Direct Policy',          { fill: 'var(--accent-2-light)', stroke: 'var(--accent-2)', fontWeight: '600' });

  // ---- Arrows ----
  const cx = W / 2;
  // Agent → left
  drawArrow(svg, cx - 20, 57, lx + bw / 2, 100, { color: 'var(--accent-1)' });
  // Agent → right
  drawArrow(svg, cx + 20, 57, rx + bw / 2, 100, { color: 'var(--accent-2)' });

  // Left chain
  const lm = lx + bw / 2;
  drawArrow(svg, lm, 142, lm, 175, {});
  drawArrow(svg, lm, 217, lm, 250, {});
  drawArrow(svg, lm, 292, lm, 325, {});

  // Right chain
  const rm = rx + bw / 2;
  drawArrow(svg, rm, 142, rm, 175, {});
  drawArrow(svg, rm, 217, rm, 250, {});
  drawArrow(svg, rm, 292, rm, 325, {});

  // Labels
  svg.append('text')
    .attr('x', lx + bw / 2).attr('y', 88)
    .attr('text-anchor', 'middle')
    .attr('fill', 'var(--accent-1)').style('font-size', '11px').style('font-weight', '600')
    .text('Value-Based');
  svg.append('text')
    .attr('x', rx + bw / 2).attr('y', 88)
    .attr('text-anchor', 'middle')
    .attr('fill', 'var(--accent-2)').style('font-size', '11px').style('font-weight', '600')
    .text('Policy-Based');
}
