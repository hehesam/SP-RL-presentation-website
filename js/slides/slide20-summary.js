/* ============================================================
   SLIDE 20 — Summary Table
   Renders a comparison table from live JSON data.
   ============================================================ */
import { loadMultiseedData } from '../utils/multiseed-data.js';

export async function initSlide20() {
  try {
    const { qData, acData } = await loadMultiseedData();

    const bestQ  = qData.reduce((a, b) => b.return_mean_mean > a.return_mean_mean ? b : a);
    const worstQ = qData.reduce((a, b) => b.return_mean_mean < a.return_mean_mean ? b : a);
    const bestAC  = acData.reduce((a, b) => b.return_mean_mean > a.return_mean_mean ? b : a);
    const worstAC = acData.reduce((a, b) => b.return_mean_mean < a.return_mean_mean ? b : a);

    const qSuccessRates = qData.map(c => c.success_rate_mean);
    const acSuccessRates = acData.map(c => c.success_rate_mean);

    const rows = [
      {
        criterion: 'Best final return',
        q: `${bestQ.return_mean_mean.toFixed(2)}`,
        ac: `${bestAC.return_mean_mean.toFixed(2)}`,
        winner: 'q',
      },
      {
        criterion: 'Worst final return',
        q: `${worstQ.return_mean_mean.toFixed(2)}`,
        ac: `${worstAC.return_mean_mean.toFixed(2)}`,
        winner: 'ac',
      },
      {
        criterion: 'Seed std — best config',
        q: `${bestQ.return_mean_std.toFixed(2)}`,
        ac: `${bestAC.return_mean_std.toFixed(2)}`,
        winner: bestQ.return_mean_std < bestAC.return_mean_std ? 'q' : 'ac',
      },
      {
        criterion: 'Seed std — worst config',
        q: `${worstQ.return_mean_std.toFixed(2)}`,
        ac: `${worstAC.return_mean_std.toFixed(2)}`,
        winner: 'ac',
      },
      {
        criterion: 'Success rate range',
        q: `${(d3.min(qSuccessRates) * 100).toFixed(0)}% – ${(d3.max(qSuccessRates) * 100).toFixed(0)}%`,
        ac: `${(d3.min(acSuccessRates) * 100).toFixed(0)}% – ${(d3.max(acSuccessRates) * 100).toFixed(0)}%`,
        winner: 'ac',
      },
      {
        criterion: 'Hyperparameter sensitivity',
        q: 'High — ~18 return units range',
        ac: 'Very low — <3 return units range',
        winner: 'ac',
      },
      {
        criterion: 'Hyperparameters to tune',
        q: '2 (σ, α)',
        ac: '3 (σ, α_θ, α_v)',
        winner: 'q',
      },
      {
        criterion: 'Early convergence (ep. 200)',
        q: 'Faster initial learning',
        ac: 'Slightly slower to warm up',
        winner: 'q',
      },
    ];

    const container = document.getElementById('ms-summary-container');
    if (!container) return;

    container.innerHTML = `
      <style>
        @keyframes summaryRowIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .ms-summary-table tbody tr {
          opacity: 0;
          animation: summaryRowIn 0.4s ease forwards;
        }
        .ms-summary-bottom {
          opacity: 0;
          animation: summaryRowIn 0.4s ease forwards;
        }
      </style>
      <table class="ms-summary-table">
        <thead>
          <tr>
            <th>Criterion</th>
            <th class="col-q">Q-Learning</th>
            <th class="col-ac">Actor-Critic</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map((r, i) => `
            <tr style="animation-delay:${200 + i * 100}ms">
              <td class="crit-col">${r.criterion}</td>
              <td class="col-q ${r.winner === 'q' ? 'winner' : 'loser'}">${r.q}</td>
              <td class="col-ac ${r.winner === 'ac' ? 'winner' : 'loser'}">${r.ac}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <p class="ms-summary-bottom" style="animation-delay:${200 + rows.length * 100 + 200}ms">
        <strong>Bottom line:</strong>
        Q-Learning can achieve a higher peak return with optimal tuning, but
        Actor-Critic is the <em>safer, deployment-ready</em> choice — robust across
        all hyperparameter choices and random seeds.
      </p>
    `;
  } catch (e) { console.error('slide20:', e); }
}
