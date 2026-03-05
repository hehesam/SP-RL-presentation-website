/* ============================================================
   SLIDE 11 — Experiment 2: Q-Learning vs Policy Gradient (2000 eps)
   Interactive line chart with hover tooltips, click-to-focus,
   and a highlighted PG drop zone (ep 450–550).
   ============================================================ */
import { createSVG, drawXAxis, drawYAxis, drawGrid, cssVar } from '../utils/d3-helpers.js';

const LOG_FILES = {
  ql: 'logs/2000_log/q_learning_log2000.json',
  pg: 'logs/2000_log/policy_grad_log2000.json',
};

const CONFIGS = {
  ql: [
    'seed = 0',
    'RBF: 7×7 grid, σ = 0.20, bias = True',
    'train_episodes = 2000',
    'eval_every = 50, eval_episodes = 20',
    'max_steps = 200',
    'γ = 0.99, α = 0.01',
  ],
  pg: [
    'seed = 0',
    'RBF: 7×7 grid, σ = 0.20, bias = True',
    'train_episodes = 2000',
    'eval_every = 50, eval_episodes = 20',
    'max_steps = 200',
    'γ = 0.99',
    'α_θ = 0.0005, α_v = 0.005',
  ],
};

const SERIES_STYLE = {
  ql: { color: '#2EC4B6', label: 'Q-Learning' },
  pg: { color: '#E07A5F', label: 'Policy Gradient' },
};

export async function initSlide11() {
  try {
    const [qlData, pgData] = await Promise.all([
      d3.json(LOG_FILES.ql),
      d3.json(LOG_FILES.pg),
    ]);
    drawMainChart('#chart-exp2-return', qlData, pgData);
  } catch (err) {
    console.error('Slide 11 (Experiment 2) failed:', err);
  }
}

function drawMainChart(selector, qlData, pgData) {
  const container = document.querySelector(selector);
  if (!container) return;

  const W = 820, H = 440;
  const svg = createSVG(container, W, H);
  const m = { top: 30, right: 20, bottom: 48, left: 56 };
  const w = W - m.left - m.right;
  const h = H - m.top - m.bottom;
  const g = svg.append('g').attr('transform', `translate(${m.left},${m.top})`);

  // Scales
  const allData = [...qlData, ...pgData];
  const xScale = d3.scaleLinear()
    .domain([0, d3.max(allData, d => d.EP)])
    .range([0, w]);
  const yScale = d3.scaleLinear()
    .domain([d3.min(allData, d => d.eval_return) - 5, d3.max(allData, d => d.eval_return) + 5])
    .range([h, 0])
    .nice();

  // Grid + Axes
  drawGrid(g, yScale, w, 6);
  drawXAxis(g, xScale, h, 'Episodes', 8);
  drawYAxis(g, yScale, 'Eval Return', 6);

  // Title
  svg.append('text')
    .attr('x', m.left + w / 2).attr('y', 18)
    .attr('text-anchor', 'middle')
    .attr('fill', 'var(--text-primary)')
    .style('font-size', '14px')
    .style('font-weight', '600')
    .style('font-family', "'Source Serif 4', serif")
    .text('Evaluation Return — 2000 Episodes');

  // ---- Highlight zone: PG drop ep 450–550 ----
  const hlX1 = xScale(450), hlX2 = xScale(550);
  g.append('rect')
    .attr('x', hlX1).attr('y', 0)
    .attr('width', hlX2 - hlX1).attr('height', h)
    .attr('fill', SERIES_STYLE.pg.color)
    .attr('opacity', 0.08)
    .attr('rx', 4);
  g.append('text')
    .attr('x', (hlX1 + hlX2) / 2).attr('y', 14)
    .attr('text-anchor', 'middle')
    .attr('fill', SERIES_STYLE.pg.color)
    .style('font-size', '10px')
    .style('font-weight', '600')
    .style('font-style', 'italic')
    .text('PG score drop');

  // ---- Draw lines ----
  const line = d3.line()
    .x(d => xScale(d.EP))
    .y(d => yScale(d.eval_return))
    .curve(d3.curveMonotoneX);

  const seriesArr = [
    { key: 'ql', data: qlData },
    { key: 'pg', data: pgData },
  ];

  const paths = {};
  const dotGroups = {};

  seriesArr.forEach(({ key, data }, idx) => {
    const style = SERIES_STYLE[key];

    // Line path
    const path = g.append('path')
      .datum(data)
      .attr('d', line)
      .attr('fill', 'none')
      .attr('stroke', style.color)
      .attr('stroke-width', 2.5)
      .attr('class', `exp2-line exp2-line-${key}`)
      .style('cursor', 'pointer')
      .style('transition', 'opacity 0.3s');

    // Animate drawing
    const totalLength = path.node().getTotalLength();
    path
      .attr('stroke-dasharray', totalLength)
      .attr('stroke-dashoffset', totalLength)
      .transition()
      .delay(300 + idx * 400)
      .duration(1200)
      .ease(d3.easeCubicOut)
      .attr('stroke-dashoffset', 0);

    // Dots
    const dots = g.selectAll(`.exp2-dot-${key}`)
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', d => xScale(d.EP))
      .attr('cy', d => yScale(d.eval_return))
      .attr('r', 3)
      .attr('fill', style.color)
      .attr('class', `exp2-dot exp2-dot-${key}`)
      .style('cursor', 'pointer')
      .style('transition', 'opacity 0.3s')
      .attr('opacity', 0);

    dots.transition()
      .delay(300 + idx * 400 + 1200)
      .duration(400)
      .attr('opacity', 0.7);

    paths[key] = path;
    dotGroups[key] = dots;
  });

  // ---- Interactive legend (click-to-focus) ----
  const legendEntries = Object.entries(SERIES_STYLE);
  const legendH = legendEntries.length * 22;
  const legendG = svg.append('g')
    .attr('transform', `translate(${W - m.right - 110},${m.top + h - legendH - 4})`);

  let activeKey = null;

  Object.entries(SERIES_STYLE).forEach(([key, style], i) => {
    const row = legendG.append('g')
      .attr('transform', `translate(0,${i * 22})`)
      .style('cursor', 'pointer');

    row.append('rect')
      .attr('width', 16).attr('height', 4).attr('y', 6).attr('rx', 2)
      .attr('fill', style.color);

    row.append('text')
      .attr('x', 22).attr('y', 12)
      .attr('fill', 'var(--text-muted)')
      .style('font-size', '12px')
      .style('font-family', "'Inter', sans-serif")
      .text(style.label);

    row.on('click', () => toggleFocus(key));
  });

  function toggleFocus(key) {
    if (activeKey === key) {
      // Deselect — restore all
      activeKey = null;
      Object.keys(paths).forEach(k => {
        paths[k].attr('opacity', 1).attr('stroke-width', 2.5);
        dotGroups[k].attr('opacity', 0.7);
      });
    } else {
      activeKey = key;
      Object.keys(paths).forEach(k => {
        const isFocused = k === key;
        paths[k]
          .attr('opacity', isFocused ? 1 : 0.15)
          .attr('stroke-width', isFocused ? 3 : 2);
        dotGroups[k].attr('opacity', isFocused ? 0.9 : 0.08);
      });
    }
  }

  // ---- Click on lines to focus ----
  seriesArr.forEach(({ key }) => {
    paths[key].on('click', () => toggleFocus(key));
    dotGroups[key].on('click', () => toggleFocus(key));
  });

  // ---- Tooltip on hover ----
  const tooltip = d3.select(container)
    .append('div')
    .attr('class', 'exp2-tooltip')
    .style('opacity', 0);

  // Invisible wider hit-area per data point
  seriesArr.forEach(({ key, data }) => {
    const style = SERIES_STYLE[key];
    g.selectAll(`.exp2-hit-${key}`)
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', d => xScale(d.EP))
      .attr('cy', d => yScale(d.eval_return))
      .attr('r', 10)
      .attr('fill', 'transparent')
      .style('cursor', 'pointer')
      .on('mouseenter', function (event, d) {
        const cfg = CONFIGS[key];
        tooltip
          .html(`
            <div class="exp2-tt-title" style="color:${style.color}">${style.label}</div>
            <div class="exp2-tt-ep">Episode ${d.EP} &nbsp;|&nbsp; Return: ${d.eval_return}</div>
            <div class="exp2-tt-cfg">${cfg.join('<br>')}</div>
          `)
          .style('opacity', 1);
      })
      .on('mousemove', function (event) {
        // Position tooltip relative to container (use SVG coords)
        const rect = container.getBoundingClientRect();
        const ex = event.clientX - rect.left;
        const ey = event.clientY - rect.top;
        tooltip
          .style('left', (ex + 14) + 'px')
          .style('top', (ey - 10) + 'px');
      })
      .on('mouseleave', () => {
        tooltip.style('opacity', 0);
      })
      .on('click', () => toggleFocus(key));
  });
}
