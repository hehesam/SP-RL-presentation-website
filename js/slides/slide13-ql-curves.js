/* ============================================================
   SLIDE 13 — Q-Learning: Learning Curves (all 4 configurations)
   2×2 grid of D3 line charts with ±1 std CI bands.
   ============================================================ */
import { createSVG, drawXAxis, drawYAxis, drawGrid, cssVar } from '../utils/d3-helpers.js';
import { loadMultiseedData, Q_COLORS, qLabel, extractHistory } from '../utils/multiseed-data.js';

const W = 400, H = 222;
const M = { top: 26, right: 18, bottom: 42, left: 50 };
const IW = W - M.left - M.right;
const IH = H - M.top - M.bottom;

function drawCurve(selector, cfg, color, delay) {
  const el = document.querySelector(selector);
  if (!el) return;

  const data   = extractHistory(cfg, 'return_mean_mean', 'return_mean_std');
  const maxEp  = data[data.length - 1].e;

  const svg  = createSVG(selector, W, H);
  const g    = svg.append('g').attr('transform', `translate(${M.left},${M.top})`);

  const xSc  = d3.scaleLinear().domain([0, maxEp]).range([0, IW]);
  const ySc  = d3.scaleLinear().domain([-210, -90]).range([IH, 0]);

  drawGrid(g, ySc, IW, 4);
  drawXAxis(g, xSc, IH, 'Episode', 5);
  drawYAxis(g, ySc, 'Return', 4);

  /* reference lines */
  const hline = (y, col, dash) =>
    g.append('line')
      .attr('x1', 0).attr('x2', IW)
      .attr('y1', ySc(y)).attr('y2', ySc(y))
      .attr('stroke', col).attr('stroke-width', 1)
      .attr('stroke-dasharray', dash).attr('opacity', 0.7);
  hline(-200, cssVar('--text-muted'), '4,3');
  hline(-100, '#2a9d5c', '6,3');

  /* CI band — start transparent, fade in */
  const area = d3.area()
    .x(d => xSc(d.e))
    .y0(d => ySc(Math.max(-210, d.m - d.s)))
    .y1(d => ySc(Math.min(-90,  d.m + d.s)))
    .curve(d3.curveCatmullRom);
  g.append('path').datum(data).attr('d', area)
    .attr('fill', color).attr('opacity', 0)
    .transition().delay(delay + 800).duration(400)
    .attr('opacity', 0.22);

  /* mean line — draw with stroke-dasharray animation */
  const line = d3.line()
    .x(d => xSc(d.e)).y(d => ySc(d.m))
    .curve(d3.curveCatmullRom);
  const path = g.append('path').datum(data).attr('d', line)
    .attr('fill', 'none').attr('stroke', color).attr('stroke-width', 2.4);
  const len = path.node().getTotalLength();
  path.attr('stroke-dasharray', len).attr('stroke-dashoffset', len)
    .transition().delay(delay).duration(1000).ease(d3.easeCubicOut)
    .attr('stroke-dashoffset', 0);

  /* chart title */
  svg.append('text')
    .attr('x', W / 2).attr('y', 15)
    .attr('text-anchor', 'middle')
    .attr('fill', color)
    .style('font-size', '11.5px').style('font-weight', '600')
    .style('font-family', "'Inter', sans-serif")
    .text(`${qLabel(cfg)}   →   ${cfg.return_mean_mean.toFixed(1)} ± ${cfg.return_mean_std.toFixed(1)}`);
}

export async function initSlide13() {
  try {
    const { qData } = await loadMultiseedData();
    qData.forEach((cfg, i) => drawCurve(`#chart-ms-ql-${i}`, cfg, Q_COLORS[i], 200 + i * 280));
  } catch (e) { console.error('slide13:', e); }
}
