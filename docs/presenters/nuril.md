# Nuril

Your segment of the 20-minute defense. Full running order: [PRESENTATION-SCRIPT.md](../PRESENTATION-SCRIPT.md).

## 12. What moves together? And what comes first?

*Part 7 of 9 · Exploration and analysis*

**Nuril** · 12:00–13:20 (01:20)

Thank you, Barsomo. Our first method is correlation. Pearson measures straight-line relationships; Spearman compares rankings and catches relationships that are not straight lines.

We also check lags: does something observed earlier move with stress later? We account for seasons and daily cycles, which can create misleading matches.

Why this method: it is a simple, transparent first screen. A strong correlation is a candidate signal, not proof of cause, and we test candidates on later, unseen periods. The waves on screen are synthetic.

**Stage cue:** If asked for a correlation value, say it will be estimated from the real data.

**Transition / handoff:** Many of these signals overlap. PCA helps with that.

---

## 13. Many signals. A few directions.

*Part 7 of 9 · Exploration and analysis*

**Nuril** · 13:20–14:40 (01:20)

Principal component analysis, or PCA, combines overlapping measurements into a few new summary axes, called components.

We read the loadings to see which variables drive each component. A name like “heat-driven demand” is something we would interpret after fitting, not a label we force.

Why this method: it reduces redundancy so later steps are clearer. An 80 to 90 percent explained-variance threshold is a starting guide, but we also check that the components keep information that matters for alerts. The points are synthetic.

**Stage cue:** Say “summary axes” if the panel wants a simpler explanation.

**Transition / handoff:** In that summary space, we can look for groups of similar days.

---

## 14. Stress has types. Let the data name them.

*Part 7 of 9 · Exploration and analysis*

**Nuril** · 14:40–16:00 (01:20)

k-means groups grid-days that look alike. The four groups on screen are an illustration; we have not shown that the real data has exactly four.

After fitting, we would describe each group, for example calm days, high-demand days, supply-loss days or combined stress. We choose the number of groups using several checks, such as the elbow, silhouette scores and stability across seasons.

Why this method: it is an interpretable way to find recurring stress profiles, which we can then compare with later alert rates. Clustering on its own does not predict tomorrow. Mariano will explain that next step.

**Stage cue:** Do not describe the animation as a real training run.

**Transition / handoff:** Mariano will connect these patterns to a warning we can test.

