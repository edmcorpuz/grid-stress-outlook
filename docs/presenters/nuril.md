# Nuril

Your segment of the 20-minute defense. Full running order: [PRESENTATION-SCRIPT.md](../PRESENTATION-SCRIPT.md).

## 10. Good analysis starts before the algorithm.

**Nuril** · 12:00–13:00 (01:00)

Thank you, Barsomo. We first standardize names, units, and timestamps. We remove duplicates and flag missing intervals. Any short-gap filling must be documented, and we should not fill across major outage events without justification.

Next, we build features such as supply margin, unavailable capacity, demand changes, and weather summaries. We distinguish observation time from publication time: a value recorded yesterday but published tomorrow is not available for a warning today.

Finally, we split the history chronologically. Scaling, imputation, PCA, and clustering are fitted only on the training period. This avoids data leakage and makes the later evaluation closer to a real deployment.

**Stage cue:** Emphasize the difference between observation time and publication time.

**Transition / handoff:** The first analytical step asks which signals move together.

---

## 11. What moves together? And what comes first?

**Nuril** · 13:00–14:00 (01:00)

Correlation measures how variables move together. Pearson is useful for linear relationships, while Spearman compares ranked values and can capture monotonic relationships.

We also examine lags: for example, whether information available earlier is associated with stress later. We would account for seasonality and autocorrelation, because repeated daily patterns can produce misleading relationships.

A strong correlation does not prove that a factor caused an alert, and searching many lags can overfit. We therefore treat discovered relationships as candidates to test on later, unseen periods. We are not displaying an invented coefficient or claiming that a three-day signal has already been found.

**Stage cue:** If asked for a correlation value, say it will be estimated from the real dataset.

**Transition / handoff:** Several signals may overlap. PCA helps us summarize that overlap.

---

## 12. Many measurements. Fewer dimensions.

**Nuril** · 14:00–15:00 (01:00)

Principal component analysis, or PCA, creates new axes that summarize variation across standardized variables. It is useful when several measurements contain overlapping information.

We inspect the component loadings to understand what contributes to each axis. A name such as heat-driven demand would be an interpretation after fitting, not a label we force onto the result.

An 80-to-90-percent explained-variance threshold can be a starting heuristic, but high variance is not the same as predictive value. A low-variance signal could still matter for alerts. The points on screen are synthetic and illustrate dimensional structure; they are not a fitted result from Philippine grid data.

**Stage cue:** Use “summary axes” if the panel wants a simpler explanation.

**Transition / handoff:** We can then explore whether days form recurring groups in that space.

---

## 13. Find patterns. Not predetermined labels.

**Nuril** · 15:00–16:00 (01:00)

K-means groups days that are close in the selected feature or component space. The four groups shown are illustrative. We have not established that the real data contains exactly four clusters.

After fitting, we would inspect each cluster’s feature patterns. We might find calm days, high-demand days, supply-loss days, or mixed conditions. We choose the number of clusters using several checks, not only an elbow chart, and test whether the groups remain stable across seasons.

Clustering does not predict a future day by itself. We must define how information available today creates a warning and test that rule against future outcomes. Mariano will explain that bridge and how we will judge success.

**Stage cue:** Let the clusters illustrate similarity. Do not describe the animation as a real training run.

**Transition / handoff:** Mariano will connect these patterns to a testable warning proposal.

