/* ============================================================
   SLIDE 16 — Hyperparameter Sensitivity Heatmaps
   Q-Learning (σ × α) and Actor-Critic (σ × α_θ × α_v) side by side.
   ============================================================ */
import { createSVG, cssVar } from '../utils/d3-helpers.js';
import { loadMultiseedData } from '../utils/multiseed-data.js';

/* ---- draw a single heatmap grid ---- */
function drawHeatmap(selector, rows, cols, cells, colorScale, titleText, rowLabel, colLabel) {
  const el = document.querySelector(selector);
  if (!el) return;

  const cellW = 100, cellH = 66;
  const pad   = { top: 48, right: 16, bottom: 52, left: 62 };
  const W = pad.left + cols.length * cellW + pad.right;
  const H = pad.top  + rows.length * cellH + pad.bottom;

  const svg = createSVG(selector, W, H);
  const g   = svg.append('g').attr('transform', `translate(${pad.left},${pad.top})`);

  /* title */
  svg.append('text')
    .attr('x', W / 2).attr('y', 26)
    .attr('text-anchor', 'middle')
    .attr('fill', cssVar('--text-primary'))
    .style('font-size', '13px').style('font-weight', '600')
    .style('font-family', "'Inter', sans-serif")
    .text(titleText);

  /* axis labels */
  svg.append('text')
    .attr('x', pad.left + cols.length * cellW / 2).attr('y', H - 8)
    .attr('text-anchor', 'middle')
    .attr('fill', cssVar('--text-muted'))
    .style('font-size', '11px').style('font-family', "'Inter', sans-serif")
    .text(colLabel);
  svg.append('text')
    .attr('transform', `rotate(-90)`)
    .attr('x', -(pad.top + rows.length * cellH / 2)).attr('y', 14)
    .attr('text-anchor', 'middle')
    .attr('fill', cssVar('--text-muted'))
    .style('font-size', '11px').style('font-family', "'Inter', sans-serif")
    .text(rowLabel);

  /* col headers */
  cols.forEach((c, ci) => {
    g.append('text')
      .attr('x', ci * cellW + cellW / 2).attr('y', -10)
      .attr('text-anchor', 'middle')
      .attr('fill', cssVar('--text-secondary'))
      .style('font-size', '11px').style('font-family', "'Inter', sans-serif")
      .text(c);
  });

  /* row headers */
  rows.forEach((r, ri) => {
    g.append('text')
      .attr('x', -8).attr('y', ri * cellH + cellH / 2)
      .attr('text-anchor', 'end').attr('dominant-baseline', 'middle')
      .attr('fill', cssVar('--text-secondary'))
      .style('font-size', '11px').style('font-family', "'Inter', sans-serif")
      .text(r);
  });

  /* cells — animated stagger */
  cells.forEach(({ ri, ci, value, label1, label2 }, idx) => {
    const x = ci * cellW, y = ri * cellH;
    g.append('rect')
      .attr('x', x).attr('y', y)
      .attr('width', cellW).attr('height', cellH)
      .attr('fill', colorScale(value))
      .attr('stroke', cssVar('--bg-card')).attr('stroke-width', 2)
      .attr('rx', 4)
      .attr('opacity', 0)
      .transition().delay(200 + idx * 100).duration(400).ease(d3.easeCubicOut)
      .attr('opacity', 1);
    g.append('text')
      .attr('x', x + cellW / 2).attr('y', y + cellH / 2 - 7)
      .attr('text-anchor', 'middle').attr('dominant-baseline', 'middle')
      .attr('fill', '#1a1a1a')
      .style('font-size', '12.5px').style('font-weight', '700')
      .style('font-family', "'JetBrains Mono', monospace")
      .text(label1)
      .attr('opacity', 0)
      .transition().delay(200 + idx * 100 + 200).duration(300)
      .attr('opacity', 1);
    if (label2) {
      g.append('text')
        .attr('x', x + cellW / 2).attr('y', y + cellH / 2 + 10)
        .attr('text-anchor', 'middle').attr('dominant-baseline', 'middle')
        .attr('fill', '#1a1a1a')
        .style('font-size', '10px').style('font-family', "'JetBrains Mono', monospace")
        .text(label2)
        .attr('opacity', 0)
        .transition().delay(200 + idx * 100 + 200).duration(300)
        .attr('opacity', 1);
    }
  });
}

export async function initSlide16() {
  try {
    const { qData, acData } = await loadMultiseedData();

    /* ---- Q-Learning heatmap (σ × α) ---- */
    const qSigmas = [...new Set(qData.map(c => c.sigma))].sort();
    const qAlphas = [...new Set(qData.map(c => c.alpha))].sort();
    const qReturns = qData.map(c => c.return_mean_mean);
    const qColorSc = d3.scaleSequential()
      .domain([d3.min(qReturns) - 2, d3.max(qReturns) + 2])
      .interpolator(d3.interpolateRdYlGn);

    const qCells = qData.map(cfg => ({
      ri: qSigmas.indexOf(cfg.sigma),
      ci: qAlphas.indexOf(cfg.alpha),
      value: cfg.return_mean_mean,
      label1: cfg.return_mean_mean.toFixed(1),
      label2: `±${cfg.return_mean_std.toFixed(1)}`,
    }));

    drawHeatmap(
      '#chart-ms-q-heatmap',
      qSigmas.map(s => `σ=${s}`),
      qAlphas.map(a => `α=${a}`),
      qCells, qColorSc,
      'Q-Learning — Final Mean Return', 'RBF Width σ', 'Learning Rate α'
    );

    /* ---- AC heatmap — one σ at a time, stacked ---- */
    const acSigmas    = [...new Set(acData.map(c => c.sigma))].sort();
    const acThetas    = [...new Set(acData.map(c => c.alpha_theta))].sort();
    const acAlphaVs   = [...new Set(acData.map(c => c.alpha_v))].sort();
    const acReturns   = acData.map(c => c.return_mean_mean);
    const acColorSc   = d3.scaleSequential()
      .domain([d3.min(acReturns) - 0.5, d3.max(acReturns) + 0.5])
      .interpolator(d3.interpolateRdYlGn);

    /* Combine all AC configs into one heatmap with row label = σ + α_θ */
    const acRows = [];
    acSigmas.forEach(s => acThetas.forEach(t => acRows.push(`σ=${s}\nα_θ=${t}`)));

    const acCells = acData.map(cfg => {
      const ri = acSigmas.indexOf(cfg.sigma) * acThetas.length + acThetas.indexOf(cfg.alpha_theta);
      const ci = acAlphaVs.indexOf(cfg.alpha_v);
      return {
        ri, ci,
        value: cfg.return_mean_mean,
        label1: cfg.return_mean_mean.toFixed(1),
        label2: `±${cfg.return_mean_std.toFixed(1)}`,
      };
    });

    drawHeatmap(
      '#chart-ms-ac-heatmap',
      acRows,
      acAlphaVs.map(a => `α_v=${a}`),
      acCells, acColorSc,
      'Actor-Critic — Final Mean Return', 'σ / Actor LR α_θ', 'Critic LR α_v'
    );
  } catch (e) { console.error('slide16:', e); }
}
