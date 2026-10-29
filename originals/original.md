GSGRID STRESS OUTLOOK

01/24

The 3D grid view needs WebGL.

Drag to rotate · click a grid to scan · states simulated

Final proposalBig Data Warehousing and Analytics

# Grid Stress Pattern Analysis

for Early Warning of Power Supply Shortfalls in the Philippine Power Grids

← → moveN notesT timerO mission mapF full screen

Good morning, everyone. Our proposal is **Grid Stress Pattern Analysis for Early Warning of Power Supply Shortfalls in the Philippine Power Grids**.

In one sentence: we propose a big data framework that combines power grid, electricity market and weather data so shortfalls can be seen days ahead instead of hours.

The panel shows a real NGCP advisory from October 20: the Visayas grid was on red alert for an hour and on yellow alert for four more. *(Optional: click Mindanao on the map or the tab to scan it.)*

M01Introduction to the discipline

## Every second, supply has to meet demand

Energy and power systems analytics studies how electricity is generated, moved and used, so the grid stays balanced.

1. Generation**Power plants**Coal, natural gas, geothermal, hydro, solar, wind
2. Transmission**NGCP high-voltage grid**Luzon, Visayas and Mindanao, linked by undersea cables
3. Distribution**Utilities and co-ops**Meralco, Davao Light, electric cooperatives
4. Consumption**Homes and industry**Demand is highest in the afternoon and evening

**DOE**Sets energy policy

**ERC**Regulates rates and the market

**IEMOP**Runs the WESM spot market

**NGCP**Operates the grid, declares alerts

YellowRedWhen spare capacity runs thin, NGCP raises a grid alert.

First, the discipline. **Energy and power systems analytics** studies how electricity is generated, transmitted and used so the grid stays balanced.

Power plants generate electricity. NGCP moves it on the high-voltage grid across three grids: Luzon, Visayas and Mindanao. Distribution utilities like Meralco, Davao Light and the electric cooperatives deliver it. DOE sets policy, ERC regulates, and IEMOP runs the spot market.

The key rule: supply has to match demand every second. When the spare margin gets too thin, NGCP raises a yellow or red alert.

M01Why big data matters here

## The grid is a data machine

Data volume calculatorLive

Generating units 300

Measures per unit 12

Years of history 1

**378,432,000**values at 5-minute resolution · units × measures × 105,120 × years

100K1M10M100M1B10B

361× Excel's row limit of 1,048,576

One day on the market clock288 five-minute intervals

12 AM6 AM12 PM6 PM12 AM

WESM dispatches and settles every 5 minutes since June 26, 2021. Shading: a typical daily demand shape (illustrative).

VolumeVelocity: every 5 minVariety: market, grid, weather, text

Why is this a big data problem? Since June 2021 the electricity spot market dispatches and settles every **five minutes**: 288 intervals a day, the grid of cells on the right, and 105,120 a year for one data series.

*(Drag the sliders.)* With 300 generating units and 12 measures each, one year is already 378 million values, about 361 times Excel's row limit. Add years and it heads into the billions, before weather and outage data.

Volume, velocity and variety at the same time: that is where spreadsheets stop and big data tools start.

M02Statement of the problem

## How a grid alert happens

Yellow alert

The operating margin **cannot cover the grid's contingency requirement.** Reserves are thin.

Red alert

Supply **cannot meet demand plus the regulating requirement.** Rotational brownouts become possible, even with supply slightly above demand.

Try it: bring offline plants back, or start a heat wave

RED ALERT

Supply below demand plus regulating requirement

DemandRegulating req.Contingency req.Supply ends here

Demand**2,545**

Available**2,468**

Reserve**−77**

Needed**252**

Heat index 45 °C

Plants offline 685 MW

Imports 0 MW

Illustrative model. The Oct 20 preset uses NGCP's real figures (2,468 MW available, 2,545 MW peak, 685 MW offline); capacity, heat-to-demand slope and requirements (regulating 4% of demand, contingency 150 MW) are examples.

This simulator shows how an alert happens. It starts at the real October 20 numbers: **2,468 MW available against a 2,545 MW peak**, so the reserve is negative 77 MW: red alert.

*(Drag "Plants offline" down to about 400 MW.)* Bring plants back and the grid moves to yellow: supply now covers demand and the regulating requirement, but not the contingency requirement. *(Keep going to 300 MW.)* Now it is normal.

*(Drag Heat index up to 50 °C.)* In this model, heat alone pushes the same grid back into yellow. Note that red can happen even when supply is slightly above demand, because the grid must also hold regulating reserves. On June 10, the Visayas was on red with 2,429 MW available against a 2,421 MW peak.

M02Statement of the problem

## 2026: the alerts keep coming

123grid alerts on the Visayas grid from January 1 to September 3, 2026

Yellow alertsRed alerts

NGCP counts reported by the Daily Tribune, Sept 3, 2026. Luzon was not included in the report.

**+8**red alerts on the Visayas grid in eight days: the 22nd on Aug 26, the 30th by Sept 3.

Incident log · Jun to Oct 2026news reports of NGCP advisories

2026 in numbers: **123 alerts on the Visayas grid by September 3: 93 yellow and 30 red.** Mindanao logged 13.

The incident log on the right lists alert days reported in the news from June to October. It is not complete, but the pattern is clear: the Visayas keeps returning to red, and when Mindanao has its own shortages, the imports the Visayas depends on shrink too.

Red alerts went from the 22nd of the year on August 26 to 30 by September 3: eight in eight days.

M02Statement of the problem

## A few percent short, and the lights go out

Available capacityShortfall to projected peakProjected peak

Offline: capacity lost to forced outages and derated plants. NGCP figures via Daily Tribune (Aug 26, Sept 3), SunStar Davao (Sept 2), GMA News (Oct 20).

**0.7% to 15% short** of peak demand was enough for a red alert, while **2 to 45 times** that much capacity sat offline.

The grids are linked: on Oct 20, limited imports from Mindanao helped push the Visayas into red.

### Problem statement

The signals that come before an alert (plant outages, heat, rising demand, thinning reserves) are already recorded by NGCP, IEMOP and PAGASA.

But they sit in separate reports and formats, are read after the fact, and alerts are usually declared on the day itself. **No integrated framework links this data for early warning.**

These five snapshots show how thin the margin is. Available capacity fell short of projected peak by only **0.7 to 15 percent**, and that was enough for a red alert.

On the right of each bar: the capacity offline from outages and derated plants was **2 to 45 times bigger** than the shortfall. On September 2, Mindanao was short by just 19 MW while 855 MW were offline.

Our problem statement: the warning signs exist, but the data is scattered across agencies and formats, read after the fact, and alerts are usually declared on the day itself, only hours ahead. No integrated framework links this data for early warning.

M03Objectives and research questions

## Mission objectives

MAIN QUEST · GENERAL OBJECTIVE

Propose a big data framework that **integrates grid, market and weather data** to identify grid-stress patterns and give **early warning of supply shortfalls.**

Our main quest, the general objective: propose a big data framework that integrates grid, market and weather data to identify grid-stress patterns and give early warning of shortfalls.

- Quest one: which factors move with alerts, and how many days ahead. Tool: correlation.
- Quest two: which few components explain most of the daily stress. Tool: PCA.
- Quest three: what types of stress days exist, and can we recognize them early. Tool: k-means.
- Quest four: how to store and model the data so the analysis is fast and traceable. Tool: a lakehouse with a star schema.

M04Data source and characteristics

## Source loadout: four feeds, one core

### NGCP GRID OPERATOR

- Alert advisories (level, hours)
- Available capacity, peak demand
- Plants on outage or derated

VOLVELVARRISK

Text / PDF · daily

**0/4**FEEDS LINKED

Lakehouse core

### IEMOP WESM OPERATOR

- Demand per region
- Supply offers and schedules
- Market prices per interval

VOLVELVARRISK

CSV · every 5 min

### DOE ENERGY DEPT

- List of power plants
- Capacity, fuel type, owner
- Power statistics

VOLVELVARRISK

XLSX / PDF · monthly

### PAGASA WEATHER

- Temperature, heat index
- Rainfall
- Readings per station

VOLVELVARRISK

CSV / API · hourly

Stat bars are our 1 to 5 rating: VOL volume, VEL velocity, VAR variety, RISK data-quality risk. Plus a calendar table we build (holidays, weekends). Public reports cover this proposal; plant-level and real-time data would need data-sharing agreements.

Our source loadout. *(Click Connect on each as you introduce it.)*

- **NGCP**, the grid operator: alert advisories, available capacity, peak demand and the plants on outage. Mostly text and PDF, so high variety and quality risk.
- **IEMOP**, the spot market: demand, offers and prices every five minutes. Our highest volume and velocity.
- **DOE**: the list of power plants with capacity and fuel type.
- **PAGASA**: temperature, heat index and rainfall.

The stat bars are our own rating of each source. Public data covers the proposal; detailed plant data would need agreements.

M04Data lineage

## Trace one real record, substation to dashboard

Stage 01 · OriginVisayas · Oct 20, 2026

```

```

Every record keeps where it came from, so any warning can be traced back to the original file.

**Data lineage** means we can trace every number back to where it came from. *(Click Trace record.)*

Let's follow one real record: the October 20 Visayas advisory. Plant availability flows to NGCP's control center, which publishes the advisory. An Airflow task parses it into JSON. The file lands in the raw zone and moves through clean and curated. In the warehouse it becomes fact rows, with lineage columns: source system, file, load time and transformation version. On the dashboard it becomes a red warning card that can be traced all the way back to the original file.

M04Characteristics, quality and formats

## Volume, velocity, variety and veracity

Volume

Years of 5-minute data × hundreds of plants × many weather stations: hundreds of millions of rows.

Velocity

Market data every 5 minutes, weather hourly, advisories daily.

Variety

Structured CSV, semi-structured JSON or XML feeds, unstructured PDF advisories, time series.

Veracity

Plant names differ across sources (KSPC 1 vs Kepco SPC 1), intervals go missing, tables are PDF-only, alerts are text, and the market moved from 1-hour to 5-minute intervals in 2021.

| Field | Type | Example |
| --- | --- | --- |
| interval_end | Datetime | 2026-10-20 17:05 |
| grid | Categorical | Visayas |
| available_mw | Numeric | 2,468 |
| peak_demand_mw | Numeric | 2,545 |
| price_php_mwh | Numeric | ₱ per MWh |
| fuel_type | Categorical | Coal |
| alert_level | Ordinal | Normal \< Yellow \< Red |
| heat_index_c | Numeric | °C |
| advisory_text | Text | Red alert 5 to 6 PM |

- **Volume:** years of five-minute data across hundreds of plants and weather stations: hundreds of millions of rows.
- **Velocity:** market data every five minutes, weather hourly, advisories daily.
- **Variety:** structured CSV, semi-structured JSON or XML, unstructured PDF advisories, and time series.
- **Veracity:** the same plant appears as KSPC 1 in one report and Kepco SPC 1 in another, intervals go missing, some tables exist only as PDFs, and the market switched from one-hour to five-minute intervals in 2021.

The table shows the main fields and their data types.

M05Data ingestion

## Two lanes into the lake, and no data lost

**Streaming**Minutes

Source**IEMOP 5-min feeds**Demand, offers, prices

Transport**Apache Kafka**Topics buffer every message

Process**Spark Streaming**Parse, timestamp, validate

Lands in**Raw zone**Parquet by grid and date

Streaming · Kafka buffer **0** · delivered **0** · lost **0**

**Batch**Daily, monthly

Source**NGCP, PAGASA, DOE**Advisories, weather, plants

Schedule**Apache Airflow**Runs, retries, logs each job

Process**Parsers and checks**PDF to text, schema checks

Lands in**Raw zone**Original files kept as is

*extract**→**parse**→**validate**→**load*

DAG idle

Ingestion runs in two lanes. The **streaming lane** carries the five-minute market feeds through Apache Kafka into Spark Structured Streaming and the raw zone.

*(Click Crash Spark job.)* If the processing job crashes, Kafka keeps buffering the messages instead of losing them. *(Click Recover.)* When the job comes back, Kafka replays the backlog: zero data lost.

*(Click Run Airflow DAG.)* The **batch lane** runs as an Airflow DAG: extract, parse, validate, load. When the parse step fails, Airflow retries it automatically and logs the run.

M05Data storage

## A lakehouse with three zones

HDFS or Amazon S3Apache ParquetDelta LakePartitioned by grid and date

The 3D lake view needs WebGL.

Drag to rotate · each dot is a record, colored by source until cleaned

For storage we use a **lakehouse**. The data lake, on HDFS or Amazon S3, has three zones. *(Click each zone.)*

- **Raw** keeps files exactly as received, so we can always reprocess.
- **Clean** holds validated, deduplicated data with standard names, aligned to five-minute intervals.
- **Curated** holds features and warehouse tables ready for analysis.

Files are Apache Parquet, columnar and compressed, partitioned by grid and date. Delta Lake adds versioned, reliable tables. The lake is cheap storage for every format; the warehouse on top serves fast SQL and OLAP.

M05Data warehouse model

## Star schema and OLAP console

Roll up · alerts by gridwarehouse.sql

```

```

Here is our dimensional model. The central fact table, **fact_grid_interval**, has one row per grid per five-minute interval, with demand, available capacity, reserve, offline capacity, imports and price. **fact_grid_alert** and **fact_plant_outage** share the grid and date dimensions: a fact constellation.

*(Click each operation.)* **Roll up** totals alerts by grid. **Drill down** opens October 20 by alert window. **Slice** keeps only the Visayas and lists the coal plants reported offline on each alert day. **Dice** cuts by date range and grid. The results use real figures from the news reports, loaded as sample warehouse rows.

M06Data preprocessing

## Clean the data: 7 steps to model-ready days

#### BEFORE

→

#### AFTER

Sample rows. Plant names and the Oct 20 figures are real; timestamps, means and standard deviations are examples.

Preprocessing turns messy feeds into model-ready data. *(Click Run for each step.)*

One: standardize names: the same coal plant appears as KSPC 1 and Kepco SPC 1. Two: align every source to one five-minute clock in Philippine time. Three: remove duplicates and fill short gaps. Four: parse advisory text into alert records. Five: engineer features; reserve margin on October 20 was 2,468 minus 2,545: **negative 77 MW**. Six: roll up to one labeled row per grid per day. Seven: convert to z-scores so megawatts, pesos and degrees are comparable.

M07Exploration and analysis

## Processing at scale with Apache Spark

**Partitions run in parallel.** Data is split by grid and date; the driver sends tasks to executors.

**Shared-nothing cluster.** Each node has its own CPU, memory and disk, so more nodes means more capacity, and a failed task is rerun elsewhere.

**Why distributed:** joining years of 5-minute data from four sources and recomputing rolling windows will not fit in one machine's memory.

**One engine:** Structured Streaming updates features every 5 minutes; MLlib runs PCA and k-means. Cloud: Amazon EMR, Google Dataproc or Databricks.

The 3D cluster view needs WebGL.

8

Ready

Drag to rotate · 64 partitions · simulated timing

To process this at scale we use **Apache Spark**. Data is split into partitions by grid and date; the driver sends tasks to executors, which work in parallel.

*(Press minus to 4 executors and Run job; keep talking until it finishes, about 18 seconds.)* On a shared-nothing cluster each node has its own CPU, memory and disk, so adding nodes adds capacity. *(Press plus to 12 and Run job again.)* Three times the executors, about a third of the time. *(Click Kill node while it runs.)* A failed node only loses its own task, and Spark reruns it on another node.

Structured Streaming keeps features updated every five minutes, and MLlib runs PCA and k-means, on a cloud service like Amazon EMR, Google Dataproc or Databricks.

M07Method 1 · Correlation

## What moves with a shortfall, and how early?

**Click a cell.** Expected direction and strength, to be measured with Pearson and Spearman coefficients on the real data.

Lag explorersimulated data

Shift the leading signal 0 days

**r = 0.00**Drag to find the lead time

Reserve marginLeading signal (inverted, shifted)

Now the analysis, starting with **correlation**. The matrix shows the relationships we expect; the real values will be measured on the data. The highlighted bottom row is our target, **reserve margin**: it should fall strongly as demand, offline capacity and prices rise. *(Click a cell to explain it.)*

The key step is **lagged correlation**. *(Drag the lag slider.)* In this simulated example the link is strongest when the leading signal is shifted 3 days: that would give us 3 days of warning. We run the same scan on the real data to find the actual lead time.

M07Method 2 · PCA

## Many signals, a few stress factors

Demand rises with heat; prices rise with outages. PCA turns 20+ overlapping variables into a few uncorrelated components.

Variance explained in this simulated example (3 variables).

**PC1****Heat-driven demand:** heat index, demand, peak hours

**PC2****Supply loss:** offline MW, imports, reserve margin

**PC3****Market tightness:** prices, offers

Expected components in the full model. We keep enough to explain about 80 to 90% of the variance.

The 3D PCA view needs WebGL.

Drag to rotate · ● normal ● yellow ● red · simulated grid-days

Many variables overlap: demand rises with heat; prices rise with outages. **Principal component analysis** combines correlated variables into a few uncorrelated components.

The 3D view uses simulated grid-days, colored by alert level. *(Drag to rotate.)* The arrows are the components the algorithm found; PC1 points along the greatest variation. *(Click Flatten.)* Flattening onto PC1 and PC2 keeps most of the structure with one less dimension.

In the full model we expect components like heat-driven demand, supply loss and market tightness, keeping enough to explain about 80 to 90 percent of the variance.

M07Method 3 · K-means

## Find the kinds of grid-stress days

Number of clusters k 4

Starting

Elbow method on the simulated data at right.

**Calm days**Normal reserves

**Heat-driven peaks**High demand

**Supply-loss days**Plants offline

**Compound stress**Both at once

**Early warning:** each forecast day is placed in this space. If it lands in or drifts toward a stress cluster, the warning goes out days ahead.

The 3D k-means view needs WebGL.

Drag to rotate · simulated grid-days in component space

Next, **k-means clustering** on the PCA scores, to group days that stress the grid in the same way.

Watch the animation: centroids start at random points, each day joins its nearest centroid, each centroid moves to the center of its group, and this repeats until nothing changes.

*(Drag k to 2, then 6, then back to 4.)* The elbow chart shows why we pick four: past four, extra clusters barely reduce the error. The four profiles are calm days, heat-driven peaks, supply-loss days and compound stress. For early warning, each forecast day is placed in this space; drifting toward a stress cluster triggers the warning.

M07Justification of methods

## Skill tree: why each method fits

Quest**RQ1**

Method**Correlation**Pearson, Spearman, lagged

Why it fitsShows which signals move with shortfalls, and how many days earlier

Output**Drivers and lead time**

Quest**RQ2**

Method**PCA**On standardized features

Why it fitsMany inputs overlap; PCA removes redundancy and noise

Output**3 to 5 stress factors**

Quest**RQ3**

Method**K-means**On PCA scores

Why it fitsNeeds no labels, which matters because red-alert days are few

Output**Day types and warning score**

Quest**RQ4**

Method**Lakehouse and star schema**

Why it fitsKeeps raw data for reprocessing; fast, repeatable OLAP

Output**Trusted, traceable tables**

Why not deep learning first?Few alert days to learn from, and operators need results they can explain. These methods are explainable, fast, and built into Spark MLlib.

- **Correlation** shows which signals move with shortfalls, and how early.
- **PCA** removes the overlap between many inputs.
- **K-means** needs no labels, which matters because red-alert days are relatively few.
- The **lakehouse with a star schema** keeps raw data for reprocessing while serving fast, traceable queries.

Why not start with deep learning? There are few alert days to learn from, and grid operators need results they can explain.

M08Expected outcome and implementation

## Deployment: the Grid Stress Outlook

Grid Stress Outlookupdates every 5 minPrototype

Warning: Visayas · red-alert risk · 5 to 8 PM · driver: plants offline

Example screen. Visayas "Tue" figures are the NGCP advisory of Tuesday, Oct 20, 2026; scores and the outlook are illustrative.

### Who uses it

**DOE, NGCP and ERC**; utilities like **Meralco, Davao Light** and electric cooperatives; LGUs and the public.

### How it reaches them

Web dashboard, SMS and email alerts for utilities, and an open data API.

### Rollout

Pilot on the **Visayas grid**, which had the most alerts in 2026, then Mindanao and Luzon.

For deployment, the output is the **Grid Stress Outlook**, updated every five minutes. *(Click through the days.)* Each grid shows its state, a stress score, its stress profile, and a seven-day outlook. The Visayas card on "Tue" uses the real October 20 figures; the rest is illustrative.

*(Click Send warning.)* Warnings go to utilities by SMS and email and to the public through the dashboard and an open API. Users: DOE, NGCP, ERC, utilities like Meralco and Davao Light, electric cooperatives and LGUs. We would pilot on the Visayas grid, then expand to Mindanao and Luzon.

M08Monitoring

## Keeping the warnings honest

**80%**

**Alerts caught**target share of NGCP alerts warned in advance

**\<20%**

**False alarms**target ceiling for unneeded warnings

**3 d**

**Lead time**target days of warning (out of 7)

**5 m**

**Data freshness**target: data never older than one 5-minute interval

Proposed targets, to be set with NGCP during the pilot. Ops alerts also watch Kafka lag and failed Airflow jobs.

Once deployed, it has to be monitored. Every day the pipeline scores each grid; every week we compare our warnings with the actual NGCP alerts; we watch for drift, like new plants or demand growth, and re-cluster each season.

The gauges are our proposed targets: catch 80 percent of alerts in advance, keep false alarms under 20 percent, give at least 3 days of lead time, and keep data no more than 5 minutes old. On the technical side we watch Kafka lag and failed Airflow jobs.

M08Limitations, ethics and challenges

## Threats and countermeasures

Click a card to reveal the countermeasure

Every plan has threats, so here are ours and how we handle them. *(Click cards to flip.)*

- **Data access:** restricted plant data and late PDF reports; handled with data-sharing agreements and public data first.
- **Analytical limits:** few red-alert days, correlation is not causation; handled with held-out validation and risk levels.
- **Privacy:** no personal data now; a smart-meter extension would follow the Data Privacy Act of 2012.
- **Market and public risk:** warnings could move spot prices or cause panic; releases are coordinated with DOE and ERC.
- **Security:** role-based access, encryption and audit logs.
- **Implementation:** pilot on the Visayas with managed cloud services.

The 3D grid view needs WebGL.

M09Conclusion

Mission complete

From reacting to red alerts to seeing them coming

**4**data feeds linked

**3**analytics methods

**1**lakehouse + star schema

**0/9**achievements

*01*

**The problem is real and recurring:** 123 alerts on the Visayas grid by September 3, 2026.

*02*

**The data already exists.** A lakehouse and star schema bring grid, market and weather data together, traceably.

*03*

**Correlation, PCA and k-means** turn it into explainable stress profiles and days of warning instead of hours.

To conclude. One: the problem is real and recurring, with 123 alerts on the Visayas grid by September 3 this year. Two: the data to see it coming already exists but is scattered; a lakehouse with a star schema brings it together traceably. Three: correlation, PCA and k-means turn that data into explainable stress profiles and days of warning instead of hours.

Our goal: move from reacting to red alerts to seeing them coming. Thank you.

Q&AThank you

## Questions?

Grid Stress Pattern Analysis for Early Warning of Power Supply Shortfalls in the Philippine Power Grids

References

1. [Daily Tribune (Sept 3, 2026). Visayas grid logs 123 alerts as supply falters.](https://tribune.net.ph/2026/09/03/visayas-grid-logs-123-alerts-as-supply-falters-2)
2. [Daily Tribune (Aug 26, 2026). Visayas power deficit: 87th yellow and 22nd red alert of 2026.](https://tribune.net.ph/2026/08/26/visayas-power-deficit-triggers-87th-red-alert)
3. [SunStar Davao (Sept 2, 2026). Mindanao power grid placed under red, yellow alerts.](https://www.sunstar.com.ph/davao/mindanao-power-grid-placed-under-red-yellow-alerts)
4. [GMA News (Oct 20, 2026). Visayas grid on red, yellow alerts.](https://www.gmanetwork.com/news/topstories/regions/1006485/visayas-grid-on-red-yellow-alerts-on-tuesday-oct-20-2026-ngcp/story/)
5. [GMA News (June 10, 2026). Red alert on Visayas grid, yellow on Mindanao.](https://www.gmanetwork.com/news_duplicate/money/economy/990931/red-alert-visayas-grid-yellow-alert-mindanao-grid-june-10-2026/story/)
6. [Philstar (Aug 16, 2026). Visayas grid under yellow alert.](https://www.philstar.com/bansa/2026/08/16/2549683/visayas-grid-under-yellow-alert-ngcp)
7. [The Manila Times (Oct 27, 2026). Yellow, red alerts up again for Visayas grid.](https://manilatimes.net/2026/10/27/news/yellow-red-alerts-up-again-for-visayas-grid/2454542)
8. [BusinessWorld. Enhanced WESM: 5-minute dispatch and settlement since June 26, 2021.](https://www.bworldonline.com/?p=387205)

Incident log also draws on GMA News, Manila Bulletin and DZRH reports of NGCP advisories, June to October 2026.

**Likely questions and short answers:**

- **Is the data available?** Market data and alert advisories are public; detailed plant data needs a data-sharing agreement, which the framework assumes.
- **Why not just use the alert history?** Alerts are the outcome; we link their causes (outages, heat, demand) so stress is visible days earlier.
- **Why k-means?** Simple, explainable and built into Spark MLlib; we would compare it with hierarchical clustering or DBSCAN using the silhouette score.
- **Why both a lake and a warehouse?** The lake keeps cheap raw data for reprocessing; the warehouse gives fast SQL and OLAP.
- **Grain of the main fact table?** One row per grid per five-minute interval.
- **ETL or ELT?** ELT: raw data lands first, then Spark and the warehouse transform it.
- **Is the 3D data real?** The PCA, k-means, lag and Spark views use simulated data to show how the methods work; all alert and megawatt figures are real NGCP numbers from news reports.

## Mission map

## Achievements 0/9

Big Data Warehousing and Analytics · Final proposal

# GRID STRESS OUTLOOK

Early warning system for the Philippine power grids

```

```

Enter, → or a clicker to start · ← → to move · the 20-minute timer starts when you leave the title slide