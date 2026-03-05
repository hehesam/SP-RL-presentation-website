/* ============================================================
   SLIDE 18 — Success Rate Curves: All Configurations
   All configs overlaid; best of each algorithm drawn thick.
   ============================================================ */
import { createSVG, drawXAxis, drawYAxis, drawGrid, cssVar } from '../utils/d3-helpers.js';
import { loadMultiseedData, Q_COLORS, AC_COLORS, extractHistory } from '../utils/multiseed-data.js';

const W = 720, H = 370;
const M = { top: 16, right: 140, bottom: 46, left: 56 };
const IW = W - M.left - M.right;
const IH = H - M.top - M.bottom;

export async function initSlide18() {
  try {
    const { qData, acData, bestQ, bestAC } = await loadMultiseedData();

    const el = document.querySelector('#chart-ms-success');
    if (!el) return;

    const maxEp = qData[0].history[qData[0].history.length - 1].episode;

    const svg = createSVG('#chart-ms-success', W, H);
    const g   = svg.append('g').attr('transform', `translate(${M.left},${M.top})`);

    const xSc = d3.scaleLinear().domain([0, maxEp]).range([0, IW]);
    const ySc = d3.scaleLinear().domain([-0.05, 1.15]).range([IH, 0]);

    drawGrid(g, ySc, IW, 5);
    drawXAxis(g, xSc, IH, 'Episode', 5);
    drawYAxis(g, ySc, 'Success Rate', 5);

    /* perfect line */
    g.append('line')
      .attr('x1', 0).attr('x2', IW)
      .attr('y1', ySc(1)).attr('y2', ySc(1))
      .attr('stroke', '#2a9d5c').attr('stroke-width', 1.2)
      .attr('stroke-dasharray', '6,3').attr('opacity', 0.7);

    const lineGen = d3.line()
      .x(d => xSc(d.e)).y(d => ySc(d.m))
      .curve(d3.curveCatmullRom);

    const areaGen = d3.area()
      .x(d => xSc(d.e))
      .y0(d => ySc(Math.max(-0.05, d.m - d.s)))
      .y1(d => ySc(Math.min(1.15, d.m + d.s)))
      .curve(d3.curveCatmullRom);

    /* Q-Learning (thin background lines — animated) */
    let lineIdx = 0;
    qData.forEach((cfg, i) => {
      const isBest = cfg === bestQ;
      const data   = extractHistory(cfg, 'success_rate_mean', 'success_rate_std');
      if (!isBest) {
        const path = g.append('path').datum(data).attr('d', lineGen)
          .attr('fill', 'none').attr('stroke', Q_COLORS[i])
          .attr('stroke-width', 1.2).attr('opacity', 0.35);
        const len = path.node().getTotalLength();
        path.attr('stroke-dasharray', len).attr('stroke-dashoffset', len)
          .transition().delay(200 + lineIdx * 120).duration(800).ease(d3.easeCubicOut)
          .attr('stroke-dashoffset', 0);
        lineIdx++;
      }
    });

    /* AC (thin background lines — animated) */
    acData.forEach((cfg, i) => {
      const isBest = cfg === bestAC;
      const data   = extractHistory(cfg, 'success_rate_mean', 'success_rate_std');
      if (!isBest) {
        const path = g.append('path').datum(data).attr('d', lineGen)
          .attr('fill', 'none').attr('stroke', AC_COLORS[i])
          .attr('stroke-width', 1.2).attr('opacity', 0.35);
        const len = path.node().getTotalLength();
        path.attr('stroke-dasharray', len).attr('stroke-dashoffset', len)
          .transition().delay(200 + lineIdx * 120).duration(800).ease(d3.easeCubicOut)
          .attr('stroke-dashoffset', 0);
        lineIdx++;
      }
    });

    const boldDelay = 200 + lineIdx * 120;

    /* Bold best Q — animated */
    const bestQData = extractHistory(bestQ, 'success_rate_mean', 'success_rate_std');
    g.append('path').datum(bestQData).attr('d', areaGen)
      .attr('fill', '#1f77b4').attr('opacity', 0)
      .transition().delay(boldDelay + 800).duration(400)
      .attr('opacity', 0.15);
    const bestQPath = g.append('path').datum(bestQData).attr('d', lineGen)
      .attr('fill', 'none').attr('stroke', '#1f77b4').attr('stroke-width', 3);
    const bqLen = bestQPath.node().getTotalLength();
    bestQPath.attr('stroke-dasharray', bqLen).attr('stroke-dashoffset', bqLen)
      .transition().delay(boldDelay).duration(1000).ease(d3.easeCubicOut)
      .attr('stroke-dashoffset', 0);

    /* Bold best AC — animated */
    const bestACData = extractHistory(bestAC, 'success_rate_mean', 'success_rate_std');
    g.append('path').datum(bestACData).attr('d', areaGen)
      .attr('fill', '#d62728').attr('opacity', 0)
      .transition().delay(boldDelay + 500 + 800).duration(400)
      .attr('opacity', 0.15);
    const bestACPath = g.append('path').datum(bestACData).attr('d', lineGen)
      .attr('fill', 'none').attr('stroke', '#d62728').attr('stroke-width', 3);
    const bacLen = bestACPath.node().getTotalLength();
    bestACPath.attr('stroke-dasharray', bacLen).attr('stroke-dashoffset', bacLen)
      .transition().delay(boldDelay + 500).duration(1000).ease(d3.easeCubicOut)
      .attr('stroke-dashoffset', 0);

    /* Legend */
    const legendX = IW + 8, legendY = 10;
    const legend  = g.append('g').attr('transform', `translate(${legendX},${legendY})`);

    const legendItems = [
      { col: '#1f77b4', lw: 3,   label: 'Q best (bold)' },
      { col: '#1f77b4', lw: 1.2, label: 'Q other configs', op: 0.45 },
      { col: '#d62728', lw: 3,   label: 'AC best (bold)' },
      { col: '#d62728', lw: 1.2, label: 'AC other configs', op: 0.45 },
      { col: '#2a9d5c', lw: 1.2, label: 'Perfect (1.0)', dash: '5,3' },
    ];
    legendItems.forEach(({ col, lw, label, op, dash }, i) => {
      const row = legend.append('g').attr('transform', `translate(0,${i * 20})`);
      row.append('line').attr('x2', 22).attr('y1', 8).attr('y2', 8)
        .attr('stroke', col).attr('stroke-width', lw)
        .attr('opacity', op || 1).attr('stroke-dasharray', dash || null);
      row.append('text').attr('x', 28).attr('y', 12)
        .attr('fill', cssVar('--text-muted'))
        .style('font-size', '10px').style('font-family', "'Inter', sans-serif")
        .text(label);
    });
  } catch (e) { console.error('slide18:', e); }
}
