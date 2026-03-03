/* ============================================================
   SLIDE 09 — Experimental Setup
   Info cards + minimal summary panel
   ============================================================ */
import { SETUP_INFO } from '../utils/data.js';

export function initSlide09() {
  const cardsContainer = document.getElementById('setup-cards');
  if (!cardsContainer) return;

  // Populate info cards from data.js
  SETUP_INFO.forEach(item => {
    const card = document.createElement('div');
    card.className = 'info-card';
    card.innerHTML = `
      <div style="font-size:1.5rem; margin-bottom:0.3rem;">${item.icon}</div>
      <div class="label">${item.label}</div>
      <div class="value">${item.value}</div>
    `;
    cardsContainer.appendChild(card);
  });

  // Metrics summary in chart area
  const chartContainer = document.getElementById('chart-setup');
  if (!chartContainer) return;

  const metricsHTML = `
    <div style="display:flex; gap:2rem; flex-wrap:wrap; justify-content:center; width:100%;">
      <div class="info-card" style="text-align:center; flex:1; min-width:160px;">
        <div class="label">Metric 1</div>
        <div class="value" style="color:var(--accent-1);">Average Return</div>
        <div class="text-sm text-muted">Mean episode reward</div>
      </div>
      <div class="info-card" style="text-align:center; flex:1; min-width:160px;">
        <div class="label">Metric 2</div>
        <div class="value" style="color:var(--accent-2);">Success Rate</div>
        <div class="text-sm text-muted">% episodes reaching goal</div>
      </div>
      <div class="info-card" style="text-align:center; flex:1; min-width:160px;">
        <div class="label">Metric 3</div>
        <div class="value" style="color:var(--accent-3);">Steps to Goal</div>
        <div class="text-sm text-muted">Avg steps in successful episodes</div>
      </div>
    </div>
  `;
  chartContainer.innerHTML = metricsHTML;
}
