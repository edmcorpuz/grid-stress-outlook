export type SceneMode = 'grid' | 'lake' | 'signals' | 'clusters';
export type Speaker = 'Soriano' | 'Corpuz' | 'Barsomo' | 'Nuril' | 'Mariano';
export interface Slide {
  id: string; chapter: string; title: string; accent: string; summary: string;
  speaker: Speaker; seconds: number; scene: SceneMode; label: string;
  points?: { title: string; text: string }[];
  stat?: { value: string; unit: string; detail: string };
  visual?: 'balance' | 'scale' | 'pipeline' | 'schema' | 'outlook' | 'validation';
  notes: string[]; cue: string; bridge: string; sources?: number[]; appendix?: boolean;
}
export const references = [
  { id: 1, title: 'Visayas grid logs 123 alerts as supply falters', publisher: 'Daily Tribune / Philippine News Agency', date: '3 September 2026', url: 'https://tribune.net.ph/2026/09/03/visayas-grid-logs-123-alerts-as-supply-falters-2', status: 'Checked: 93 yellow + 30 red alerts; counts are not unique alert days.' },
  { id: 2, title: 'Visayas grid on red, yellow alerts on Tuesday, Oct. 20, 2026 — NGCP', publisher: 'GMA News', date: '20 October 2026', url: 'https://www.gmanetwork.com/news/topstories/regions/1006485/visayas-grid-on-red-yellow-alerts-on-tuesday-oct-20-2026-ngcp/story/', status: 'Checked: 2,468 MW available, 2,545 MW projected peak, 685 MW unavailable. News reporting of an NGCP advisory, not a raw telemetry dataset.' },
  { id: 3, title: 'Enhanced Electricity Market for the entire Philippine grid', publisher: 'BusinessWorld / Richard J. Nethercott', date: '6 August 2021', url: 'https://www.bworldonline.com/?p=387205', status: 'Checked: enhanced WESM transition to five-minute dispatch and settlement. Historical market coverage must be verified per grid.' },
];
export const slides: Slide[] = [
  {
    id: 'opening', chapter: '01 / The reason', title: 'See the stress.', accent: 'Before the shortfall.',
    summary: 'Grid Stress Pattern Analysis for Early Warning of Power Supply Shortfalls in the Philippine Power Grids',
    speaker: 'Soriano', seconds: 70, scene: 'grid', label: 'Research proposal · Not a live warning system',
    notes: [
      'Good morning, panel members. We are Soriano, Corpuz, Barsomo, Nuril, and Mariano. Our proposal is Grid Stress Pattern Analysis for Early Warning of Power Supply Shortfalls in the Philippine Power Grids.',
      'The idea is simple: combine information about electricity supply, demand, and weather so we can study the warning signs together, rather than reading separate reports.',
      'This is a proposed research framework, not a working forecast service. Today we will explain the problem, the data design, the analysis, and how we would test whether it really provides useful warning. The 3D map is an explanatory visual; it does not show live grid conditions.',
    ], cue: 'Start the timer when you begin speaking. Introduce the team; do not explain the interface.', bridge: 'First, why is this problem worth studying?',
  },
  {
    id: 'evidence', chapter: '01 / The reason', title: 'Not one bad day.', accent: 'A recurring problem.',
    summary: 'The Visayas grid repeatedly faced thin reserves and supply constraints.',
    speaker: 'Soriano', seconds: 80, scene: 'grid', label: 'Reported evidence · Visayas, Jan–3 Sep 2026',
    stat: { value: '123', unit: 'reported grid alerts', detail: '93 yellow · 30 red' },
    points: [{ title: 'What the count means', text: 'Alert occurrences—not 123 separate blackout days.' }],
    sources: [1],
    notes: [
      'The Daily Tribune, reporting NGCP figures through the Philippine News Agency, recorded 123 Visayas grid alerts from January to September 3, 2026. That total consists of 93 yellow alerts and 30 red alerts.',
      'These are alert counts. We are not saying that there were 123 unique days of alerts, or that every alert caused a blackout. An alert is a warning about the available supply and required reserves.',
      'The useful message is that this is a recurring planning concern, not an isolated incident. That makes Visayas a reasonable pilot candidate for our study. We would still need a complete and consistently labeled historical dataset before making comparisons across grids.',
    ], cue: 'Read only the total and the split. Pause; do not read the citation aloud.', bridge: 'To understand those alerts, let us look at the supply margin.',
  },
  {
    id: 'margin', chapter: '01 / The reason', title: 'A small gap.', accent: 'A serious warning.',
    summary: 'Electricity supply must cover demand—and the reserves needed to operate safely.',
    speaker: 'Soriano', seconds: 90, scene: 'grid', label: 'Reported snapshot · Visayas, 20 Oct 2026', visual: 'balance',
    points: [{ title: 'Yellow alert', text: 'The operating margin cannot cover the contingency requirement.' }, { title: 'Red alert', text: 'Supply cannot cover demand plus the regulating requirement.' }],
    sources: [2],
    notes: [
      'GMA News reported 2,468 megawatts of available capacity against a projected peak demand of 2,545 megawatts on October 20. Subtracting the two gives a negative 77-megawatt margin. The advisory placed Visayas on red alert for part of that day.',
      'Supply also needs a safety allowance. Yellow means the operating margin cannot cover the contingency requirement. Red means supply cannot cover demand plus the regulating requirement. So red is possible even when supply is slightly above demand. It does not automatically mean that every customer loses power.',
      'Our optional slider is only a simplified teaching model. Its four-percent regulating requirement and 150-megawatt contingency requirement are assumptions, not an NGCP operating calculation. The starting supply and demand figures are reported evidence.',
    ], cue: 'Point to the −77 MW gap. Optional: move available capacity to 2,700 MW, then reset. Skip the demo if behind time.',
    bridge: 'Corpuz will explain the information gap and the data we propose to combine.',
  },
  {
    id: 'gap', chapter: '02 / The question', title: 'The signals exist.', accent: 'The view is fragmented.',
    summary: 'Our proposal brings separate public reports into one traceable analytical view.',
    speaker: 'Corpuz', seconds: 75, scene: 'signals', label: 'Proposed integration · Not a claim about all existing systems',
    points: [{ title: 'Supply', text: 'Plant outages, derating, and available capacity.' }, { title: 'Demand', text: 'Consumption patterns and electricity market conditions.' }, { title: 'Weather', text: 'Heat and rainfall that may relate to grid stress.' }],
    notes: [
      'Thank you, Soriano. The challenge we address is bringing different signals together. A grid advisory may be a PDF, market observations may be interval tables, and weather readings may come from separate stations.',
      'Each source answers part of the question, but their names, timestamps, and formats do not necessarily line up. A number is difficult to interpret if we cannot tell which grid and period it belongs to, or whether it was available at the time a warning would have been issued.',
      'We propose a traceable integration for this study. We are not claiming that NGCP or other organizations have no existing forecasting tools. Establishing that broader research gap would require a separate review of operational systems and literature.',
    ], cue: 'Use the three signal groups as your speaking guide. No interaction is needed.', bridge: 'This gives us one main objective and three analytical questions.',
  },
  {
    id: 'objective', chapter: '02 / The question', title: 'One objective.', accent: 'An earlier, clearer view.',
    summary: 'Design and evaluate an explainable framework for identifying grid-stress patterns and possible early-warning signals.',
    speaker: 'Corpuz', seconds: 85, scene: 'signals', label: 'Research questions · Lead time must be measured',
    points: [{ title: '01 / Relationships', text: 'Which signals move with stress, and at what lead or lag?' }, { title: '02 / Components', text: 'Can fewer components summarize overlapping signals?' }, { title: '03 / Profiles', text: 'Which recurring types of grid-stress days emerge?' }],
    notes: [
      'Our general objective is to design and evaluate a framework that integrates grid, market, and weather data to identify stress patterns and investigate early-warning signals.',
      'We ask three analytical questions. First, which variables move with grid stress, and do any of them provide useful earlier information? Second, can we summarize overlapping variables without losing too much information? Third, are there recurring types of stress days, such as high-demand days or supply-loss days?',
      'Correlation, principal component analysis, and clustering address those questions. A fourth engineering objective supports all three: build traceable storage and warehouse tables. The phrase early warning describes the research goal. It is not yet an achieved three-day prediction result.',
    ], cue: 'Point to each question once. Avoid introducing all the tool names twice.', bridge: 'To answer those questions, we need four complementary sources.',
  },
  {
    id: 'sources', chapter: '02 / The question', title: 'Four sources.', accent: 'One shared clock.',
    summary: 'Combine grid, market, plant, and weather information—with explicit access and freshness limits.',
    speaker: 'Corpuz', seconds: 80, scene: 'lake', label: 'Proposed feeds · Availability must be confirmed',
    points: [{ title: 'NGCP + IEMOP', text: 'Alerts and grid conditions + interval market observations.' }, { title: 'DOE + PAGASA', text: 'Plant reference data + weather observations and, if available, forecasts.' }, { title: 'Access comes first', text: 'Public reports for the pilot; agreements for restricted or timely feeds.' }],
    notes: [
      'NGCP advisories describe alert periods and reported grid conditions. IEMOP market data provides interval observations such as demand and prices. DOE publications help identify plants and their characteristics. PAGASA contributes weather information.',
      'We would map these sources onto a shared Philippine time convention, while preserving their original timestamps and publication times. A five-minute market interval does not mean that every source publishes fresh data every five minutes.',
      'Public reports can support a retrospective pilot, subject to availability and terms of use. More detailed or timely feeds may require agreements. We will not assume there is a public real-time API for every source. The first implementation task is a data inventory: what exists, at what resolution, with what delay and permission?',
    ], cue: 'Emphasize “publication time” and “access.” These are likely panel questions.', bridge: 'Barsomo will now show how we would store and organize those sources.',
  },
  {
    id: 'scale', chapter: '03 / The foundation', title: 'Small intervals.', accent: 'A growing workload.',
    summary: 'Five-minute observations accumulate quickly when units, measures, and years are combined.',
    speaker: 'Barsomo', seconds: 70, scene: 'signals', label: 'Illustrative sizing · Not an observed dataset', visual: 'scale', sources: [3],
    stat: { value: '378M', unit: 'scalar values / year', detail: '300 units × 12 measures × 105,120 intervals' },
    notes: [
      'Thank you, Corpuz. The enhanced WESM uses five-minute dispatch and settlement intervals. At that resolution, one non-leap year contains 105,120 intervals per series.',
      'For an illustrative case with 300 units and 12 measures, that gives about 378 million scalar values per year. These are values, not necessarily rows. In a wide table with 12 measure columns, the same example is about 31.5 million unit-interval rows.',
      'The workload also includes parsing reports, joining sources, and recomputing rolling features. This motivates testing scalable tools, but it does not prove that a single machine cannot handle the data. We would benchmark the actual dataset and use distributed processing only when the measured workload justifies it.',
    ], cue: 'Say “values, not rows.” Do not compare the scalar count with an Excel row limit.', bridge: 'Our design separates original records from cleaned and analysis-ready data.',
  },
  {
    id: 'architecture', chapter: '03 / The foundation', title: 'Keep the original.', accent: 'Build trust in layers.',
    summary: 'A lakehouse preserves source evidence and creates reproducible, analysis-ready tables.',
    speaker: 'Barsomo', seconds: 90, scene: 'lake', label: 'Proposed architecture · Start batch-first', visual: 'pipeline',
    points: [{ title: 'Raw', text: 'Original files, publication times, and source references.' }, { title: 'Clean', text: 'Standard names, checked units, duplicates and gaps flagged.' }, { title: 'Curated', text: 'Warehouse tables and time-aware analytical features.' }],
    notes: [
      'Think of the lakehouse as three shelves. Raw holds what we actually received. Clean holds standardized and checked records. Curated holds the tables and features used for analysis.',
      'We propose object storage such as S3, Parquet files, and Delta tables where transactional versioning is needed. Airflow schedules batch collection and validation. Spark is a candidate for larger transformations. Kafka and streaming processing are optional later, only if an authorized timely feed exists.',
      'Every derived record should preserve a source reference, ingestion time, and transformation version. This lets us answer where a result came from and reproduce it. Retrying a job is not enough to guarantee no data loss: retention, checkpoints, idempotent writes, and reconciliation all matter. Starting batch-first makes the pilot more realistic and easier to audit.',
    ], cue: 'Use Raw → Clean → Curated as the explanation. Avoid a tool-by-tool lecture.', bridge: 'On top of those layers, the warehouse needs a very clear grain.',
  },
  {
    id: 'warehouse', chapter: '03 / The foundation', title: 'One row.', accent: 'One grid. One interval.',
    summary: 'The main fact table is defined at grid × five-minute interval, where observations support that resolution.',
    speaker: 'Barsomo', seconds: 80, scene: 'lake', label: 'Warehouse design · No invented five-minute measurements', visual: 'schema',
    points: [{ title: 'Measures', text: 'Demand, available capacity, imports, price, and derived margin.' }, { title: 'Shared dimensions', text: 'Grid and time connect interval, alert, and outage facts.' }, { title: 'Separate event facts', text: 'Alert windows and plant outages retain their own grain.' }],
    notes: [
      'The grain of fact_grid_interval is one grid at one five-minute interval, when we have valid observations at that resolution. It contains measures such as demand, available capacity, imports, and price, with reserve margin derived where appropriate.',
      'Grid and time dimensions support filtering and aggregation. Alerts and plant outages are separate fact tables because an event window or a plant outage is not the same thing as a grid interval. Shared dimensions let us analyze them together without multiplying rows accidentally.',
      'A daily advisory cannot simply be copied across the day and treated as measured five-minute telemetry. We retain source resolution, valid time, and missingness. For analysis, we aggregate available observations into grid-day features. The appendix explains the table grain and example OLAP operations if you would like more detail.',
    ], cue: 'Memorize the grain. This is the most important warehouse answer.', bridge: 'Nuril will explain how we prepare the data and discover stress patterns.',
  },
  {
    id: 'preparation', chapter: '04 / The analysis', title: 'Good analysis starts', accent: 'before the algorithm.',
    summary: 'Clean consistently, preserve missingness, and never let tomorrow’s information leak into today’s warning.',
    speaker: 'Nuril', seconds: 60, scene: 'signals', label: 'Preparation · Time-aware, reproducible features',
    points: [{ title: 'Standardize', text: 'Plant identities, units, timestamps, and duplicate records.' }, { title: 'Build features', text: 'Margins, outages, rolling changes, and weather summaries.' }, { title: 'Respect time', text: 'Split chronologically; fit scaling and imputation on training data only.' }],
    notes: [
      'Thank you, Barsomo. We first standardize names, units, and timestamps. We remove duplicates and flag missing intervals. Any short-gap filling must be documented, and we should not fill across major outage events without justification.',
      'Next, we build features such as supply margin, unavailable capacity, demand changes, and weather summaries. We distinguish observation time from publication time: a value recorded yesterday but published tomorrow is not available for a warning today.',
      'Finally, we split the history chronologically. Scaling, imputation, PCA, and clustering are fitted only on the training period. This avoids data leakage and makes the later evaluation closer to a real deployment.',
    ], cue: 'Emphasize the difference between observation time and publication time.', bridge: 'The first analytical step asks which signals move together.',
  },
  {
    id: 'correlation', chapter: '04 / The analysis', title: 'What moves together?', accent: 'And what comes first?',
    summary: 'Correlation explores relationships; lag analysis tests whether earlier observations contain useful signals.',
    speaker: 'Nuril', seconds: 60, scene: 'signals', label: 'Method 01 · No measured coefficients shown',
    points: [{ title: 'Pearson + Spearman', text: 'Compare linear relationships and rank-based relationships.' }, { title: 'Lead / lag checks', text: 'Test earlier signals against later stress, with seasonal controls.' }, { title: 'Not causation', text: 'A strong relationship is a candidate signal—not a proven cause or forecast.' }],
    notes: [
      'Correlation measures how variables move together. Pearson is useful for linear relationships, while Spearman compares ranked values and can capture monotonic relationships.',
      'We also examine lags: for example, whether information available earlier is associated with stress later. We would account for seasonality and autocorrelation, because repeated daily patterns can produce misleading relationships.',
      'A strong correlation does not prove that a factor caused an alert, and searching many lags can overfit. We therefore treat discovered relationships as candidates to test on later, unseen periods. We are not displaying an invented coefficient or claiming that a three-day signal has already been found.',
    ], cue: 'If asked for a correlation value, say it will be estimated from the real dataset.', bridge: 'Several signals may overlap. PCA helps us summarize that overlap.',
  },
  {
    id: 'pca', chapter: '04 / The analysis', title: 'Many measurements.', accent: 'Fewer dimensions.',
    summary: 'Principal component analysis combines overlapping standardized variables into a smaller set of components.',
    speaker: 'Nuril', seconds: 60, scene: 'signals', label: 'Method 02 · Synthetic points, explanatory visualization',
    points: [{ title: 'Reduce redundancy', text: 'Keep a compact representation of correlated features.' }, { title: 'Inspect loadings', text: 'Name a component only after seeing which variables contribute.' }, { title: 'Validate retention', text: 'Explained variance matters, but so does retaining useful stress information.' }],
    notes: [
      'Principal component analysis, or PCA, creates new axes that summarize variation across standardized variables. It is useful when several measurements contain overlapping information.',
      'We inspect the component loadings to understand what contributes to each axis. A name such as heat-driven demand would be an interpretation after fitting, not a label we force onto the result.',
      'An 80-to-90-percent explained-variance threshold can be a starting heuristic, but high variance is not the same as predictive value. A low-variance signal could still matter for alerts. The points on screen are synthetic and illustrate dimensional structure; they are not a fitted result from Philippine grid data.',
    ], cue: 'Use “summary axes” if the panel wants a simpler explanation.', bridge: 'We can then explore whether days form recurring groups in that space.',
  },
  {
    id: 'clustering', chapter: '04 / The analysis', title: 'Find patterns.', accent: 'Not predetermined labels.',
    summary: 'K-means groups similar grid-days. We interpret the groups after fitting and compare their later alert rates.',
    speaker: 'Nuril', seconds: 60, scene: 'clusters', label: 'Method 03 · Four illustrative groups, not discovered results',
    points: [{ title: 'Explore possible profiles', text: 'Calm, demand-driven, supply-loss, or combined stress.' }, { title: 'Choose k from evidence', text: 'Compare elbow, silhouette, seasonal stability, and interpretability.' }, { title: 'Clustering ≠ forecasting', text: 'Groups describe similarity; a warning rule needs separate validation.' }],
    notes: [
      'K-means groups days that are close in the selected feature or component space. The four groups shown are illustrative. We have not established that the real data contains exactly four clusters.',
      'After fitting, we would inspect each cluster’s feature patterns. We might find calm days, high-demand days, supply-loss days, or mixed conditions. We choose the number of clusters using several checks, not only an elbow chart, and test whether the groups remain stable across seasons.',
      'Clustering does not predict a future day by itself. We must define how information available today creates a warning and test that rule against future outcomes. Mariano will explain that bridge and how we will judge success.',
    ], cue: 'Let the clusters illustrate similarity. Do not describe the animation as a real training run.', bridge: 'Mariano will connect these patterns to a testable warning proposal.',
  },
  {
    id: 'outlook', chapter: '05 / The test', title: 'From a pattern', accent: 'to a testable warning.',
    summary: 'A useful warning needs an issue time, a future horizon, and inputs that truly existed when it was issued.',
    speaker: 'Mariano', seconds: 85, scene: 'grid', label: 'Concept screen · No live feed or operational forecast', visual: 'outlook',
    points: [{ title: 'Known at issue time', text: 'Lagged observations and authorized forecasts where available.' }, { title: 'Defined decision rule', text: 'Relate stress profiles to later alerts using training data.' }, { title: 'Explain the evidence', text: 'Show drivers, source freshness, uncertainty, and the target period.' }],
    notes: [
      'Thank you, Nuril. The proposed output is an outlook that shows a target grid, a future time window, the main contributing signals, and the freshness of the evidence.',
      'There is an important missing step between clustering and forecasting. At each issue time, we must use only information available then. Candidate inputs include lagged observations and weather or demand forecasts if access is available. We then train or calibrate a rule relating those features and stress profiles to later alerts.',
      'For historical backtesting, we need archived forecasts as issued—not the weather that actually happened later. If those archives are unavailable, we must narrow the claim to an observation-based warning or retrospective analysis. This screen is a concept only; it does not calculate a probability or send a real warning.',
    ], cue: 'Point to the issue-time and freshness labels. Do not promise a seven-day forecast.', bridge: 'We will judge the warning against simple baselines on unseen periods.',
  },
  {
    id: 'validation', chapter: '05 / The test', title: 'Prove the value.', accent: 'Before promising it.',
    summary: 'Evaluate on later periods, compare simple baselines, and measure the cost of both missed alerts and false warnings.',
    speaker: 'Mariano', seconds: 85, scene: 'clusters', label: 'Evaluation plan · Aspirational targets, not achieved results', visual: 'validation',
    points: [{ title: 'Chronological backtesting', text: 'Train on earlier periods; validate thresholds; test on later periods.' }, { title: 'Useful comparisons', text: 'Persistence and reserve-margin rules, evaluated on the same horizons.' }, { title: 'Responsible pilot', text: 'Data agreements, access controls, audit trails, and human review.' }],
    notes: [
      'We would use rolling chronological backtests. Earlier data fits the transformations and model; a validation period sets warning thresholds; a later test period remains untouched until evaluation.',
      'We compare against simple baselines, such as persistence and a reserve-margin rule, with the same data availability and warning horizon. Our proposed targets are to catch at least 80 percent of alert events, keep the false-warning share below 20 percent, and investigate a three-day lead time. These are aspirations to discuss during the pilot, not measured performance.',
      'We must define what counts as an event and how repeated warnings match it. We also report uncertainty, missed events, and actual data freshness by source. Restricted data, rare alerts, seasonal change, and publication delays remain limitations. Initial outputs should support authorized human review, not replace NGCP advisories.',
    ], cue: 'The appendix defines recall, false-warning share, and lead time. Keep those formulas out of the main explanation.', bridge: 'That brings us back to the central idea.',
  },
  {
    id: 'closing', chapter: '05 / The takeaway', title: 'Connected evidence.', accent: 'Better preparation.',
    summary: 'Integrate the data. Explain the patterns. Test whether they give useful warning.',
    speaker: 'Mariano', seconds: 40, scene: 'grid', label: 'Thank you · Questions & discussion',
    points: [{ title: 'Our contribution', text: 'A traceable, explainable framework for a Visayas-first pilot.' }, { title: 'Our boundary', text: 'An evaluated research proposal—not a proven alert service.' }],
    notes: [
      'To conclude: the reported alerts show why grid stress matters. Our proposal connects fragmented grid, market, and weather information in a traceable lakehouse and warehouse.',
      'Correlation, PCA, and clustering help us investigate relationships and recurring patterns. A separate, time-aware warning rule and honest validation determine whether those patterns actually help us prepare earlier.',
      'Our goal is not to replace the grid operator or promise that we can prevent a blackout. It is to build and test a clearer evidence base for earlier preparation. Thank you. We welcome your questions.',
    ], cue: 'Stop the timer. Leave this slide up for questions; open the appendix only when needed.', bridge: 'End of main presentation. Thirty seconds are reserved for transitions or recovery.',
  },
  {
    id: 'appendix-model', chapter: 'Appendix A / Warehouse', title: 'Different facts.', accent: 'Different grains.', summary: 'Use conformed dimensions; avoid joining raw fact rows in ways that duplicate measures.', speaker: 'Barsomo', seconds: 0, scene: 'lake', label: 'Optional defense detail', appendix: true,
    points: [{ title: 'fact_grid_interval', text: 'Grid × interval_end. Measures + source resolution + publication/ingestion time.' }, { title: 'fact_grid_alert', text: 'One alert event/window × grid. Level, start, end, source reference.' }, { title: 'fact_plant_outage', text: 'Plant × outage event/version. Unavailable MW and validity window.' }],
    notes: ['Use dim_grid, dim_time, dim_date, dim_plant, and source metadata as appropriate to each fact. Do not attach a plant dimension directly to a grid-level fact as if the grain were plant-level.', 'Aggregate facts to a compatible grain before joining. Roll up grid-day events to month, drill down to event windows, slice Visayas, or dice a grid set and date range. Sum only additive measures: prices and capacity snapshots generally require suitable averages, weighted aggregation, or point-in-time handling.'], cue: 'Answer the specific grain or OLAP question; do not present the entire appendix.', bridge: 'Return to the closing slide when finished.',
  },
  {
    id: 'appendix-metrics', chapter: 'Appendix B / Validation', title: 'Define success', accent: 'before testing.', summary: 'Fix event matching, warning windows, horizons, and thresholds before evaluating the held-out period.', speaker: 'Mariano', seconds: 0, scene: 'clusters', label: 'Metric definitions · Targets remain provisional', appendix: true,
    points: [{ title: 'Event recall ≥80% (target)', text: 'Alert events warned in advance ÷ eligible alert events.' }, { title: 'False-warning share <20% (target)', text: 'Unmatched warning episodes ÷ all warning episodes. This is not FP/(FP+TN).' }, { title: 'Lead time: investigate 3 days', text: 'Event onset minus first qualifying warning issue time; report distribution and misses.' }],
    notes: ['Define eligible alerts, merge repeated warning episodes, and specify the matching window before evaluation. Report each metric by grid, season, and horizon with uncertainty. Targets require stakeholder agreement and may be revised.', 'The false-warning share is one minus episode-level precision, not the classical false-positive rate. Do not pool different horizons or repeatedly count the same event to inflate performance. Freshness is source-specific; a five-minute scoring schedule does not make daily advisories five-minute fresh.'], cue: 'Explain the denominator. That prevents most metric misunderstandings.', bridge: 'Return to the closing slide when finished.',
  },
  {
    id: 'appendix-limits', chapter: 'Appendix C / Scope & risks', title: 'Clear boundaries.', accent: 'Credible research.', summary: 'No operational accuracy, live data access, or causal finding is claimed by this presentation.', speaker: 'Corpuz', seconds: 0, scene: 'signals', label: 'Limitations & safeguards', appendix: true,
    points: [{ title: 'Availability and quality', text: 'Restricted feeds, late reports, inconsistent names, missing forecast archives.' }, { title: 'Analytical limitations', text: 'Few rare events, confounding, seasonal drift, sensitivity to k and scaling.' }, { title: 'Governance', text: 'Authorized access, encryption, audit logs, human review, coordinated release.' }],
    notes: ['Use public aggregate data first. Seek agreements before accessing restricted plant or market information. Current scope does not require personal data. A smart-meter extension would need a separate privacy and legal review, including the Data Privacy Act of 2012.', 'Begin with a retrospective Visayas pilot. Benchmark a simple local analytical baseline before provisioning a cluster. Monitor missingness, failed jobs, feature drift, and warning quality. Refresh models only after evaluating the change; seasonal retraining is a candidate schedule, not a guarantee.'], cue: 'Acknowledge a limitation directly, then explain how the pilot tests or mitigates it.', bridge: 'Return to the closing slide when finished.',
  },
  {
    id: 'appendix-questions', chapter: 'Appendix D / Quick answers', title: 'The short answer.', accent: 'Then the evidence.', summary: 'Start with one direct sentence. Add detail only if the panel asks.', speaker: 'Soriano', seconds: 0, scene: 'grid', label: 'Defense prompts · Full answers in docs/DEFENSE-QA.md', appendix: true,
    points: [{ title: 'Does k-means predict alerts?', text: 'No. It groups similar days; a separate time-aware warning rule must be validated.' }, { title: 'Why a lakehouse and a warehouse?', text: 'Preserve raw evidence while serving consistent, structured analytical queries.' }, { title: 'What is already implemented?', text: 'This presentation and its teaching visuals—not the data platform or forecast model.' }],
    notes: ['Soriano coordinates questions and routes data access to Corpuz, architecture to Barsomo, methods to Nuril, and validation to Mariano.', 'If the panel requests results, explain that this is a proposal and no fitted dataset results are claimed. Avoid inventing a coefficient, cluster score, runtime improvement, or alert probability.'], cue: 'Let the assigned presenter answer. Do not have all five speak at once.', bridge: 'Return to the closing slide when finished.',
  },
  {
    id: 'references', chapter: 'Appendix E / Evidence', title: 'Know the source.', accent: 'Keep the distinction.', summary: 'The reported figures, illustrative calculations, and proposed targets are deliberately separated.', speaker: 'Soriano', seconds: 0, scene: 'grid', label: 'References · Links open the original articles', appendix: true,
    points: [{ title: 'Reported', text: '123 alert occurrences; October 20 available capacity, demand, and unavailable capacity.' }, { title: 'Illustrative', text: '3D scenes, grid connections, data sizing, teaching simulator, and outlook layout.' }, { title: 'Proposed', text: 'Infrastructure, analysis, warning rule, performance targets, and rollout.' }],
    sources: [1, 2, 3], notes: ['Sources are secondary reports or an industry article, not a complete operational dataset. Build a verified primary-source data inventory before implementation.', 'Full references and design/data attribution are included in docs/SOURCES.md. The original 24-slide files are preserved in originals/ for comparison.'], cue: 'Open a citation only if asked. Do not depend on internet access during the explanation.', bridge: 'Return to the closing slide when finished.',
  },
];
export const mainSlides = slides.filter(s => !s.appendix);
export const speakers: Speaker[] = ['Soriano', 'Corpuz', 'Barsomo', 'Nuril', 'Mariano'];
export const budgetSeconds = 20 * 60;
export function slideIndex(hash: string): number {
  const match = /^#slide-(\d+)$/.exec(hash);
  return match ? Math.max(0, Math.min(slides.length - 1, Number(match[1]) - 1)) : 0;
}
export function balance(available: number, demand = 2545) {
  const regulating = demand * 0.04;
  const contingency = 150;
  return { margin: available - demand, regulating, contingency, state: available < demand + regulating ? 'Red alert' : available < demand + regulating + contingency ? 'Yellow alert' : 'Normal' };
}
