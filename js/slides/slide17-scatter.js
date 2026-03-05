/* ============================================================
   SLIDE 17 — Performance vs Stability Scatter
   X: final mean return (higher/less-negative = better → right)
   Y: std across seeds (lower = more stable → down)
   Ideal quadrant: top-right of plot (right = good, low-std)
   ============================================================ */
import { createSVG, drawXAxis, drawYAxis, drawGrid, cssVar } from '../utils/d3-helpers.js';
import { loadMultiseedData, qLabel, acLabel } from '../utils/multiseed-data.js';

const Q_COLOR  = '#1f77b4';
const AC_COLOR = '#d62728';

const W = 700, H = 380;
const M = { top: 24, right: 28, bottom: 54, left: 64 };
const IW = W - M.left - M.right;
const IH = H - M.top - M.bottom;

export async function initSlide17() {
  try {
    const { qData, acData } = await loadMultiseedData();

    const el = document.querySelector('#chart-ms-scatter');
    if (!el) return;

    const allReturns = [...qData, ...acData].map(c => c.return_mean_mean);
    const allStds    = [...qData, ...acData].map(c => c.return_mean_std);

    const svg = createSVG('#chart-ms-scatter', W, H);
    const g   = svg.append('g').attr('transform', `translate(${M.left},${M.top})`);

    /* scales — X: return, invert so worse (more negative) is on left */
    const xSc = d3.scaleLinear()
      .domain([d3.min(allReturns) - 4, d3.max(allReturns) + 4])
      .range([0, IW]);
    const ySc = d3.scaleLinear()
      .domain([0, d3.max(allStds) + 2])
      .range([IH, 0]);

    drawGrid(g, ySc, IW, 5);
    drawXAxis(g, xSc, IH, 'Final Mean Return (less negative = better →)', 6);
    drawYAxis(g, ySc, 'Std Across Seeds (lower = more stable ↓)', 5);

    /* ideal direction annotation */
    g.append('text')
      .attr('x', IW - 8).attr('y', IH - 8)
      .attr('text-anchor', 'end')
      .attr('fill', '#2a9d5c').style('font-size', '10.5px').style('font-style', 'italic')
      .text('← ideal corner (high return, low std)');

    /* Track all point groups for click interaction */
    const allPointGroups = [];
    let selectedGroup = null;

    /* Q-Learning points (squares) — animated entrance */
    qData.forEach((cfg, i) => {
      const x = xSc(cfg.return_mean_mean);
      const y = ySc(cfg.return_mean_std);
      const pg = g.append('g').attr('class', 'scatter-point');
      pg.append('rect')
        .attr('x', x).attr('y', y).attr('width', 0).attr('height', 0)
        .attr('fill', Q_COLOR).attr('stroke', '#003d7a').attr('stroke-width', 1.4)
        .attr('opacity', 0).style('cursor', 'pointer')
        .transition().delay(200 + i * 150).duration(500).ease(d3.easeCubicOut)
        .attr('x', x - 7).attr('y', y - 7).attr('width', 14).attr('height', 14)
        .attr('opacity', 0.85);
      const label = pg.append('text')
        .attr('x', x + 10).attr('y', y)
        .attr('dominant-baseline', 'middle')
        .attr('fill', Q_COLOR)
        .style('font-size', '9.5px').style('font-family', "'Inter', sans-serif")
        .attr('opacity', 0)
        .attr('pointer-events', 'none')
        .text(qLabel(cfg));
      allPointGroups.push({ group: pg, label });

      /* hover: show/hide label */
      pg.on('mouseenter', () => { label.attr('opacity', 1); })
        .on('mouseleave', () => { if (selectedGroup !== pg) label.attr('opacity', 0); });

      /* click: dim others */
      pg.on('click', (event) => {
        event.stopPropagation();
        if (selectedGroup === pg) {
          /* deselect */
          selectedGroup = null;
          allPointGroups.forEach(p => {
            p.group.attr('opacity', 1);
            p.label.attr('opacity', 0);
          });
        } else {
          selectedGroup = pg;
          allPointGroups.forEach(p => {
            if (p.group === pg) {
              p.group.attr('opacity', 1);
              p.label.attr('opacity', 1);
            } else {
              p.group.attr('opacity', 0.15);
              p.label.attr('opacity', 0);
            }
          });
        }
      });
    });

    /* AC points (circles) — animated entrance */
    acData.forEach((cfg, i) => {
      const x = xSc(cfg.return_mean_mean);
      const y = ySc(cfg.return_mean_std);
      const acDelay = 200 + qData.length * 150 + i * 120;
      const pg = g.append('g').attr('class', 'scatter-point');
      pg.append('circle')
        .attr('cx', x).attr('cy', y).attr('r', 0)
        .attr('fill', AC_COLOR).attr('stroke', '#7a0000').attr('stroke-width', 1.4)
        .attr('opacity', 0).style('cursor', 'pointer')
        .transition().delay(acDelay).duration(500).ease(d3.easeCubicOut)
        .attr('r', 8).attr('opacity', 0.82);
      const label = pg.append('text')
        .attr('x', x + 11).attr('y', y - 6)
        .attr('fill', AC_COLOR)
        .style('font-size', '8.5px').style('font-family', "'Inter', sans-serif")
        .attr('opacity', 0)
        .attr('pointer-events', 'none')
        .text(`σ=${cfg.sigma},θ=${cfg.alpha_theta},v=${cfg.alpha_v}`);
      allPointGroups.push({ group: pg, label });

      /* hover: show/hide label */
      pg.on('mouseenter', () => { label.attr('opacity', 1); })
        .on('mouseleave', () => { if (selectedGroup !== pg) label.attr('opacity', 0); });

      /* click: dim others */
      pg.on('click', (event) => {
        event.stopPropagation();
        if (selectedGroup === pg) {
          selectedGroup = null;
          allPointGroups.forEach(p => {
            p.group.attr('opacity', 1);
            p.label.attr('opacity', 0);
          });
        } else {
          selectedGroup = pg;
          allPointGroups.forEach(p => {
            if (p.group === pg) {
              p.group.attr('opacity', 1);
              p.label.attr('opacity', 1);
            } else {
              p.group.attr('opacity', 0.15);
              p.label.attr('opacity', 0);
            }
          });
        }
      });
    });

    /* Click on background to deselect */
    svg.on('click', () => {
      selectedGroup = null;
      allPointGroups.forEach(p => {
        p.group.attr('opacity', 1);
        p.label.attr('opacity', 0);
      });
    });

    /* legend */
    const legend = g.append('g').attr('transform', `translate(${IW * 0.06}, 8)`);
    [[Q_COLOR, '■ Q-Learning'], [AC_COLOR, '● Actor-Critic']].forEach(([col, lbl], i) => {
      legend.append('text').attr('y', i * 18)
        .attr('fill', col).style('font-size', '12px').style('font-weight', '600')
        .style('font-family', "'Inter', sans-serif").text(lbl);
    });
  } catch (e) { console.error('slide17:', e); }
}
