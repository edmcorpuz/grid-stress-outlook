# Grid Stress Outlook — 20-minute defense script

**Team:** Soriano (leader), Corpuz, Barsomo, Nuril, Mariano.

This is a proposal defense, not a report of completed forecasting results. Speak naturally; the time windows include pauses, pointing to diagrams, and transitions. No interaction is required. Skip the optional simulator if running late.

## Running order

| Presenter | Slides | Window | Focus |
|---|---|---|---|
| Soriano (leader) | 1–3 | 00:00–04:00 | Opening, evidence, alert meaning |
| Corpuz | 4–6 | 04:00–08:00 | Gap, objectives, sources |
| Barsomo | 7–9 | 08:00–12:00 | Scale, architecture, warehouse |
| Nuril | 10–13 | 12:00–16:00 | Preparation, correlation, PCA, k-means |
| Mariano | 14–16 | 16:00–19:30 | Warning design, evaluation, conclusion |
| Shared buffer | — | 19:30–20:00 | Handoffs / recovery |

Q&A and appendix time are **not included** in the 20-minute talk. If your panel includes questions inside the same time limit, shorten the talk in rehearsal.

Start the timer when Soriano starts speaking, not when slide 2 appears. The Begin button also starts it if it has not already been started. Reset explicitly before each rehearsal.

---

## 1. See the stress. Before the shortfall.

**Soriano · Leader** · 00:00–01:10 (01:10)

Good morning, panel members. We are Soriano, Corpuz, Barsomo, Nuril, and Mariano. Our proposal is Grid Stress Pattern Analysis for Early Warning of Power Supply Shortfalls in the Philippine Power Grids.

The idea is simple: combine information about electricity supply, demand, and weather so we can study the warning signs together, rather than reading separate reports.

This is a proposed research framework, not a working forecast service. Today we will explain the problem, the data design, the analysis, and how we would test whether it really provides useful warning. The 3D map is an explanatory visual; it does not show live grid conditions.

**Stage cue:** Start the timer when you begin speaking. Introduce the team; do not explain the interface.

**Transition / handoff:** First, why is this problem worth studying?

---

## 2. Not one bad day. A recurring problem.

**Soriano · Leader** · 01:10–02:30 (01:20)

The Daily Tribune, reporting NGCP figures through the Philippine News Agency, recorded 123 Visayas grid alerts from January to September 3, 2026. That total consists of 93 yellow alerts and 30 red alerts.

These are alert counts. We are not saying that there were 123 unique days of alerts, or that every alert caused a blackout. An alert is a warning about the available supply and required reserves.

The useful message is that this is a recurring planning concern, not an isolated incident. That makes Visayas a reasonable pilot candidate for our study. We would still need a complete and consistently labeled historical dataset before making comparisons across grids.

**Stage cue:** Read only the total and the split. Pause; do not read the citation aloud.

**Transition / handoff:** To understand those alerts, let us look at the supply margin.

**References:** [1]

---

## 3. A small gap. A serious warning.

**Soriano · Leader** · 02:30–04:00 (01:30)

GMA News reported 2,468 megawatts of available capacity against a projected peak demand of 2,545 megawatts on October 20. Subtracting the two gives a negative 77-megawatt margin. The advisory placed Visayas on red alert for part of that day.

Supply also needs a safety allowance. Yellow means the operating margin cannot cover the contingency requirement. Red means supply cannot cover demand plus the regulating requirement. So red is possible even when supply is slightly above demand. It does not automatically mean that every customer loses power.

Our optional slider is only a simplified teaching model. Its four-percent regulating requirement and 150-megawatt contingency requirement are assumptions, not an NGCP operating calculation. The starting supply and demand figures are reported evidence.

**Stage cue:** Point to the −77 MW gap. Optional: move available capacity to 2,700 MW, then reset. Skip the demo if behind time.

**Transition / handoff:** Corpuz will explain the information gap and the data we propose to combine.

**References:** [2]

---

## 4. The signals exist. The view is fragmented.

**Corpuz** · 04:00–05:15 (01:15)

Thank you, Soriano. The challenge we address is bringing different signals together. A grid advisory may be a PDF, market observations may be interval tables, and weather readings may come from separate stations.

Each source answers part of the question, but their names, timestamps, and formats do not necessarily line up. A number is difficult to interpret if we cannot tell which grid and period it belongs to, or whether it was available at the time a warning would have been issued.

We propose a traceable integration for this study. We are not claiming that NGCP or other organizations have no existing forecasting tools. Establishing that broader research gap would require a separate review of operational systems and literature.

**Stage cue:** Use the three signal groups as your speaking guide. No interaction is needed.

**Transition / handoff:** This gives us one main objective and three analytical questions.

---

## 5. One objective. An earlier, clearer view.

**Corpuz** · 05:15–06:40 (01:25)

Our general objective is to design and evaluate a framework that integrates grid, market, and weather data to identify stress patterns and investigate early-warning signals.

We ask three analytical questions. First, which variables move with grid stress, and do any of them provide useful earlier information? Second, can we summarize overlapping variables without losing too much information? Third, are there recurring types of stress days, such as high-demand days or supply-loss days?

Correlation, principal component analysis, and clustering address those questions. A fourth engineering objective supports all three: build traceable storage and warehouse tables. The phrase early warning describes the research goal. It is not yet an achieved three-day prediction result.

**Stage cue:** Point to each question once. Avoid introducing all the tool names twice.

**Transition / handoff:** To answer those questions, we need four complementary sources.

---

## 6. Four sources. One shared clock.

**Corpuz** · 06:40–08:00 (01:20)

NGCP advisories describe alert periods and reported grid conditions. IEMOP market data provides interval observations such as demand and prices. DOE publications help identify plants and their characteristics. PAGASA contributes weather information.

We would map these sources onto a shared Philippine time convention, while preserving their original timestamps and publication times. A five-minute market interval does not mean that every source publishes fresh data every five minutes.

Public reports can support a retrospective pilot, subject to availability and terms of use. More detailed or timely feeds may require agreements. We will not assume there is a public real-time API for every source. The first implementation task is a data inventory: what exists, at what resolution, with what delay and permission?

**Stage cue:** Emphasize “publication time” and “access.” These are likely panel questions.

**Transition / handoff:** Barsomo will now show how we would store and organize those sources.

---

## 7. Small intervals. A growing workload.

**Barsomo** · 08:00–09:10 (01:10)

Thank you, Corpuz. The enhanced WESM uses five-minute dispatch and settlement intervals. At that resolution, one non-leap year contains 105,120 intervals per series.

For an illustrative case with 300 units and 12 measures, that gives about 378 million scalar values per year. These are values, not necessarily rows. In a wide table with 12 measure columns, the same example is about 31.5 million unit-interval rows.

The workload also includes parsing reports, joining sources, and recomputing rolling features. This motivates testing scalable tools, but it does not prove that a single machine cannot handle the data. We would benchmark the actual dataset and use distributed processing only when the measured workload justifies it.

**Stage cue:** Say “values, not rows.” Do not compare the scalar count with an Excel row limit.

**Transition / handoff:** Our design separates original records from cleaned and analysis-ready data.

**References:** [3]

---

## 8. Keep the original. Build trust in layers.

**Barsomo** · 09:10–10:40 (01:30)

Think of the lakehouse as three shelves. Raw holds what we actually received. Clean holds standardized and checked records. Curated holds the tables and features used for analysis.

We propose object storage such as S3, Parquet files, and Delta tables where transactional versioning is needed. Airflow schedules batch collection and validation. Spark is a candidate for larger transformations. Kafka and streaming processing are optional later, only if an authorized timely feed exists.

Every derived record should preserve a source reference, ingestion time, and transformation version. This lets us answer where a result came from and reproduce it. Retrying a job is not enough to guarantee no data loss: retention, checkpoints, idempotent writes, and reconciliation all matter. Starting batch-first makes the pilot more realistic and easier to audit.

**Stage cue:** Use Raw → Clean → Curated as the explanation. Avoid a tool-by-tool lecture.

**Transition / handoff:** On top of those layers, the warehouse needs a very clear grain.

---

## 9. One row. One grid. One interval.

**Barsomo** · 10:40–12:00 (01:20)

The grain of fact_grid_interval is one grid at one five-minute interval, when we have valid observations at that resolution. It contains measures such as demand, available capacity, imports, and price, with reserve margin derived where appropriate.

Grid and time dimensions support filtering and aggregation. Alerts and plant outages are separate fact tables because an event window or a plant outage is not the same thing as a grid interval. Shared dimensions let us analyze them together without multiplying rows accidentally.

A daily advisory cannot simply be copied across the day and treated as measured five-minute telemetry. We retain source resolution, valid time, and missingness. For analysis, we aggregate available observations into grid-day features. The appendix explains the table grain and example OLAP operations if you would like more detail.

**Stage cue:** Memorize the grain. This is the most important warehouse answer.

**Transition / handoff:** Nuril will explain how we prepare the data and discover stress patterns.

---

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

---

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

# Optional appendix responses

## 17. Different facts. Different grains.

**Barsomo** · Q&A only

Use dim_grid, dim_time, dim_date, dim_plant, and source metadata as appropriate to each fact. Do not attach a plant dimension directly to a grid-level fact as if the grain were plant-level.

Aggregate facts to a compatible grain before joining. Roll up grid-day events to month, drill down to event windows, slice Visayas, or dice a grid set and date range. Sum only additive measures: prices and capacity snapshots generally require suitable averages, weighted aggregation, or point-in-time handling.

**Stage cue:** Answer the specific grain or OLAP question; do not present the entire appendix.

**Transition / handoff:** Return to the closing slide when finished.

---

## 18. Define success before testing.

**Mariano** · Q&A only

Define eligible alerts, merge repeated warning episodes, and specify the matching window before evaluation. Report each metric by grid, season, and horizon with uncertainty. Targets require stakeholder agreement and may be revised.

The false-warning share is one minus episode-level precision, not the classical false-positive rate. Do not pool different horizons or repeatedly count the same event to inflate performance. Freshness is source-specific; a five-minute scoring schedule does not make daily advisories five-minute fresh.

**Stage cue:** Explain the denominator. That prevents most metric misunderstandings.

**Transition / handoff:** Return to the closing slide when finished.

---

## 19. Clear boundaries. Credible research.

**Corpuz** · Q&A only

Use public aggregate data first. Seek agreements before accessing restricted plant or market information. Current scope does not require personal data. A smart-meter extension would need a separate privacy and legal review, including the Data Privacy Act of 2012.

Begin with a retrospective Visayas pilot. Benchmark a simple local analytical baseline before provisioning a cluster. Monitor missingness, failed jobs, feature drift, and warning quality. Refresh models only after evaluating the change; seasonal retraining is a candidate schedule, not a guarantee.

**Stage cue:** Acknowledge a limitation directly, then explain how the pilot tests or mitigates it.

**Transition / handoff:** Return to the closing slide when finished.

---

## 20. The short answer. Then the evidence.

**Soriano · Leader** · Q&A only

Soriano coordinates questions and routes data access to Corpuz, architecture to Barsomo, methods to Nuril, and validation to Mariano.

If the panel requests results, explain that this is a proposal and no fitted dataset results are claimed. Avoid inventing a coefficient, cluster score, runtime improvement, or alert probability.

**Stage cue:** Let the assigned presenter answer. Do not have all five speak at once.

**Transition / handoff:** Return to the closing slide when finished.

---

## 21. Know the source. Keep the distinction.

**Soriano · Leader** · Q&A only

Sources are secondary reports or an industry article, not a complete operational dataset. Build a verified primary-source data inventory before implementation.

Full references and design/data attribution are included in docs/SOURCES.md. The original 24-slide files are preserved in originals/ for comparison.

**Stage cue:** Open a citation only if asked. Do not depend on internet access during the explanation.

**Transition / handoff:** Return to the closing slide when finished.

**References:** [1], [2], [3]

