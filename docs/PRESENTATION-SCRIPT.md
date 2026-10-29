# Grid Stress Outlook — 20-minute defense script

**Team:** Soriano (leader), Corpuz, Barsomo, Nuril, Mariano.

This is a proposal defense, not a report of completed forecasting results. Speak naturally; the time windows include pauses, pointing to diagrams, and transitions. No interaction is required. Skip the optional what-if slider if running late.

## Running order

| Presenter | Slides | Window | Focus |
|---|---|---|---|
| Soriano (leader) | 1–5 | 00:00–04:00 | Introduction, why big data, 123 alerts, the −77 MW gap |
| Corpuz | 6–8 | 04:00–08:00 | Problem statement, objectives, data sources |
| Barsomo | 9–11 | 08:00–12:00 | Ingestion and storage, warehouse, preprocessing |
| Nuril | 12–14 | 12:00–16:00 | Correlation, PCA, k-means |
| Mariano | 15–17 | 16:00–19:30 | Expected outcome, limits and ethics, conclusion |
| Shared buffer | — | 19:30–20:00 | Handoffs / recovery |

## The nine-part format

The main talk follows the required presentation format, in order, with nothing added:

1. **Introduction** — slides 1–3 (Soriano)
2. **Statement of the problem** — slides 4–6 (Soriano, Corpuz)
3. **Objectives and research questions** — slide 7 (Corpuz)
4. **Data source and characteristics** — slide 8 (Corpuz)
5. **Data ingestion and storage** — slides 9–10 (Barsomo)
6. **Data preprocessing** — slide 11 (Barsomo)
7. **Exploration and analysis** — slides 12–14 (Nuril)
8. **Expected outcome and implementation** — slides 15–16 (Mariano)
9. **Conclusion** — slide 17 (Mariano)

Q&A and appendix time are **not included** in the 20-minute talk. If your panel includes questions inside the same time limit, shorten the talk in rehearsal.

Start the timer when Soriano starts speaking, not when slide 2 appears. The Begin button also starts it if it has not already been started. Reset explicitly before each rehearsal.

---

## 1. See the stress. Before the shortfall.

*Part 1 of 9 · Introduction*

**Soriano · Leader** · 00:00–00:40 (00:40)

Good morning, panel members. We are Group 3: Soriano, Corpuz, Barsomo, Nuril and Mariano. Our proposal is Grid Stress Pattern Analysis for Early Warning of Power Supply Shortfalls in the Philippine Power Grids.

In one sentence: we propose combining grid, market and weather data so the warning signs of a supply shortfall can be studied together, instead of in separate reports.

This is a research proposal, not a working forecast service. The 3D scenes are illustrations; they do not show live grid data.

**Stage cue:** Start the timer as you begin. Introduce the team; do not explain the interface.

**Transition / handoff:** First, the field we are working in.

---

## 2. Supply must meet demand. Every second.

*Part 1 of 9 · Introduction*

**Soriano · Leader** · 00:40–01:30 (00:50)

Our field is energy and power systems analytics: studying how electricity is generated, transmitted and used so the grid stays balanced.

Power plants generate electricity. NGCP operates the high-voltage grid across Luzon, Visayas and Mindanao. Distribution utilities and electric cooperatives deliver it to homes and businesses. DOE sets policy, ERC regulates, and IEMOP runs the electricity spot market.

The basic rule is simple: supply must cover demand at every moment, plus a safety reserve. When that reserve gets too thin, NGCP raises a yellow or red alert.

**Stage cue:** Point to the three glowing grids as you name them.

**Transition / handoff:** This field produces a lot of data, very quickly.

---

## 3. A data machine. Every five minutes.

*Part 1 of 9 · Introduction*

**Soriano · Leader** · 01:30–02:20 (00:50)

Why is this a big data problem? Since 2021, the enhanced spot market dispatches and settles every five minutes. That is 288 intervals a day and 105,120 a year for a single data series.

Take an example of 300 generating units with 12 measures each. That is about 378 million values a year. These are values, not rows; in a table with 12 measure columns it is about 31.5 million rows.

Add weather, outage reports and several years of history, and we have volume, speed and variety at the same time. We would still measure the real dataset before deciding how much distributed processing it needs.

**Stage cue:** Say “values, not rows.” Do not compare the number with Excel.

**Transition / handoff:** And this data matters, because the grid is under real stress.

**References:** [3]

---

## 4. Not one bad day. A recurring problem.

*Part 2 of 9 · Statement of the problem*

**Soriano · Leader** · 02:20–03:10 (00:50)

Now the problem. NGCP figures reported by the Daily Tribune show 123 Visayas grid alerts from January to September 3, 2026: 93 yellow and 30 red.

These are alert counts. They are not 123 separate days, and not every alert caused a blackout. An alert warns that available supply cannot cover the required reserves.

The point is that this keeps happening. That makes Visayas a sensible pilot for our study.

**Stage cue:** Read the total and the split, then pause. Do not read the citation aloud.

**Transition / handoff:** Here is what one of those alerts looks like in numbers.

**References:** [1]

---

## 5. A small gap. A serious warning.

*Part 2 of 9 · Statement of the problem*

**Soriano · Leader** · 03:10–04:00 (00:50)

On October 20, GMA News reported 2,468 megawatts available against a projected peak of 2,545 megawatts in the Visayas. That is 77 megawatts short, and the grid went on red alert for part of the day.

Yellow means the operating margin cannot cover the contingency requirement. Red means supply cannot cover demand plus the regulating requirement. So red is possible even when supply is slightly above demand, and it does not automatically mean every customer loses power.

Optional: the what-if slider is a simplified teaching model. Its 4 percent regulating and 150-megawatt contingency requirements are assumptions, not NGCP’s actual calculation.

**Stage cue:** Point to the gap at the top of the columns. Optional: drag supply to 2,700 MW to show yellow, then reset. Skip it if behind time.

**Transition / handoff:** Corpuz will explain why warnings like this are hard to see early.

**References:** [2]

---

## 6. The signals exist. They’re scattered.

*Part 2 of 9 · Statement of the problem*

**Corpuz** · 04:00–05:15 (01:15)

Thank you, Soriano. Our problem statement: the warning signs of a shortfall already exist, but they are spread across separate sources, formats and schedules.

Grid advisories, market tables and weather records use different names, time stamps and formats. They are mostly read after the fact, and alerts are usually announced on the day itself.

NGCP and DOE do publish supply outlooks, so we are not claiming nothing exists. What is missing for our study is one traceable, combined view that lets us test whether patterns in this data give useful early warning.

**Stage cue:** Use the three signal groups as your speaking guide.

**Transition / handoff:** That gives us one objective and three questions.

---

## 7. One objective. Three questions.

*Part 3 of 9 · Objectives and research questions*

**Corpuz** · 05:15–06:35 (01:20)

Our general objective is to design and evaluate a framework that combines grid, market and weather data to find grid-stress patterns and test possible early-warning signals.

Three questions guide the analysis. First, which signals move with stress, and do any move earlier? We answer that with correlation. Second, can a few factors summarize many overlapping signals? That is PCA. Third, which types of stress days repeat? That is clustering.

A supporting objective is engineering: build traceable storage and warehouse tables so every result can be checked. “Early warning” is our research goal, not a result we have already achieved.

**Stage cue:** Point to each question once. Name each method only once.

**Transition / handoff:** To answer them, we need four sources.

---

## 8. Four sources. One shared clock.

*Part 4 of 9 · Data source and characteristics*

**Corpuz** · 06:35–08:00 (01:25)

NGCP advisories give alert periods and reported grid conditions. IEMOP market data gives five-minute observations such as demand and prices, plus day-ahead and week-ahead projections. DOE’s list of existing power plants is a PDF updated from time to time. PAGASA weather data is mostly daily and is often provided as Excel files on request.

So the sources differ in format, frequency and access. We would line them up on one Philippine time standard while keeping each source’s original time stamp and publication time. Five-minute market data does not make daily weather five-minute fresh.

Public reports can support a first, retrospective pilot. More detailed or timely feeds would need data agreements. Our first task is an inventory: what exists, how often, how late, and with what permission.

**Stage cue:** Stress “publication time” and “access.” These are likely panel questions.

**Transition / handoff:** Barsomo will show how we would store these sources.

---

## 9. Keep the original. Build trust in layers.

*Part 5 of 9 · Data ingestion and storage*

**Barsomo** · 08:00–09:25 (01:25)

Thank you, Corpuz. For ingestion, we start batch-first: Airflow collects files on a schedule and checks them on arrival. Kafka streaming is optional later, only if an authorized real-time feed exists.

For storage, think of a lakehouse as three shelves. Raw keeps exactly what we received. Clean holds standardized, checked records. Curated holds analysis-ready tables. We propose object storage such as S3, Parquet files and Delta tables, with Spark as a candidate for large transformations.

Every record keeps its source, load time and processing version, so any result can be traced back to the original file and reproduced.

**Stage cue:** Explain Raw → Clean → Curated. Avoid a tool-by-tool lecture.

**Transition / handoff:** On top of the curated layer sits the warehouse.

---

## 10. One row. One grid. Five minutes.

*Part 5 of 9 · Data ingestion and storage*

**Barsomo** · 09:25–10:50 (01:25)

The warehouse uses a star schema. The main fact table, fact_grid_interval, has one row per grid per five-minute interval, where real observations support that level. It holds demand, available capacity, imports, price and the derived margin.

Grid and time dimensions let us filter and summarize. Alerts and plant outages are separate fact tables, because an alert window or an outage is not the same thing as a five-minute interval.

This supports OLAP: roll up from intervals to days or months, drill down to an alert window, slice to Visayas, or dice by grid and season. A daily advisory is never copied across a day and treated as five-minute data.

**Stage cue:** Memorize the grain. It is the most important warehouse answer.

**Transition / handoff:** Before analysis, the data has to be prepared.

---

## 11. No peeking at tomorrow.

*Part 6 of 9 · Data preprocessing*

**Barsomo** · 10:50–12:00 (01:10)

Preprocessing has three steps. First, standardize plant names, units and time stamps, remove duplicates, and flag missing intervals instead of hiding them.

Second, build features such as supply margin, unavailable capacity, demand changes and weather summaries, usually per grid per day.

Third, respect time. We split the history in order: earlier data for training, later data for testing. Scaling, gap filling, PCA and clustering are fitted on the training period only. A value recorded yesterday but published tomorrow cannot be used for a warning today.

**Stage cue:** Emphasize the difference between when data is observed and when it is published.

**Transition / handoff:** Nuril will explain how we look for patterns.

---

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

---

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

# Optional appendix responses

## 18. Different facts. Different grains.

*Appendix A · Warehouse grains*

**Barsomo** · Q&A only

Use dim_grid, dim_time, dim_date, dim_plant and source metadata as appropriate to each fact. Do not attach a plant dimension directly to a grid-level fact as if the grain were plant-level.

Aggregate facts to a compatible grain before joining. Roll up grid-days to months, drill down to alert windows, slice Visayas, or dice a set of grids and dates. Sum only additive measures: prices and capacity snapshots need averages, weighting or point-in-time handling.

**Stage cue:** Answer the specific grain or OLAP question; do not present the whole appendix.

**Transition / handoff:** Return to the closing slide when finished.

---

## 19. Define success before testing.

*Appendix B · Validation metrics*

**Mariano** · Q&A only

Define eligible alerts, merge repeated warning episodes, and fix the matching window before evaluation. Report each metric by grid, season and horizon, with uncertainty. Targets need stakeholder agreement and may change.

The false-warning share is one minus episode-level precision, not the classical false-positive rate. Do not pool different horizons or count the same event twice. Freshness is source-specific: scoring every five minutes does not make daily advisories five-minute fresh.

**Stage cue:** Explain the denominator. That prevents most metric misunderstandings.

**Transition / handoff:** Return to the closing slide when finished.

---

## 20. The short answer. Then the evidence.

*Appendix C · Quick answers*

**Soriano · Leader** · Q&A only

Soriano coordinates questions and routes data access to Corpuz, architecture and preprocessing to Barsomo, methods to Nuril, and validation and limits to Mariano.

If the panel asks for results, explain that this is a proposal and no fitted results are claimed. Never invent a coefficient, cluster score, runtime improvement or alert probability.

**Stage cue:** Let the assigned presenter answer. Do not have all five speak at once.

**Transition / handoff:** Return to the closing slide when finished.

---

## 21. Know the source. Keep the distinction.

*Appendix D · References*

**Soriano · Leader** · Q&A only

Sources are news reports and an industry article, not a complete operational dataset. Build a verified primary-source data inventory before implementation.

Full references and attribution are in docs/SOURCES.md. The original 24-slide files are preserved in originals/ for comparison.

**Stage cue:** Open a citation only if asked. Do not depend on internet access during the explanation.

**Transition / handoff:** Return to the closing slide when finished.

**References:** [1], [2], [3]

