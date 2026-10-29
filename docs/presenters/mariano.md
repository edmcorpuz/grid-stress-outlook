# Mariano

Your segment of the 20-minute defense. Full running order: [PRESENTATION-SCRIPT.md](../PRESENTATION-SCRIPT.md).

## 14. From a pattern to a testable warning.

**Mariano** · 16:00–17:25 (01:25)

Thank you, Nuril. The proposed output is an outlook that shows a target grid, a future time window, the main contributing signals, and the freshness of the evidence.

There is an important missing step between clustering and forecasting. At each issue time, we must use only information available then. Candidate inputs include lagged observations and weather or demand forecasts if access is available. We then train or calibrate a rule relating those features and stress profiles to later alerts.

For historical backtesting, we need archived forecasts as issued—not the weather that actually happened later. If those archives are unavailable, we must narrow the claim to an observation-based warning or retrospective analysis. This screen is a concept only; it does not calculate a probability or send a real warning.

**Stage cue:** Point to the issue-time and freshness labels. Do not promise a seven-day forecast.

**Transition / handoff:** We will judge the warning against simple baselines on unseen periods.

---

## 15. Prove the value. Before promising it.

**Mariano** · 17:25–18:50 (01:25)

We would use rolling chronological backtests. Earlier data fits the transformations and model; a validation period sets warning thresholds; a later test period remains untouched until evaluation.

We compare against simple baselines, such as persistence and a reserve-margin rule, with the same data availability and warning horizon. Our proposed targets are to catch at least 80 percent of alert events, keep the false-warning share below 20 percent, and investigate a three-day lead time. These are aspirations to discuss during the pilot, not measured performance.

We must define what counts as an event and how repeated warnings match it. We also report uncertainty, missed events, and actual data freshness by source. Restricted data, rare alerts, seasonal change, and publication delays remain limitations. Initial outputs should support authorized human review, not replace NGCP advisories.

**Stage cue:** The appendix defines recall, false-warning share, and lead time. Keep those formulas out of the main explanation.

**Transition / handoff:** That brings us back to the central idea.

---

## 16. Connected evidence. Better preparation.

**Mariano** · 18:50–19:30 (00:40)

To conclude: the reported alerts show why grid stress matters. Our proposal connects fragmented grid, market, and weather information in a traceable lakehouse and warehouse.

Correlation, PCA, and clustering help us investigate relationships and recurring patterns. A separate, time-aware warning rule and honest validation determine whether those patterns actually help us prepare earlier.

Our goal is not to replace the grid operator or promise that we can prevent a blackout. It is to build and test a clearer evidence base for earlier preparation. Thank you. We welcome your questions.

**Stage cue:** Stop the timer. Leave this slide up for questions; open the appendix only when needed.

**Transition / handoff:** End of main presentation. Thirty seconds are reserved for transitions or recovery.

