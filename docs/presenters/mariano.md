# Mariano

Your segment of the 20-minute defense. Full running order: [PRESENTATION-SCRIPT.md](../PRESENTATION-SCRIPT.md).

## 15. A warning you can test.

*Part 8 of 9 · Expected outcome and implementation*

**Mariano** · 16:00–17:25 (01:25)

Thank you, Nuril. The expected outcome is a hypothetical Grid Stress Outlook for planners: for each grid and future time window, it shows the stress level, the main drivers, and how fresh each data source is.

A warning rule may only use information available when the warning is issued, such as recent observations and authorized forecasts. We test it with rolling backtests: train on earlier periods, test on later ones, and compare against simple baselines like a reserve-margin rule.

Our targets are to catch at least 80 percent of alert events, keep false warnings under 20 percent, and investigate a three-day lead time. These are goals for a pilot, not results. Once running, we would monitor data freshness, failed jobs and warning quality, with human review of every warning.

**Stage cue:** Say clearly: “targets, not results.” Do not promise a seven-day forecast.

**Transition / handoff:** We are just as clear about the limits.

---

## 16. Clear limits. Honest safeguards.

*Part 8 of 9 · Expected outcome and implementation*

**Mariano** · 17:25–18:35 (01:10)

Limitations: some feeds are restricted or late, names are inconsistent, and archived forecasts may be missing. Alerts are rare, seasons change, and results depend on scaling and the number of clusters.

Ethics and privacy: our scope uses public, aggregate grid data, not personal data. A future smart-meter extension would need its own privacy review under the Data Privacy Act of 2012. We would use access controls, encryption and audit logs.

Implementation challenges include data agreements, cost and skills. Warnings support NGCP advisories and human decisions; they do not replace them.

**Stage cue:** Name each limit directly, then say how the pilot tests or reduces it.

**Transition / handoff:** That brings us to our conclusion.

---

## 17. Connected evidence. Better preparation.

*Part 9 of 9 · Conclusion*

**Mariano** · 18:35–19:30 (00:55)

To conclude: the reported alerts show that grid stress is a recurring problem. Our proposal connects scattered grid, market and weather data in a traceable lakehouse and warehouse.

Correlation, PCA and clustering help us find relationships and recurring stress patterns. A separate, time-aware warning rule and honest testing decide whether those patterns really help people prepare earlier.

We are not replacing the grid operator or promising to prevent blackouts. We want to build and test a clearer evidence base for earlier preparation. Thank you, and we welcome your questions.

**Stage cue:** Stop the timer. Leave this slide up for questions; open the appendix only when asked.

**Transition / handoff:** End of the main presentation. Thirty seconds are reserved for transitions.

