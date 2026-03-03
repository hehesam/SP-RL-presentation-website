/* ============================================================
   SLIDE 08 — Experimental Roadmap
   Horizontal D3 timeline: 5 connected nodes
   ============================================================ */
import { createSVG, drawBox, drawArrow, cssVar } from '../utils/d3-helpers.js';

export function initSlide08() {
  const container = document.getElementById('chart-roadmap');
  if (!container) return;

  const W = 960, H = 220;
  const svg = createSVG(container, W, H);

  const steps = [
    { label: 'Experimental\nSetup',     icon: '⚙', color: 'var(--text-secondary)' },
    { label: 'Build RBF\nFeature Map',  icon: '🔢', color: 'var(--accent-3)' },
    { label: 'Implement\nQ-Learning',   icon: '📈', color: 'var(--accent-1)' },
    { label: 'Implement\nActor-Critic', icon: '🎭', color: 'var(--accent-2)' },
    { label: 'Compare\nFairly',         icon: '⚖', color: 'var(--text-secondary)' },
  ];

  const nodeW = 130, nodeH = 60;
  const totalW = steps.length * nodeW + (steps.length - 1) * 50;
  const startX = (W - totalW) / 2;
  const y = 60;

  steps.forEach((step, i) => {
    const x = startX + i * (nodeW + 50);

    // Connecting line (except last)
    if (i < steps.length - 1) {
      const lineY = y + nodeH / 2;
      const arrowId = 'road-arr-' + i;
      const defs = svg.select('defs').empty() ? svg.append('defs') : svg.select('defs');
      defs.append('marker')
        .attr('id', arrowId)
        .attr('viewBox', '0 0 10 10')
        .attr('refX', 8).attr('refY', 5)
        .attr('markerWidth', 6).attr('markerHeight', 6)
        .attr('orient', 'auto-start-reverse')
        .append('path')
        .attr('d', 'M 0 0 L 10 5 L 0 10 Z')
        .attr('fill', 'var(--svg-grid)');

      svg.append('line')
        .attr('x1', x + nodeW).attr('y1', lineY)
        .attr('x2', x + nodeW + 50).attr('y2', lineY)
        .attr('stroke', 'var(--svg-grid)')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '6,4')
        .attr('marker-end', `url(#${arrowId})`)
        .attr('opacity', 0)
        .transition()
        .delay(200 + i * 150)
        .duration(400)
        .attr('opacity', 1);
    }

    // Node box
    const boxG = svg.append('g')
      .attr('opacity', 0)
      .attr('transform', `translate(${x},${y})`);

    boxG.transition()
      .delay(100 + i * 150)
      .duration(500)
      .attr('opacity', 1);

    boxG.append('rect')
      .attr('width', nodeW).attr('height', nodeH)
      .attr('rx', 10)
      .attr('fill', 'var(--bg-card)')
      .attr('stroke', step.color)
      .attr('stroke-width', 2);

    // Icon
    boxG.append('text')
      .attr('x', nodeW / 2).attr('y', 22)
      .attr('text-anchor', 'middle')
      .style('font-size', '18px')
      .text(step.icon);

    // Label (multiline)
    const lines = step.label.split('\n');
    lines.forEach((line, li) => {
      boxG.append('text')
        .attr('x', nodeW / 2)
        .attr('y', 40 + li * 14)
        .attr('text-anchor', 'middle')
        .attr('fill', 'var(--text-primary)')
        .style('font-size', '11.5px')
        .style('font-weight', '500')
        .style('font-family', "'Inter', sans-serif")
        .text(line);
    });

    // Step number
    boxG.append('text')
      .attr('x', nodeW / 2).attr('y', nodeH + 22)
      .attr('text-anchor', 'middle')
      .attr('fill', 'var(--text-muted)')
      .style('font-size', '12px')
      .style('font-weight', '600')
      .text(`Step ${i + 1}`);
  });
}
