# Soriano — Team leader

Your segment of the 20-minute defense. Full running order: [PRESENTATION-SCRIPT.md](../PRESENTATION-SCRIPT.md).

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

