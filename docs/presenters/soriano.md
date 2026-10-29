# Soriano — Team leader

Your segment of the 20-minute defense. Full running order: [PRESENTATION-SCRIPT.md](../PRESENTATION-SCRIPT.md).

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

