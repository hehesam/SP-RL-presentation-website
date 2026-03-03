/* ============================================================
   SLIDE 05 — Policy Gradient / Actor-Critic Diagram
   state → φ(s) → actor (softmax) + critic (V) → advantage loop
   ============================================================ */
import { createSVG, drawBox, drawArrow, cssVar } from '../utils/d3-helpers.js';

export function initSlide05() {
  const container = document.getElementById('chart-actorcritic');
  if (!container) return;

  const W = 540, H = 400;
  const svg = createSVG(container, W, H);

  const bw = 120, bh = 40;

  // ---- State input ----
  drawBox(svg, 30, 30, 100, bh, 'State s', { fontWeight: '500' });

  // ---- Feature map ----
  drawBox(svg, 30, 110, 100, bh, 'φ(s) RBF', {});

  // Arrow: state → features
  drawArrow(svg, 80, 70, 80, 110, {});

  // ---- Branch label ----
  // Split into Actor and Critic

  // ---- ACTOR BRANCH (left) ----
  const ax = 20;
  drawBox(svg, ax, 195, bw, bh, 'Actor θᵀφ(s)', { fill: 'var(--accent-2-light)', stroke: 'var(--accent-2)' });
  drawBox(svg, ax, 270, bw, bh, 'Softmax π(a|s)', { fill: 'var(--accent-2-light)', stroke: 'var(--accent-2)' });
  drawBox(svg, ax, 345, bw, bh, 'Action a', { fill: 'var(--accent-2-light)', stroke: 'var(--accent-2)', fontWeight: '600' });

  // Actor arrows
  drawArrow(svg, 80, 150, ax + bw / 2, 195, { color: 'var(--accent-2)' });
  drawArrow(svg, ax + bw / 2, 235, ax + bw / 2, 270, {});
  drawArrow(svg, ax + bw / 2, 310, ax + bw / 2, 345, {});

  // ---- CRITIC BRANCH (right) ----
  const cx = W - bw - 20;
  drawBox(svg, cx, 195, bw, bh, 'Critic wᵀφ(s)', { fill: 'var(--accent-1-light)', stroke: 'var(--accent-1)' });
  drawBox(svg, cx, 270, bw, bh, 'V(s)', { fill: 'var(--accent-1-light)', stroke: 'var(--accent-1)' });

  // Critic arrows
  drawArrow(svg, 80, 150, cx + bw / 2, 195, { color: 'var(--accent-1)' });
  drawArrow(svg, cx + bw / 2, 235, cx + bw / 2, 270, {});

  // ---- ADVANTAGE NODE (center) ----
  const advX = W / 2 - 55;
  const advY = 270;
  drawBox(svg, advX, advY, 110, bh, ['TD Advantage', 'δ = r+γV(s\')−V(s)'], {
    fill: 'var(--accent-3)', stroke: 'var(--accent-3)',
    textColor: '#1A1A2E', fontSize: '11px', fontWeight: '600', rx: 20
  });

  // Critic → Advantage
  drawArrow(svg, cx, advY + bh / 2, advX + 110, advY + bh / 2, { color: 'var(--accent-1)', dashed: true });

  // Advantage → Actor (feedback)
  drawArrow(svg, advX, advY + bh / 2, ax + bw, advY + bh / 2, { color: 'var(--accent-3)', dashed: true });

  // ---- Branch labels ----
  svg.append('text')
    .attr('x', ax + bw / 2).attr('y', 185)
    .attr('text-anchor', 'middle')
    .attr('fill', 'var(--accent-2)')
    .style('font-size', '11px').style('font-weight', '600')
    .text('ACTOR');

  svg.append('text')
    .attr('x', cx + bw / 2).attr('y', 185)
    .attr('text-anchor', 'middle')
    .attr('fill', 'var(--accent-1)')
    .style('font-size', '11px').style('font-weight', '600')
    .text('CRITIC');

  // ---- Feedback label ----
  svg.append('text')
    .attr('x', W / 2).attr('y', advY - 8)
    .attr('text-anchor', 'middle')
    .attr('fill', 'var(--accent-3)')
    .style('font-size', '10px').style('font-style', 'italic')
    .text('advantage signal');
}
