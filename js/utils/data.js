/* ============================================================
   DATA.JS — Centralized placeholder data for all slides
   ============================================================
   
   HOW TO UPDATE:
   Each exported constant contains PLACEHOLDER data.
   Search for "PLACEHOLDER" comments to find values to replace
   with your actual experiment results.
   
   Data shapes are documented inline for each export.
   ============================================================ */

// ---- helpers to generate placeholder curves ----
function generateCurve(n, startVal, endVal, noise, seed = 42) {
  const pts = [];
  let rng = seed;
  const rnd = () => { rng = (rng * 16807) % 2147483647; return (rng - 1) / 2147483646; };
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const base = startVal + (endVal - startVal) * (1 - Math.exp(-3 * t));
    pts.push({
      episode: i * (1000 / (n - 1)),
      mean: base + (rnd() - 0.5) * noise,
    });
  }
  // smooth
  for (let i = 1; i < pts.length - 1; i++) {
    pts[i].mean = (pts[i - 1].mean + pts[i].mean + pts[i + 1].mean) / 3;
  }
  // add confidence bands
  pts.forEach(p => {
    const band = noise * 0.6;
    p.upper = p.mean + band;
    p.lower = p.mean - band;
  });
  return pts;
}

/* ============================================================
   SLIDE 7 — RBF Centers
   ============================================================ */
// PLACEHOLDER: Replace grid size (7×7 = 49 centers) with your actual grid
export const RBF_GRID_SIZE = 7; // number of centers per dimension
export const RBF_SIGMA = 0.15;  // PLACEHOLDER: replace with actual σ

export function generateRBFCenters(gridSize = RBF_GRID_SIZE) {
  const centers = [];
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      centers.push({
        x: i / (gridSize - 1), // normalized position [0,1]
        y: j / (gridSize - 1), // normalized velocity [0,1]
      });
    }
  }
  return centers;
}

/* ============================================================
   SLIDE 9 — Experimental Setup
   ============================================================ */
// PLACEHOLDER: Replace these values with your actual experimental settings
export const SETUP_INFO = [
  { label: 'Environment',      value: 'MountainCar-v0',  icon: '🏔' },
  { label: 'Episode Limit',    value: '200 steps',       icon: '⏱' },
  { label: 'Training Episodes', value: '1000',            icon: '📊' },
  { label: 'Eval Frequency',   value: 'Every 10 ep.',    icon: '📏' },
  { label: 'Random Seeds',     value: '5 seeds',         icon: '🎲' },
  { label: 'Success Condition', value: 'pos ≥ 0.5',      icon: '🏁' },
];

/* ============================================================
   SLIDE 12 — Hyperparameter Heatmaps
   ============================================================ */
// PLACEHOLDER: Replace with actual grid search results
// Shape: { sigmas: number[], alphas: number[], values: number[][] }
export const HEATMAP_QLEARNING = {
  rowLabels: ['σ=0.05', 'σ=0.10', 'σ=0.15', 'σ=0.20', 'σ=0.25'],
  colLabels: ['α=0.01', 'α=0.05', 'α=0.10', 'α=0.20', 'α=0.50'],
  // values[row][col] = average return after training
  values: [
    [-180, -165, -155, -170, -195],
    [-160, -140, -120, -135, -175],
    [-150, -125, -105, -115, -160],
    [-155, -130, -110, -120, -165],
    [-170, -150, -135, -145, -180],
  ],
};

// PLACEHOLDER: Replace with actual actor-critic grid search results
export const HEATMAP_ACTOR_CRITIC = {
  rowLabels: ['αθ=0.001', 'αθ=0.005', 'αθ=0.010', 'αθ=0.020', 'αθ=0.050'],
  colLabels: ['αw=0.01', 'αw=0.05', 'αw=0.10', 'αw=0.20', 'αw=0.50'],
  values: [
    [-185, -170, -160, -165, -190],
    [-165, -145, -130, -140, -180],
    [-155, -130, -115, -125, -170],
    [-160, -138, -120, -130, -175],
    [-175, -155, -140, -150, -185],
  ],
};

/* ============================================================
   SLIDE 13 — Learning Curves
   ============================================================ */
// PLACEHOLDER: Replace with actual training curves
// Shape: Array of { episode, mean, upper, lower }
export const LEARNING_CURVES = {
  // Evaluation return vs training episodes
  returnQL:  generateCurve(50, -200, -105, 20, 42),
  returnAC:  generateCurve(50, -200, -115, 25, 99),
  // Success rate vs training episodes  
  successQL: generateCurve(50, 0, 0.85, 0.12, 77),
  successAC: generateCurve(50, 0, 0.75, 0.15, 33),
};

/* ============================================================
   SLIDE 14 — Final Results
   ============================================================ */
// PLACEHOLDER: Replace with actual final metric values
// Shape: Array of { metric, qlearning, actorcritic }
export const FINAL_RESULTS = [
  { metric: 'Final Return',   qlearning: -108, actorcritic: -118 },
  { metric: 'Success Rate',   qlearning: 0.84, actorcritic: 0.74 },
  { metric: 'Steps to Goal',  qlearning: 108,  actorcritic: 118  },
];

/* ============================================================
   SLIDE 15 — Interpretation / Comparison Scores
   ============================================================ */
// PLACEHOLDER: Replace with your qualitative assessment scores (0–1)
export const COMPARISON_SCORES = {
  dimensions: ['Convergence\nSpeed', 'Final\nPerformance', 'Stability', 'Sample\nEfficiency'],
  qlearning:    [0.70, 0.85, 0.65, 0.75],
  actorcritic:  [0.75, 0.72, 0.80, 0.60],
};
