/* ============================================================
   SLIDE 14 — Actor-Critic: Learning Curves (all 8 configurations)
   Two overlaid D3 charts: mean return and success rate.
   Best config is bolded; all others rendered thin.
   ============================================================ */
import { createSVG, drawXAxis, drawYAxis, drawGrid, cssVar } from '../utils/d3-helpers.js';
import { loadMultiseedData, AC_COLORS, extractHistory } from '../utils/multiseed-data.js';

const W = 500, H = 270;
const M = { top: 14, right: 22, bottom: 44, left: 54 };
const IW = W - M.left - M.right;
const IH = H - M.top - M.bottom;

function drawOverlaid(selector, allCfgs, bestCfg, colors, meanKey, stdKey, yDomain, refY, refLabel, yLabel) {
  const el = document.querySelector(selector);
  if (!el) return;

  const svg = createSVG(selector, W, H);
  const g   = svg.append('g').attr('transform', `translate(${M.left},${M.top})`);

  const maxEp = allCfgs[0].history[allCfgs[0].history.length - 1].episode;
  const xSc   = d3.scaleLinear().domain([0, maxEp]).range([0, IW]);
  const ySc   = d3.scaleLinear().domain(yDomain).range([IH, 0]);

  drawGrid(g, ySc, IW, 5);
  drawXAxis(g, xSc, IH, 'Episode', 5);
  drawYAxis(g, ySc, yLabel, 5);

  /* reference line */
  g.append('line')
    .attr('x1', 0).attr('x2', IW)
    .attr('y1', ySc(refY)).attr('y2', ySc(refY))
    .attr('stroke', '#2a9d5c').attr('stroke-width', 1)
    .attr('stroke-dasharray', '6,3').attr('opacity', 0.8);
  g.append('text')
    .attr('x', IW - 4).attr('y', ySc(refY) - 5)
    .attr('text-anchor', 'end')
    .attr('fill', '#2a9d5c').style('font-size', '10px')
    .text(refLabel);

  const line = d3.line()
    .x(d => xSc(d.e)).y(d => ySc(d.m))
    .curve(d3.curveCatmullRom);

  /* non-best configs first (thin, no band) — animated line drawing */
  allCfgs.forEach((cfg, i) => {
    if (cfg === bestCfg) return;
    const data = extractHistory(cfg, meanKey, stdKey);
    const path = g.append('path').datum(data).attr('d', line)
      .attr('fill', 'none').attr('stroke', colors[i])
      .attr('stroke-width', 1.2).attr('opacity', 0.45);
    const len = path.node().getTotalLength();
    path.attr('stroke-dasharray', len).attr('stroke-dashoffset', len)
      .transition().delay(200 + i * 120).duration(900).ease(d3.easeCubicOut)
      .attr('stroke-dashoffset', 0);
  });

  /* best config: CI band + thicker line — animated */
  const bestIdx  = allCfgs.indexOf(bestCfg);
  const bestData = extractHistory(bestCfg, meanKey, stdKey);

  const area = d3.area()
    .x(d => xSc(d.e))
    .y0(d => ySc(Math.max(yDomain[0], d.m - d.s)))
    .y1(d => ySc(Math.min(yDomain[1], d.m + d.s)))
    .curve(d3.curveCatmullRom);
  g.append('path').datum(bestData).attr('d', area)
    .attr('fill', colors[bestIdx]).attr('opacity', 0)
    .transition().delay(200 + allCfgs.length * 120 + 800).duration(400)
    .attr('opacity', 0.2);
  const bestPath = g.append('path').datum(bestData).attr('d', line)
    .attr('fill', 'none').attr('stroke', colors[bestIdx])
    .attr('stroke-width', 3);
  const bestLen = bestPath.node().getTotalLength();
  bestPath.attr('stroke-dasharray', bestLen).attr('stroke-dashoffset', bestLen)
    .transition().delay(200 + allCfgs.length * 120).duration(1000).ease(d3.easeCubicOut)
    .attr('stroke-dashoffset', 0);

  /* "Best" label at end of best curve */
  const last = bestData[bestData.length - 1];
  g.append('text')
    .attr('x', xSc(last.e) + 4).attr('y', ySc(last.m))
    .attr('dominant-baseline', 'middle')
    .attr('fill', colors[bestIdx])
    .style('font-size', '10px').style('font-weight', '700')
    .text('Best');
}

export async function initSlide14() {
  try {
    const { acData, bestAC } = await loadMultiseedData();
    drawOverlaid(
      '#chart-ms-ac-return', acData, bestAC, AC_COLORS,
      'return_mean_mean', 'return_mean_std',
      [-210, -90], -100, 'Ideal −100', 'Mean Return'
    );
    drawOverlaid(
      '#chart-ms-ac-success', acData, bestAC, AC_COLORS,
      'success_rate_mean', 'success_rate_std',
      [-0.05, 1.15], 1.0, 'Perfect', 'Success Rate'
    );
  } catch (e) { console.error('slide14:', e); }
}
