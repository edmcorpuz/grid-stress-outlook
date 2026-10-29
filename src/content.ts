export type Shot = 'orbit' | 'flow' | 'blocks' | 'alerts' | 'balance' | 'scatter' | 'braid' | 'sources' | 'layers' | 'schema' | 'tunnel' | 'waves' | 'pca' | 'clusters' | 'outlook' | 'shield' | 'finale';
export type Speaker = 'Soriano' | 'Corpuz' | 'Barsomo' | 'Nuril' | 'Mariano';
export type Evidence = 'Reported' | 'Illustrative' | 'Proposed';
export interface Slide {
  id: string; part: number; title: string; accent: string;
  speaker: Speaker; seconds: number; shot: Shot; evidence: Evidence;
  points?: string[]; stat?: { value: string; unit: string };
  notes: string[]; cue: string; bridge: string; sources?: number[]; appendix?: string;
}
/** The professor's presentation format: nine parts, in this order, with nothing added. */
export const parts = ['Introduction', 'Statement of the problem', 'Objectives and research questions', 'Data source and characteristics', 'Data ingestion and storage', 'Data preprocessing', 'Exploration and analysis', 'Expected outcome and implementation', 'Conclusion'];
export const researchTitle = 'Grid Stress Pattern Analysis for Early Warning of Power Supply Shortfalls in the Philippine Power Grids';
export const evidenceMeaning: Record<Evidence, string> = {
  Reported: 'Figures from cited news reports of NGCP advisories.',
  Illustrative: 'A teaching visual or sizing example, not measured data.',
  Proposed: 'Our planned framework, method or target, not a result.',
};
export const references = [
  { id: 1, title: 'Visayas grid logs 123 alerts as supply falters', publisher: 'Daily Tribune / Philippine News Agency', date: '3 September 2026', url: 'https://tribune.net.ph/2026/09/03/visayas-grid-logs-123-alerts-as-supply-falters-2', status: 'Checked: 93 yellow + 30 red alerts; counts are not unique alert days.' },
  { id: 2, title: 'Visayas grid on red, yellow alerts on Tuesday, Oct. 20, 2026 — NGCP', publisher: 'GMA News', date: '20 October 2026', url: 'https://www.gmanetwork.com/news/topstories/regions/1006485/visayas-grid-on-red-yellow-alerts-on-tuesday-oct-20-2026-ngcp/story/', status: 'Checked: 2,468 MW available, 2,545 MW projected peak, 685 MW unavailable. News reporting of an NGCP advisory, not a raw telemetry dataset.' },
  { id: 3, title: 'Enhanced Electricity Market for the entire Philippine grid', publisher: 'BusinessWorld / Richard J. Nethercott', date: '6 August 2021', url: 'https://www.bworldonline.com/?p=387205', status: 'Checked: enhanced WESM transition to five-minute dispatch and settlement. Historical market coverage must be verified per grid.' },
];
export const slides: Slide[] = [
  {
    id: 'opening', part: 1, title: 'See the stress.', accent: 'Before the shortfall.',
    speaker: 'Soriano', seconds: 40, shot: 'orbit', evidence: 'Proposed',
    notes: [
      'Good morning, panel members. We are Group 3: Soriano, Corpuz, Barsomo, Nuril and Mariano. Our proposal is Grid Stress Pattern Analysis for Early Warning of Power Supply Shortfalls in the Philippine Power Grids.',
      'In one sentence: we propose combining grid, market and weather data so the warning signs of a supply shortfall can be studied together, instead of in separate reports.',
      'This is a research proposal, not a working forecast service. The 3D scenes are illustrations; they do not show live grid data.',
    ], cue: 'Start the timer as you begin. Introduce the team; do not explain the interface.', bridge: 'First, the field we are working in.',
  },
  {
    id: 'field', part: 1, title: 'Supply must meet demand.', accent: 'Every second.',
    speaker: 'Soriano', seconds: 50, shot: 'flow', evidence: 'Illustrative',
    points: ['Plants generate', 'NGCP transmits', 'Utilities deliver'],
    notes: [
      'Our field is energy and power systems analytics: studying how electricity is generated, transmitted and used so the grid stays balanced.',
      'Power plants generate electricity. NGCP operates the high-voltage grid across Luzon, Visayas and Mindanao. Distribution utilities and electric cooperatives deliver it to homes and businesses. DOE sets policy, ERC regulates, and IEMOP runs the electricity spot market.',
      'The basic rule is simple: supply must cover demand at every moment, plus a safety reserve. When that reserve gets too thin, NGCP raises a yellow or red alert.',
    ], cue: 'Point to the three glowing grids as you name them.', bridge: 'This field produces a lot of data, very quickly.',
  },
  {
    id: 'big-data', part: 1, title: 'A data machine.', accent: 'Every five minutes.',
    speaker: 'Soriano', seconds: 50, shot: 'blocks', evidence: 'Illustrative', sources: [3],
    stat: { value: '378M', unit: 'values a year · sizing example' },
    points: ['288 intervals a day', 'Values, not rows'],
    notes: [
      'Why is this a big data problem? Since 2021, the enhanced spot market dispatches and settles every five minutes. That is 288 intervals a day and 105,120 a year for a single data series.',
      'Take an example of 300 generating units with 12 measures each. That is about 378 million values a year. These are values, not rows; in a table with 12 measure columns it is about 31.5 million rows.',
      'Add weather, outage reports and several years of history, and we have volume, speed and variety at the same time. We would still measure the real dataset before deciding how much distributed processing it needs.',
    ], cue: 'Say “values, not rows.” Do not compare the number with Excel.', bridge: 'And this data matters, because the grid is under real stress.',
  },
  {
    id: 'alerts', part: 2, title: 'Not one bad day.', accent: 'A recurring problem.',
    speaker: 'Soriano', seconds: 50, shot: 'alerts', evidence: 'Reported', sources: [1],
    stat: { value: '123', unit: 'Visayas grid alerts, Jan–Sep 2026' },
    points: ['93 yellow', '30 red', 'Alerts, not blackout days'],
    notes: [
      'Now the problem. NGCP figures reported by the Daily Tribune show 123 Visayas grid alerts from January to September 3, 2026: 93 yellow and 30 red.',
      'These are alert counts. They are not 123 separate days, and not every alert caused a blackout. An alert warns that available supply cannot cover the required reserves.',
      'The point is that this keeps happening. That makes Visayas a sensible pilot for our study.',
    ], cue: 'Read the total and the split, then pause. Do not read the citation aloud.', bridge: 'Here is what one of those alerts looks like in numbers.',
  },
  {
    id: 'margin', part: 2, title: 'A small gap.', accent: 'A serious warning.',
    speaker: 'Soriano', seconds: 50, shot: 'balance', evidence: 'Reported', sources: [2],
    stat: { value: '−77', unit: 'MW · Visayas, 20 Oct 2026' },
    points: ['2,468 MW available', '2,545 MW peak demand'],
    notes: [
      'On October 20, GMA News reported 2,468 megawatts available against a projected peak of 2,545 megawatts in the Visayas. That is 77 megawatts short, and the grid went on red alert for part of the day.',
      'Yellow means the operating margin cannot cover the contingency requirement. Red means supply cannot cover demand plus the regulating requirement. So red is possible even when supply is slightly above demand, and it does not automatically mean every customer loses power.',
      'Optional: the what-if slider is a simplified teaching model. Its 4 percent regulating and 150-megawatt contingency requirements are assumptions, not NGCP’s actual calculation.',
    ], cue: 'Point to the gap at the top of the columns. Optional: drag supply to 2,700 MW to show yellow, then reset. Skip it if behind time.', bridge: 'Corpuz will explain why warnings like this are hard to see early.',
  },
  {
    id: 'problem', part: 2, title: 'The signals exist.', accent: 'They’re scattered.',
    speaker: 'Corpuz', seconds: 75, shot: 'scatter', evidence: 'Illustrative',
    points: ['Supply · outages, capacity', 'Demand · market intervals', 'Weather · heat, rain'],
    notes: [
      'Thank you, Soriano. Our problem statement: the warning signs of a shortfall already exist, but they are spread across separate sources, formats and schedules.',
      'Grid advisories, market tables and weather records use different names, time stamps and formats. They are mostly read after the fact, and alerts are usually announced on the day itself.',
      'NGCP and DOE do publish supply outlooks, so we are not claiming nothing exists. What is missing for our study is one traceable, combined view that lets us test whether patterns in this data give useful early warning.',
    ], cue: 'Use the three signal groups as your speaking guide.', bridge: 'That gives us one objective and three questions.',
  },
  {
    id: 'objectives', part: 3, title: 'One objective.', accent: 'Three questions.',
    speaker: 'Corpuz', seconds: 80, shot: 'braid', evidence: 'Proposed',
    points: ['Which signals move with stress?', 'Can fewer factors summarize them?', 'Which stress-day types repeat?'],
    notes: [
      'Our general objective is to design and evaluate a framework that combines grid, market and weather data to find grid-stress patterns and test possible early-warning signals.',
      'Three questions guide the analysis. First, which signals move with stress, and do any move earlier? We answer that with correlation. Second, can a few factors summarize many overlapping signals? That is PCA. Third, which types of stress days repeat? That is clustering.',
      'A supporting objective is engineering: build traceable storage and warehouse tables so every result can be checked. “Early warning” is our research goal, not a result we have already achieved.',
    ], cue: 'Point to each question once. Name each method only once.', bridge: 'To answer them, we need four sources.',
  },
  {
    id: 'sources', part: 4, title: 'Four sources.', accent: 'One shared clock.',
    speaker: 'Corpuz', seconds: 85, shot: 'sources', evidence: 'Proposed',
    points: ['NGCP · grid alerts', 'IEMOP · 5-minute market data', 'DOE · power plant list', 'PAGASA · daily weather'],
    notes: [
      'NGCP advisories give alert periods and reported grid conditions. IEMOP market data gives five-minute observations such as demand and prices, plus day-ahead and week-ahead projections. DOE’s list of existing power plants is a PDF updated from time to time. PAGASA weather data is mostly daily and is often provided as Excel files on request.',
      'So the sources differ in format, frequency and access. We would line them up on one Philippine time standard while keeping each source’s original time stamp and publication time. Five-minute market data does not make daily weather five-minute fresh.',
      'Public reports can support a first, retrospective pilot. More detailed or timely feeds would need data agreements. Our first task is an inventory: what exists, how often, how late, and with what permission.',
    ], cue: 'Stress “publication time” and “access.” These are likely panel questions.', bridge: 'Barsomo will show how we would store these sources.',
  },
  {
    id: 'lakehouse', part: 5, title: 'Keep the original.', accent: 'Build trust in layers.',
    speaker: 'Barsomo', seconds: 85, shot: 'layers', evidence: 'Proposed',
    points: ['Raw · as received', 'Clean · checked', 'Curated · ready to analyze'],
    notes: [
      'Thank you, Corpuz. For ingestion, we start batch-first: Airflow collects files on a schedule and checks them on arrival. Kafka streaming is optional later, only if an authorized real-time feed exists.',
      'For storage, think of a lakehouse as three shelves. Raw keeps exactly what we received. Clean holds standardized, checked records. Curated holds analysis-ready tables. We propose object storage such as S3, Parquet files and Delta tables, with Spark as a candidate for large transformations.',
      'Every record keeps its source, load time and processing version, so any result can be traced back to the original file and reproduced.',
    ], cue: 'Explain Raw → Clean → Curated. Avoid a tool-by-tool lecture.', bridge: 'On top of the curated layer sits the warehouse.',
  },
  {
    id: 'warehouse', part: 5, title: 'One row.', accent: 'One grid. Five minutes.',
    speaker: 'Barsomo', seconds: 85, shot: 'schema', evidence: 'Proposed',
    points: ['fact_grid_interval at the center', 'Grid and time dimensions', 'Alerts and outages: own tables'],
    notes: [
      'The warehouse uses a star schema. The main fact table, fact_grid_interval, has one row per grid per five-minute interval, where real observations support that level. It holds demand, available capacity, imports, price and the derived margin.',
      'Grid and time dimensions let us filter and summarize. Alerts and plant outages are separate fact tables, because an alert window or an outage is not the same thing as a five-minute interval.',
      'This supports OLAP: roll up from intervals to days or months, drill down to an alert window, slice to Visayas, or dice by grid and season. A daily advisory is never copied across a day and treated as five-minute data.',
    ], cue: 'Memorize the grain. It is the most important warehouse answer.', bridge: 'Before analysis, the data has to be prepared.',
  },
  {
    id: 'preprocessing', part: 6, title: 'No peeking', accent: 'at tomorrow.',
    speaker: 'Barsomo', seconds: 70, shot: 'tunnel', evidence: 'Proposed',
    points: ['Standardize names, units, time', 'Build margin and weather features', 'Split by time; fit on training only'],
    notes: [
      'Preprocessing has three steps. First, standardize plant names, units and time stamps, remove duplicates, and flag missing intervals instead of hiding them.',
      'Second, build features such as supply margin, unavailable capacity, demand changes and weather summaries, usually per grid per day.',
      'Third, respect time. We split the history in order: earlier data for training, later data for testing. Scaling, gap filling, PCA and clustering are fitted on the training period only. A value recorded yesterday but published tomorrow cannot be used for a warning today.',
    ], cue: 'Emphasize the difference between when data is observed and when it is published.', bridge: 'Nuril will explain how we look for patterns.',
  },
  {
    id: 'correlation', part: 7, title: 'What moves together?', accent: 'And what comes first?',
    speaker: 'Nuril', seconds: 80, shot: 'waves', evidence: 'Illustrative',
    points: ['Pearson and Spearman', 'Lead and lag checks', 'Why: find candidate early signals'],
    notes: [
      'Thank you, Barsomo. Our first method is correlation. Pearson measures straight-line relationships; Spearman compares rankings and catches relationships that are not straight lines.',
      'We also check lags: does something observed earlier move with stress later? We account for seasons and daily cycles, which can create misleading matches.',
      'Why this method: it is a simple, transparent first screen. A strong correlation is a candidate signal, not proof of cause, and we test candidates on later, unseen periods. The waves on screen are synthetic.',
    ], cue: 'If asked for a correlation value, say it will be estimated from the real data.', bridge: 'Many of these signals overlap. PCA helps with that.',
  },
  {
    id: 'pca', part: 7, title: 'Many signals.', accent: 'A few directions.',
    speaker: 'Nuril', seconds: 80, shot: 'pca', evidence: 'Illustrative',
    points: ['PCA on standardized features', 'Read the loadings', 'Why: removes overlap'],
    notes: [
      'Principal component analysis, or PCA, combines overlapping measurements into a few new summary axes, called components.',
      'We read the loadings to see which variables drive each component. A name like “heat-driven demand” is something we would interpret after fitting, not a label we force.',
      'Why this method: it reduces redundancy so later steps are clearer. An 80 to 90 percent explained-variance threshold is a starting guide, but we also check that the components keep information that matters for alerts. The points are synthetic.',
    ], cue: 'Say “summary axes” if the panel wants a simpler explanation.', bridge: 'In that summary space, we can look for groups of similar days.',
  },
  {
    id: 'clustering', part: 7, title: 'Stress has types.', accent: 'Let the data name them.',
    speaker: 'Nuril', seconds: 80, shot: 'clusters', evidence: 'Illustrative',
    points: ['k-means groups similar days', 'Choose k with evidence', 'Why: profiles to compare with alerts'],
    notes: [
      'k-means groups grid-days that look alike. The four groups on screen are an illustration; we have not shown that the real data has exactly four.',
      'After fitting, we would describe each group, for example calm days, high-demand days, supply-loss days or combined stress. We choose the number of groups using several checks, such as the elbow, silhouette scores and stability across seasons.',
      'Why this method: it is an interpretable way to find recurring stress profiles, which we can then compare with later alert rates. Clustering on its own does not predict tomorrow. Mariano will explain that next step.',
    ], cue: 'Do not describe the animation as a real training run.', bridge: 'Mariano will connect these patterns to a warning we can test.',
  },
  {
    id: 'outlook', part: 8, title: 'A warning', accent: 'you can test.',
    speaker: 'Mariano', seconds: 85, shot: 'outlook', evidence: 'Proposed',
    points: ['Catch 80% of alerts', 'Under 20% false warnings', 'Investigate 3 days ahead'],
    notes: [
      'Thank you, Nuril. The expected outcome is a hypothetical Grid Stress Outlook for planners: for each grid and future time window, it shows the stress level, the main drivers, and how fresh each data source is.',
      'A warning rule may only use information available when the warning is issued, such as recent observations and authorized forecasts. We test it with rolling backtests: train on earlier periods, test on later ones, and compare against simple baselines like a reserve-margin rule.',
      'Our targets are to catch at least 80 percent of alert events, keep false warnings under 20 percent, and investigate a three-day lead time. These are goals for a pilot, not results. Once running, we would monitor data freshness, failed jobs and warning quality, with human review of every warning.',
    ], cue: 'Say clearly: “targets, not results.” Do not promise a seven-day forecast.', bridge: 'We are just as clear about the limits.',
  },
  {
    id: 'limits', part: 8, title: 'Clear limits.', accent: 'Honest safeguards.',
    speaker: 'Mariano', seconds: 70, shot: 'shield', evidence: 'Proposed',
    points: ['Data access and quality', 'Rare events, seasonal drift', 'Privacy, security, human review'],
    notes: [
      'Limitations: some feeds are restricted or late, names are inconsistent, and archived forecasts may be missing. Alerts are rare, seasons change, and results depend on scaling and the number of clusters.',
      'Ethics and privacy: our scope uses public, aggregate grid data, not personal data. A future smart-meter extension would need its own privacy review under the Data Privacy Act of 2012. We would use access controls, encryption and audit logs.',
      'Implementation challenges include data agreements, cost and skills. Warnings support NGCP advisories and human decisions; they do not replace them.',
    ], cue: 'Name each limit directly, then say how the pilot tests or reduces it.', bridge: 'That brings us to our conclusion.',
  },
  {
    id: 'closing', part: 9, title: 'Connected evidence.', accent: 'Better preparation.',
    speaker: 'Mariano', seconds: 55, shot: 'finale', evidence: 'Proposed',
    points: ['Integrate the data', 'Explain the patterns', 'Test the warning'],
    notes: [
      'To conclude: the reported alerts show that grid stress is a recurring problem. Our proposal connects scattered grid, market and weather data in a traceable lakehouse and warehouse.',
      'Correlation, PCA and clustering help us find relationships and recurring stress patterns. A separate, time-aware warning rule and honest testing decide whether those patterns really help people prepare earlier.',
      'We are not replacing the grid operator or promising to prevent blackouts. We want to build and test a clearer evidence base for earlier preparation. Thank you, and we welcome your questions.',
    ], cue: 'Stop the timer. Leave this slide up for questions; open the appendix only when asked.', bridge: 'End of the main presentation. Thirty seconds are reserved for transitions.',
  },
  {
    id: 'appendix-model', part: 0, appendix: 'Appendix A · Warehouse grains', title: 'Different facts.', accent: 'Different grains.',
    speaker: 'Barsomo', seconds: 0, shot: 'schema', evidence: 'Proposed',
    points: ['fact_grid_interval — grid × interval end; measures, source resolution, publication and load time', 'fact_grid_alert — one alert window × grid; level, start, end, source', 'fact_plant_outage — plant × outage event; unavailable MW, valid window'],
    notes: ['Use dim_grid, dim_time, dim_date, dim_plant and source metadata as appropriate to each fact. Do not attach a plant dimension directly to a grid-level fact as if the grain were plant-level.', 'Aggregate facts to a compatible grain before joining. Roll up grid-days to months, drill down to alert windows, slice Visayas, or dice a set of grids and dates. Sum only additive measures: prices and capacity snapshots need averages, weighting or point-in-time handling.'],
    cue: 'Answer the specific grain or OLAP question; do not present the whole appendix.', bridge: 'Return to the closing slide when finished.',
  },
  {
    id: 'appendix-metrics', part: 0, appendix: 'Appendix B · Validation metrics', title: 'Define success', accent: 'before testing.',
    speaker: 'Mariano', seconds: 0, shot: 'outlook', evidence: 'Proposed',
    points: ['Event recall ≥ 80% (target) — alert events warned in advance ÷ eligible alert events', 'False-warning share < 20% (target) — unmatched warning episodes ÷ all warning episodes; not FP/(FP+TN)', 'Lead time: investigate 3 days — event start minus first qualifying warning'],
    notes: ['Define eligible alerts, merge repeated warning episodes, and fix the matching window before evaluation. Report each metric by grid, season and horizon, with uncertainty. Targets need stakeholder agreement and may change.', 'The false-warning share is one minus episode-level precision, not the classical false-positive rate. Do not pool different horizons or count the same event twice. Freshness is source-specific: scoring every five minutes does not make daily advisories five-minute fresh.'],
    cue: 'Explain the denominator. That prevents most metric misunderstandings.', bridge: 'Return to the closing slide when finished.',
  },
  {
    id: 'appendix-questions', part: 0, appendix: 'Appendix C · Quick answers', title: 'The short answer.', accent: 'Then the evidence.',
    speaker: 'Soriano', seconds: 0, shot: 'orbit', evidence: 'Proposed',
    points: ['Does k-means predict alerts? — No. It groups similar days; a separate warning rule must be tested.', 'Why a lakehouse and a warehouse? — Keep raw evidence, and serve consistent analytical queries.', 'What is already built? — This presentation and its visuals, not the data platform or model.'],
    notes: ['Soriano coordinates questions and routes data access to Corpuz, architecture and preprocessing to Barsomo, methods to Nuril, and validation and limits to Mariano.', 'If the panel asks for results, explain that this is a proposal and no fitted results are claimed. Never invent a coefficient, cluster score, runtime improvement or alert probability.'],
    cue: 'Let the assigned presenter answer. Do not have all five speak at once.', bridge: 'Return to the closing slide when finished.',
  },
  {
    id: 'references', part: 0, appendix: 'Appendix D · References', title: 'Know the source.', accent: 'Keep the distinction.',
    speaker: 'Soriano', seconds: 0, shot: 'finale', evidence: 'Reported', sources: [1, 2, 3],
    points: ['Reported — 123 alerts; 20 October supply and demand', 'Illustrative — 3D scenes, sizing example, what-if slider', 'Proposed — framework, warning rule, targets'],
    notes: ['Sources are news reports and an industry article, not a complete operational dataset. Build a verified primary-source data inventory before implementation.', 'Full references and attribution are in docs/SOURCES.md. The original 24-slide files are preserved in originals/ for comparison.'],
    cue: 'Open a citation only if asked. Do not depend on internet access during the explanation.', bridge: 'Return to the closing slide when finished.',
  },
];
export const mainSlides = slides.filter(s => !s.appendix);
export const speakers: Speaker[] = ['Soriano', 'Corpuz', 'Barsomo', 'Nuril', 'Mariano'];
export const budgetSeconds = 20 * 60;
export function slideIndex(hash: string): number {
  const match = /^#slide-(\d+)$/.exec(hash);
  return match ? Math.max(0, Math.min(slides.length - 1, Number(match[1]) - 1)) : 0;
}
export function partLabel(s: Slide): string {
  return s.appendix ?? `Part ${s.part} of 9 · ${parts[s.part - 1]}`;
}
export function balance(available: number, demand = 2545) {
  const regulating = demand * 0.04;
  const contingency = 150;
  return { margin: available - demand, regulating, contingency, state: available < demand + regulating ? 'Red alert' : available < demand + regulating + contingency ? 'Yellow alert' : 'Normal' };
}
