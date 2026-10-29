# Barsomo

Your segment of the 20-minute defense. Full running order: [PRESENTATION-SCRIPT.md](../PRESENTATION-SCRIPT.md).

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

