# Defense Q&A — answer first, explain second

Soriano coordinates. Let one presenter finish before another adds detail. Do not invent results when asked for an accuracy score.

| Question | First answer | Owner |
|---|---|---|
| What exactly is your contribution? | A traceable integration and evaluation framework for exploring grid stress and testing early-warning signals. | Soriano |
| Is this already operational? | No. The implemented deliverable is this presentation; the ingestion platform and forecasting system are proposed. | Soriano |
| Why Visayas? | Its recurring reported alerts make it a reasonable pilot candidate; the count is not a cross-grid performance comparison. | Soriano |
| Is every red alert a blackout? | No. An alert concerns supply and reserve requirements; interruption depends on actual conditions and mitigation. | Soriano |
| Is your research gap really unique? | We propose a study-specific integration; we have not proven that no similar operational framework exists. | Corpuz |
| Can you get all this data? | Public reports can support a retrospective study, subject to coverage and terms. Restricted and timely feeds require access agreements. | Corpuz |
| Does five-minute market data mean five-minute freshness? | No. Observation interval and publication delay are different; freshness is tracked per source. | Corpuz |
| Why use a data lake and warehouse? | The lake preserves heterogeneous source evidence; dimensional tables serve consistent SQL and OLAP. A lakehouse can support both. | Barsomo |
| What is your main fact grain? | One grid at one five-minute interval, only where valid observations support that resolution. Alerts and plant outages have separate event grains. | Barsomo |
| Can daily advisories become five-minute observations? | Not by copying them. Preserve their source resolution and validity, and flag missing measurements. | Barsomo |
| Is 378 million the number of rows? | No. It is scalar values in an illustrative sizing case. With 12 measures per row, it is about 31.5 million unit-interval rows. | Barsomo |
| Why Spark instead of one computer? | It is a candidate for larger joins and rolling features. We would benchmark actual data; distributed processing is not automatically necessary. | Barsomo |
| ETL or ELT? | Raw data lands first, then transformations produce clean and curated tables: primarily ELT, with intake validation. | Barsomo |
| Does Kafka guarantee zero loss? | Not by itself. Retention, durability, offsets, checkpoints, idempotent writes, and recovery testing matter. | Barsomo |
| Why correlation? | It screens relationships and lead/lag candidates, but does not establish causation or forecasting skill. | Nuril |
| Why PCA? | It summarizes overlapping standardized features. We inspect loadings and test whether important stress information is retained. | Nuril |
| Why k-means? | It is an interpretable baseline for similarity groups. It assumes distance-based, roughly compact clusters and is sensitive to scaling and outliers. | Nuril |
| Why exactly four clusters? | Four is an illustration. The actual k is chosen and checked using fit, silhouette, stability, and interpretation. | Nuril |
| Do you need labels? | K-means does not need labels to fit, but evaluating early warnings does need trustworthy alert outcomes. | Nuril |
| Why not deep learning? | Start with transparent baselines and limited rare-event data. More complex models can be compared later if data and evaluation justify them. | Nuril |
| Does clustering predict tomorrow? | No. A separate time-aware mapping or warning rule must connect available features to later outcomes and be validated. | Mariano |
| Where do future inputs come from? | Lagged observations and forecasts available at issue time, where authorized access exists. Archived as-issued forecasts are needed for honest backtesting. | Mariano |
| How do you prevent leakage? | Chronological splits, issue/publication-time checks, and fitting all preprocessing only on training data. | Nuril |
| How will you validate? | Rolling chronological backtests with thresholds set on validation data, then untouched later test periods and horizon-matched baselines. | Mariano |
| What does “false alarms under 20%” mean? | Unmatched warning episodes divided by all warning episodes: false-warning share, not the classical false-positive rate. | Mariano |
| Did you already reach 80% recall or three-day lead time? | No. Those are proposed targets to discuss and evaluate during a pilot. | Mariano |
| Could warnings cause market or public harm? | Yes. Start with authorized human review, appropriate access controls, clear uncertainty, and coordinated communication. | Mariano |
| Are the 3D data real? | The scenes are synthetic explanatory illustrations. Specific historical figures are labeled and cited separately. | Soriano |

## When you do not yet know

Say: “That has not been established in this proposal. We would test it by ___.” Explain the test or needed data. Do not turn an assumption into a finding.

## Rehearsal handoffs

- **Soriano → Corpuz:** “Corpuz will explain the information gap and the data we propose to combine.”
- **Corpuz → Barsomo:** “Barsomo will now show how we would store and organize those sources.”
- **Barsomo → Nuril:** “Nuril will explain how we prepare the data and discover stress patterns.”
- **Nuril → Mariano:** “Mariano will connect these patterns to a testable warning proposal.”

## If you are running late

Skip the optional simulator, shorten source examples, and keep one sentence per method. Do **not** omit that results are unvalidated or that clustering alone is not forecasting. Leave the appendix for questions.
