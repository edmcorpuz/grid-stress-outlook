# Barsomo

Your segment of the 20-minute defense. Full running order: [PRESENTATION-SCRIPT.md](../PRESENTATION-SCRIPT.md).

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

