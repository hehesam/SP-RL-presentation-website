/* ============================================================
   MULTISEED-DATA.JS — Singleton loader for multi-seed experiment data
   Loads Q_multi_seed_summary.json & ac_multi_seed_summary.json once
   and caches the result for all slides.
   ============================================================ */

let _promise = null;

export function loadMultiseedData() {
  if (_promise) return _promise;
  _promise = Promise.all([
    d3.json('logs/MultiSeed/Q_multi_seed_summary.json'),
    d3.json('logs/MultiSeed/ac_multi_seed_summary.json'),
  ]).then(([qData, acData]) => {
    const bestQ  = qData.reduce((a, b) => b.return_mean_mean > a.return_mean_mean ? b : a);
    const worstQ = qData.reduce((a, b) => b.return_mean_mean < a.return_mean_mean ? b : a);
    const bestAC = acData.reduce((a, b) => b.return_mean_mean > a.return_mean_mean ? b : a);
    const worstAC = acData.reduce((a, b) => b.return_mean_mean < a.return_mean_mean ? b : a);
    return { qData, acData, bestQ, worstQ, bestAC, worstAC };
  });
  return _promise;
}

/* ---- colour palettes (matching the Analysis notebook) ---- */
export const Q_COLORS  = ['#1f77b4', '#aec7e8', '#17becf', '#9edae5'];
export const AC_COLORS = ['#d62728', '#ff7f0e', '#e377c2', '#bcbd22',
                          '#9467bd', '#8c564b', '#2ca02c', '#98df8a'];

export function qLabel(cfg)  { return `σ=${cfg.sigma}, α=${cfg.alpha}`; }
export function acLabel(cfg) { return `σ=${cfg.sigma}, α_θ=${cfg.alpha_theta}, α_v=${cfg.alpha_v}`; }

/* ---- extract history arrays ---- */
export function extractHistory(cfg, meanKey, stdKey) {
  const eps  = cfg.history.map(h => h.episode);
  const mean = cfg.history.map(h => h[meanKey]);
  const std  = cfg.history.map(h => h[stdKey]);
  return eps.map((e, i) => ({ e, m: mean[i], s: std[i] }));
}

/* ---- normalise metric to [0,1] for radar chart ---- */
export function normReturn(v)    { return Math.min(1, Math.max(0, (v + 200) / 100)); }
export function normStability(v) { return Math.max(0, 1 - v / 15); }
export function normSteps(v)     { return Math.max(0, Math.min(1, (200 - v) / 100)); }
export function earlySuccess(cfg) {
  const h = cfg.history.find(h => h.episode === 200);
  return h ? h.success_rate_mean : 0;
}
