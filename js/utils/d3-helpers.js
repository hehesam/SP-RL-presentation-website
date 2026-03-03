/* ============================================================
   D3-HELPERS — Shared utilities for all slide visualizations
   ============================================================ */

/**
 * Create a responsive SVG inside `container` with the given viewBox dimensions.
 * Returns the d3 selection of the <svg>.
 */
export function createSVG(container, width, height) {
  const svg = d3.select(container)
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .style('width', '100%')
    .style('height', '100%');
  return svg;
}

/**
 * Read a CSS custom property from :root.
 */
export function cssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/**
 * Standard academic color palette accessors.
 */
export const COLORS = {
  get accent1() { return cssVar('--accent-1'); },
  get accent2() { return cssVar('--accent-2'); },
  get accent3() { return cssVar('--accent-3'); },
  get text()    { return cssVar('--text-primary'); },
  get textSec() { return cssVar('--text-secondary'); },
  get muted()   { return cssVar('--text-muted'); },
  get bg()      { return cssVar('--bg-card'); },
  get border()  { return cssVar('--border'); },
  get grid()    { return cssVar('--svg-grid'); },
};

/**
 * Standard D3 transition preset.
 */
export function stdTransition(sel) {
  return sel.transition().duration(600).ease(d3.easeCubicOut);
}

/**
 * Draw labeled X axis.
 */
export function drawXAxis(g, scale, height, label, tickCount = 5) {
  const axis = g.append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(scale).ticks(tickCount));
  styleAxis(axis);
  if (label) {
    g.append('text')
      .attr('x', scale.range()[1] / 2 + scale.range()[0] / 2)
      .attr('y', height + 38)
      .attr('text-anchor', 'middle')
      .attr('fill', cssVar('--text-muted'))
      .style('font-size', '12px')
      .text(label);
  }
  return axis;
}

/**
 * Draw labeled Y axis.
 */
export function drawYAxis(g, scale, label, tickCount = 5) {
  const axis = g.append('g')
    .call(d3.axisLeft(scale).ticks(tickCount));
  styleAxis(axis);
  if (label) {
    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -(scale.range()[0] + scale.range()[1]) / 2)
      .attr('y', -42)
      .attr('text-anchor', 'middle')
      .attr('fill', cssVar('--text-muted'))
      .style('font-size', '12px')
      .text(label);
  }
  return axis;
}

/**
 * Style axis to match theme.
 */
function styleAxis(axisSel) {
  axisSel.selectAll('line').attr('stroke', cssVar('--svg-grid'));
  axisSel.selectAll('path').attr('stroke', cssVar('--svg-grid'));
  axisSel.selectAll('text')
    .attr('fill', cssVar('--text-muted'))
    .style('font-size', '11px')
    .style('font-family', "'Inter', sans-serif");
}

/**
 * Add light horizontal grid lines.
 */
export function drawGrid(g, yScale, width, tickCount = 5) {
  g.append('g')
    .attr('class', 'grid-lines')
    .call(d3.axisLeft(yScale).ticks(tickCount).tickSize(-width).tickFormat(''))
    .selectAll('line')
    .attr('stroke', cssVar('--svg-grid'))
    .attr('stroke-opacity', 0.5)
    .attr('stroke-dasharray', '2,3');
  g.select('.grid-lines .domain').remove();
}

/**
 * Draw a simple legend.
 * items: [{ label, color }]
 */
export function drawLegend(g, items, x, y) {
  const legend = g.append('g').attr('transform', `translate(${x},${y})`);
  items.forEach((item, i) => {
    const row = legend.append('g').attr('transform', `translate(0,${i * 20})`);
    row.append('rect')
      .attr('width', 14).attr('height', 14).attr('rx', 3)
      .attr('fill', item.color);
    row.append('text')
      .attr('x', 20).attr('y', 11)
      .attr('fill', cssVar('--text-muted'))
      .style('font-size', '12px')
      .style('font-family', "'Inter', sans-serif")
      .text(item.label);
  });
  return legend;
}

/**
 * Create a rounded-rect box node for pipeline diagrams.
 * Returns the group <g>.
 */
export function drawBox(parent, x, y, w, h, label, opts = {}) {
  const g = parent.append('g').attr('transform', `translate(${x},${y})`);
  g.append('rect')
    .attr('width', w).attr('height', h)
    .attr('rx', opts.rx || 8)
    .attr('fill', opts.fill || cssVar('--bg-card'))
    .attr('stroke', opts.stroke || cssVar('--border'))
    .attr('stroke-width', opts.strokeWidth || 1.5);
  // Multiline label support
  const lines = Array.isArray(label) ? label : [label];
  const lineHeight = 16;
  const startY = h / 2 - ((lines.length - 1) * lineHeight) / 2;
  lines.forEach((line, i) => {
    g.append('text')
      .attr('x', w / 2).attr('y', startY + i * lineHeight)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('fill', opts.textColor || cssVar('--text-primary'))
      .style('font-size', opts.fontSize || '13px')
      .style('font-family', "'Inter', sans-serif")
      .style('font-weight', opts.fontWeight || '500')
      .text(line);
  });
  return g;
}

/**
 * Draw an arrow line between two points.
 */
export function drawArrow(parent, x1, y1, x2, y2, opts = {}) {
  const id = 'arrowhead-' + Math.random().toString(36).substr(2, 6);
  const defs = parent.select('defs').empty()
    ? parent.append('defs')
    : parent.select('defs');
  defs.append('marker')
    .attr('id', id)
    .attr('viewBox', '0 0 10 10')
    .attr('refX', 8).attr('refY', 5)
    .attr('markerWidth', 6).attr('markerHeight', 6)
    .attr('orient', 'auto-start-reverse')
    .append('path')
    .attr('d', 'M 0 0 L 10 5 L 0 10 Z')
    .attr('fill', opts.color || cssVar('--text-muted'));

  parent.append('line')
    .attr('x1', x1).attr('y1', y1)
    .attr('x2', x2).attr('y2', y2)
    .attr('stroke', opts.color || cssVar('--text-muted'))
    .attr('stroke-width', opts.width || 1.5)
    .attr('marker-end', `url(#${id})`)
    .attr('stroke-dasharray', opts.dashed ? '5,4' : null);
}

/**
 * Draw a curved arrow (elbow / bezier) between two points.
 */
export function drawCurvedArrow(parent, x1, y1, x2, y2, opts = {}) {
  const id = 'arrowhead-' + Math.random().toString(36).substr(2, 6);
  const defs = parent.select('defs').empty()
    ? parent.append('defs')
    : parent.select('defs');
  defs.append('marker')
    .attr('id', id)
    .attr('viewBox', '0 0 10 10')
    .attr('refX', 8).attr('refY', 5)
    .attr('markerWidth', 6).attr('markerHeight', 6)
    .attr('orient', 'auto-start-reverse')
    .append('path')
    .attr('d', 'M 0 0 L 10 5 L 0 10 Z')
    .attr('fill', opts.color || cssVar('--text-muted'));

  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const cx = opts.cx !== undefined ? opts.cx : mx;
  const cy = opts.cy !== undefined ? opts.cy : my + (opts.bend || 30);

  parent.append('path')
    .attr('d', `M ${x1},${y1} Q ${cx},${cy} ${x2},${y2}`)
    .attr('fill', 'none')
    .attr('stroke', opts.color || cssVar('--text-muted'))
    .attr('stroke-width', opts.width || 1.5)
    .attr('marker-end', `url(#${id})`)
    .attr('stroke-dasharray', opts.dashed ? '5,4' : null);
}
