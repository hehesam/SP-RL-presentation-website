/* ============================================================
   SLIDE 10 — Experiment 1: Effect of Different RBF Centers
   Four line plots: eval return & success rate for Q-Learning & PG
   ============================================================ */
import { createSVG, drawXAxis, drawYAxis, drawGrid, cssVar } from '../utils/d3-helpers.js';

const LOG_FILES = {
  ql5:  'logs/centers/q_learning_log5x5.json',
  ql7:  'logs/centers/q_learning_log7x7.json',
  ql10: 'logs/centers/q_learning_log10x10.json',
  pg5:  'logs/centers/policy_grad_log5x5.json',
  pg7:  'logs/centers/policy_grad_log7x7.json',
  pg10: 'logs/centers/policy_grad_log10x10.json',
};

const GRID_COLORS = {
  '5×5':  '#E07A5F',   // coral
  '7×7':  '#2EC4B6',   // teal
  '10×10': '#8A6FDF',  // purple
};

export async function initSlide10() {
  try {
    const [ql5, ql7, ql10, pg5, pg7, pg10] = await Promise.all([
      d3.json(LOG_FILES.ql5),
      d3.json(LOG_FILES.ql7),
      d3.json(LOG_FILES.ql10),
      d3.json(LOG_FILES.pg5),
      d3.json(LOG_FILES.pg7),
      d3.json(LOG_FILES.pg10),
    ]);

    // --- Top row: Evaluation Returns ---
    drawLineChart(
      '#chart-centers-pg-return',
      [
        { data: pg5,  label: '5×5',  color: GRID_COLORS['5×5'] },
        { data: pg7,  label: '7×7',  color: GRID_COLORS['7×7'] },
        { data: pg10, label: '10×10', color: GRID_COLORS['10×10'] },
      ],
      'Policy Gradient — Eval Return',
      'Episodes',
      'Return',
      d => d.eval_return,
      null
    );

    drawLineChart(
      '#chart-centers-ql-return',
      [
        { data: ql5,  label: '5×5',  color: GRID_COLORS['5×5'] },
        { data: ql7,  label: '7×7',  color: GRID_COLORS['7×7'] },
        { data: ql10, label: '10×10', color: GRID_COLORS['10×10'] },
      ],
      'Q-Learning — Eval Return',
      'Episodes',
      'Return',
      d => d.eval_return,
      null
    );

    // --- Bottom row: Success Rates ---
    drawLineChart(
      '#chart-centers-pg-success',
      [
        { data: pg5,  label: '5×5',  color: GRID_COLORS['5×5'] },
        { data: pg7,  label: '7×7',  color: GRID_COLORS['7×7'] },
        { data: pg10, label: '10×10', color: GRID_COLORS['10×10'] },
      ],
      'Policy Gradient — Success Rate',
      'Episodes',
      'Success',
      d => d.success,
      [0, 1.05]
    );

    drawLineChart(
      '#chart-centers-ql-success',
      [
        { data: ql5,  label: '5×5',  color: GRID_COLORS['5×5'] },
        { data: ql7,  label: '7×7',  color: GRID_COLORS['7×7'] },
        { data: ql10, label: '10×10', color: GRID_COLORS['10×10'] },
      ],
      'Q-Learning — Success Rate',
      'Episodes',
      'Success',
      d => d.success,
      [0, 1.05]
    );

    // --- Activate description tabs ---
    initDescriptionTabs();

    // --- Draw shared legend ---
    drawSharedLegend();

  } catch (err) {
    console.error('Slide 10 (RBF Centers) failed to load data:', err);
  }
}

/* ---- Generic multi-series line chart ---- */
function drawLineChart(selector, series, title, xLabel, yLabel, accessor, yDomainOverride) {
  const container = document.querySelector(selector);
  if (!container) return;

  const W = 400, H = 280;
  const svg = createSVG(container, W, H);
  const m = { top: 28, right: 12, bottom: 40, left: 48 };
  const w = W - m.left - m.right;
  const h = H - m.top - m.bottom;
  const g = svg.append('g').attr('transform', `translate(${m.left},${m.top})`);

  // Compute scales
  const allData = series.flatMap(s => s.data);
  const xScale = d3.scaleLinear()
    .domain([0, d3.max(allData, d => d.EP)])
    .range([0, w]);

  const yMin = yDomainOverride ? yDomainOverride[0] : d3.min(allData, accessor) * 1.05;
  const yMax = yDomainOverride ? yDomainOverride[1] : d3.max(allData, accessor) * 0.95;
  const yScale = d3.scaleLinear()
    .domain(yDomainOverride || [Math.min(yMin, yMax), Math.max(yMin, yMax)])
    .range([h, 0])
    .nice();

  // Grid + Axes
  drawGrid(g, yScale, w, 5);
  drawXAxis(g, xScale, h, xLabel, 5);
  drawYAxis(g, yScale, yLabel, 5);

  // Title
  svg.append('text')
    .attr('x', m.left + w / 2).attr('y', 16)
    .attr('text-anchor', 'middle')
    .attr('fill', 'var(--text-primary)')
    .style('font-size', '13px')
    .style('font-weight', '600')
    .style('font-family', "'Source Serif 4', serif")
    .text(title);

  // Draw each series
  const line = d3.line()
    .x(d => xScale(d.EP))
    .y(d => yScale(accessor(d)))
    .curve(d3.curveMonotoneX);

  series.forEach((s, idx) => {
    const path = g.append('path')
      .datum(s.data)
      .attr('d', line)
      .attr('fill', 'none')
      .attr('stroke', s.color)
      .attr('stroke-width', 2)
      .attr('opacity', 0.9);

    // Animate line drawing
    const totalLength = path.node().getTotalLength();
    path
      .attr('stroke-dasharray', totalLength)
      .attr('stroke-dashoffset', totalLength)
      .transition()
      .delay(300 + idx * 250)
      .duration(900)
      .ease(d3.easeCubicOut)
      .attr('stroke-dashoffset', 0);

    // Dots at data points
    g.selectAll(`.dot-${idx}`)
      .data(s.data)
      .enter()
      .append('circle')
      .attr('cx', d => xScale(d.EP))
      .attr('cy', d => yScale(accessor(d)))
      .attr('r', 2.5)
      .attr('fill', s.color)
      .attr('opacity', 0)
      .transition()
      .delay(300 + idx * 250 + 900)
      .duration(400)
      .attr('opacity', 0.7);
  });
}

/* ---- Description tab switching ---- */
function initDescriptionTabs() {
  const tabs = document.querySelectorAll('.centers-tab-btn');
  const panels = document.querySelectorAll('.centers-tab-panel');
  if (!tabs.length) return;

  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      tabs.forEach(t => t.classList.toggle('active', t === btn));
      panels.forEach(p => p.classList.toggle('active', p.id === target));
    });
  });
}

/* ---- Shared legend (DOM-based, left side) ---- */
function drawSharedLegend() {
  const container = document.getElementById('centers-shared-legend');
  if (!container) return;

  Object.entries(GRID_COLORS).forEach(([label, color]) => {
    const item = document.createElement('div');
    item.className = 'centers-legend-item';
    item.innerHTML = `
      <span class="centers-legend-swatch" style="background:${color};"></span>
      <span class="centers-legend-label">${label}</span>
    `;
    container.appendChild(item);
  });
}
