# Corpuz

Your segment of the 20-minute defense. Full running order: [PRESENTATION-SCRIPT.md](../PRESENTATION-SCRIPT.md).

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

