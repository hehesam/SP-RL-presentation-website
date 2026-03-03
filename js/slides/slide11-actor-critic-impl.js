/* ============================================================
   SLIDE 11 — Actor-Critic Implementation Details
   Parallel-branch architecture: actor + critic → advantage
   ============================================================ */
import { createSVG, drawBox, drawArrow, cssVar } from '../utils/d3-helpers.js';

export function initSlide11() {
  const container = document.getElementById('chart-ac-impl');
  if (!container) return;

  const W = 540, H = 430;
  const svg = createSVG(container, W, H);

  const bw = 120, bh = 38;
  const midX = W / 2;

  // ---- Shared layers ----
  drawBox(svg, midX - 55, 10, 110, bh, 'State s', { fontWeight: '500' });
  drawBox(svg, midX - 65, 75, 130, bh, 'Shared φ(s) RBF', { fontWeight: '500' });
  drawArrow(svg, midX, 48, midX, 75, {});

  // ---- ACTOR branch (left) ----
  const ax = 30;
  const actorColor = 'var(--accent-2)';
  drawBox(svg, ax, 150, bw, bh, 'Actor Weights θ', { fill: 'var(--accent-2-light)', stroke: actorColor });
  drawBox(svg, ax, 215, bw, bh, 'Softmax', { fill: 'var(--accent-2-light)', stroke: actorColor });
  drawBox(svg, ax, 280, bw, bh, 'π(a|s)', { fill: 'var(--accent-2-light)', stroke: actorColor, fontWeight: '600' });

  // Actor arrows
  drawArrow(svg, midX - 20, 113, ax + bw / 2, 150, { color: actorColor });
  drawArrow(svg, ax + bw / 2, 188, ax + bw / 2, 215, {});
  drawArrow(svg, ax + bw / 2, 253, ax + bw / 2, 280, {});

  // ---- CRITIC branch (right) ----
  const cx = W - bw - 30;
  const criticColor = 'var(--accent-1)';
  drawBox(svg, cx, 150, bw, bh, 'Critic Weights w', { fill: 'var(--accent-1-light)', stroke: criticColor });
  drawBox(svg, cx, 215, bw, bh, 'Linear V(s)', { fill: 'var(--accent-1-light)', stroke: criticColor });

  // Critic arrows
  drawArrow(svg, midX + 20, 113, cx + bw / 2, 150, { color: criticColor });
  drawArrow(svg, cx + bw / 2, 188, cx + bw / 2, 215, {});

  // ---- Advantage node (center bottom) ----
  const advW = 150, advH = 42;
  const advX = midX - advW / 2;
  const advY = 280;
  drawBox(svg, advX, advY, advW, advH, ['TD Advantage', 'δ = r + γV(s\') − V(s)'], {
    fill: 'var(--accent-3)', stroke: 'var(--accent-3)',
    textColor: '#1A1A2E', fontSize: '11px', fontWeight: '600', rx: 20
  });

  // Critic → Advantage
  drawArrow(svg, cx + bw / 2, 253, advX + advW, advY + advH / 2, { color: criticColor, dashed: true });

  // ---- Update annotations ----
  // Actor update
  const updateY = 345;
  const actUpdateW = W / 2 - 20, actUpdateH = 50;
  svg.append('rect')
    .attr('x', 10).attr('y', updateY)
    .attr('width', actUpdateW).attr('height', actUpdateH)
    .attr('rx', 8)
    .attr('fill', 'var(--accent-2-light)')
    .attr('stroke', 'var(--accent-2)')
    .attr('stroke-width', 1);

  svg.append('text')
    .attr('x', 20).attr('y', updateY + 17)
    .attr('fill', 'var(--accent-2)')
    .style('font-size', '11px').style('font-weight', '600')
    .text('Actor Update');
  svg.append('text')
    .attr('x', 20).attr('y', updateY + 36)
    .attr('fill', 'var(--text-primary)')
    .style('font-size', '11px')
    .style('font-family', "'JetBrains Mono', monospace")
    .text('θ ← θ + αθ · δ · ∇ln π(a|s)');

  // Advantage → Actor update
  drawArrow(svg, advX, advY + advH, 10 + actUpdateW / 2, updateY, { color: 'var(--accent-3)', dashed: true });

  // Critic update
  const critUpdateX = W / 2 + 10;
  svg.append('rect')
    .attr('x', critUpdateX).attr('y', updateY)
    .attr('width', actUpdateW).attr('height', actUpdateH)
    .attr('rx', 8)
    .attr('fill', 'var(--accent-1-light)')
    .attr('stroke', 'var(--accent-1)')
    .attr('stroke-width', 1);

  svg.append('text')
    .attr('x', critUpdateX + 10).attr('y', updateY + 17)
    .attr('fill', 'var(--accent-1)')
    .style('font-size', '11px').style('font-weight', '600')
    .text('Critic Update');
  svg.append('text')
    .attr('x', critUpdateX + 10).attr('y', updateY + 36)
    .attr('fill', 'var(--text-primary)')
    .style('font-size', '11px')
    .style('font-family', "'JetBrains Mono', monospace")
    .text('w ← w + αw · δ · ∇V(s)');

  // Advantage → Critic update
  drawArrow(svg, advX + advW, advY + advH, critUpdateX + actUpdateW / 2, updateY, { color: 'var(--accent-3)', dashed: true });

  // ---- Branch labels ----
  svg.append('text')
    .attr('x', ax + bw / 2).attr('y', 142)
    .attr('text-anchor', 'middle')
    .attr('fill', actorColor)
    .style('font-size', '11px').style('font-weight', '600')
    .text('ACTOR');

  svg.append('text')
    .attr('x', cx + bw / 2).attr('y', 142)
    .attr('text-anchor', 'middle')
    .attr('fill', criticColor)
    .style('font-size', '11px').style('font-weight', '600')
    .text('CRITIC');
}
