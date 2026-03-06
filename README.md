# Q-Learning vs Policy Gradient — Presentation Website

An interactive, single-page academic presentation built to showcase the results of a Reinforcement Learning course project comparing **Q-Learning** and **Policy Gradient (Actor-Critic)** with RBF function approximation on the **MountainCar-v0** environment.

> **This repository is the presentation layer only.**
> The actual implementation, experiments, logs, and analysis live here:
> **[hehesam/Reinforcement-Learning-and-Sequential-Prediction-Course-Project](https://github.com/hehesam/Reinforcement-Learning-and-Sequential-Prediction-Course-Project)**

---

## What this site covers

18 horizontal slides walking through:

- Problem setup — MountainCar continuous state space and the challenge it poses
- Algorithm background — Q-Learning and Actor-Critic with RBF feature approximation
- Experiment 1 — effect of different RBF grid sizes (5×5, 7×7, 10×10) on learning
- Experiment 2 — head-to-head comparison over 2 000 episodes
- Multi-seed study — 60 total runs (5 seeds × 12 configurations) for statistical robustness
- Hyperparameter sensitivity heatmaps, performance-vs-stability scatter plots, and success-rate curves
- Summary of findings

## Tech stack

| Tool | Purpose |
|------|---------|
| Vanilla HTML / CSS / JS (ES modules) | No build step required |
| [D3.js v7](https://d3js.org/) | All charts and visualizations |
| [KaTeX](https://katex.org/) | Math equation rendering |
| CSS scroll-snap | Horizontal slide navigation |

## Running locally

```bash
python -m http.server 8080
# then open http://localhost:8080
```

Any static file server works — no Node.js or build tools needed.
