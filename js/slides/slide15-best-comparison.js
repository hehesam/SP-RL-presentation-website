/* ============================================================
   SLIDE 15 — Best Config Head-to-Head: Q-Learning vs Actor-Critic
   Two side-by-side D3 charts (mean return, success rate).
   ============================================================ */
import { createSVG, drawXAxis, drawYAxis, drawGrid, cssVar } from '../utils/d3-helpers.js';
import { loadMultiseedData, qLabel, acLabel, extractHistory } from '../utils/multiseed-data.js';

const Q_COLOR  = '#1f77b4';
const AC_COLOR = '#d62728';

const W = 480, H = 280;
const M = { top: 16, right: 20, bottom: 46, left: 54 };
const IW = W - M.left - M.right;
const IH = H - M.top - M.bottom;

function drawComparison(selector, qCfg, acCfg, meanKey, stdKey, yDomain, refY, refLabel, yLabel) {
  const el = document.querySelector(selector);
  if (!el) return;

  const svg = createSVG(selector, W, H);
  const g   = svg.append('g').attr('transform', `translate(${M.left},${M.top})`);

  const maxEp = qCfg.history[qCfg.history.length - 1].episode;
  const xSc   = d3.scaleLinear().domain([0, maxEp]).range([0, IW]);
  const ySc   = d3.scaleLinear().domain(yDomain).range([IH, 0]);

  drawGrid(g, ySc, IW, 5);
  drawXAxis(g, xSc, IH, 'Episode', 5);
  drawYAxis(g, ySc, yLabel, 5);

  /* reference line */
  g.append('line')
    .attr('x1', 0).attr('x2', IW)
    .attr('y1', ySc(refY)).attr('y2', ySc(refY))
    .attr('stroke', '#2a9d5c').attr('stroke-width', 1.2)
    .attr('stroke-dasharray', '6,3').attr('opacity', 0.8);
  g.append('text')
    .attr('x', 4).attr('y', ySc(refY) - 5)
    .attr('fill', '#2a9d5c').style('font-size', '10px').text(refLabel);

  const line = d3.line()
    .x(d => xSc(d.e)).y(d => ySc(d.m))
    .curve(d3.curveCatmullRom);
  const area = d3.area()
    .x(d => xSc(d.e))
    .y0(d => ySc(Math.max(yDomain[0], d.m - d.s)))
    .y1(d => ySc(Math.min(yDomain[1], d.m + d.s)))
    .curve(d3.curveCatmullRom);

  [[qCfg, Q_COLOR], [acCfg, AC_COLOR]].forEach(([cfg, col], idx) => {
    const data = extractHistory(cfg, meanKey, stdKey);
    /* CI band — fade in */
    g.append('path').datum(data).attr('d', area)
      .attr('fill', col).attr('opacity', 0)
      .transition().delay(300 + idx * 500 + 800).duration(400)
      .attr('opacity', 0.18);
    /* mean line — stroke-dasharray draw animation */
    const path = g.append('path').datum(data).attr('d', line)
      .attr('fill', 'none').attr('stroke', col).attr('stroke-width', 2.8);
    const len = path.node().getTotalLength();
    path.attr('stroke-dasharray', len).attr('stroke-dashoffset', len)
      .transition().delay(300 + idx * 500).duration(1000).ease(d3.easeCubicOut)
      .attr('stroke-dashoffset', 0);
  });

  /* legend — positioned at bottom-right */
  const legend = g.append('g').attr('transform', `translate(${IW - 180}, ${IH - 36})`);
  [[Q_COLOR, `Q  (${qLabel(qCfg)})`], [AC_COLOR, `AC (${acLabel(acCfg)})`]]
    .forEach(([col, lbl], i) => {
      const row = legend.append('g').attr('transform', `translate(0,${i * 18})`);
      row.append('line').attr('x2', 18).attr('y1', 7).attr('y2', 7)
        .attr('stroke', col).attr('stroke-width', 2.5);
      row.append('text').attr('x', 22).attr('y', 11)
        .attr('fill', cssVar('--text-muted'))
        .style('font-size', '10px').style('font-family', "'Inter', sans-serif")
        .text(lbl);
    });
}

export async function initSlide15() {
  try {
    const { bestQ, bestAC } = await loadMultiseedData();
    drawComparison(
      '#chart-ms-best-return',   bestQ, bestAC,
      'return_mean_mean', 'return_mean_std',
      [-210, -90], -100, 'Ideal −100', 'Mean Return'
    );
    drawComparison(
      '#chart-ms-best-success',  bestQ, bestAC,
      'success_rate_mean', 'success_rate_std',
      [-0.05, 1.15], 1.0, 'Perfect 1.0', 'Success Rate'
    );
  } catch (e) { console.error('slide15:', e); }
}
