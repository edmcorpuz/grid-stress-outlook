# What changed from the original

## Simplified redesign (29 October 2026)

- Restored strict compliance with the nine-part presentation format: 17 main slides, each labeled with its part, in order, with nothing added. The introduction to the field and "why big data" are back in Part 1, and limitations, ethics and privacy are back in the main talk (slide 16) instead of only the appendix.
- Cut on-screen text to a headline, an optional big number and up to four short points per slide (a test enforces about 20 words). The full explanation lives in the speaker notes, presenter window and printed script.
- Replaced long per-slide disclaimers with one small tag: Reported, Illustrative or Proposed.
- Replaced the four reused 3D modes with one continuous world: the Philippines at the center and seven stations around it (data cubes, signal streams, four source pillars, lakehouse shelves, star schema, time tunnel, analysis cloud). The camera flies to a new shot on every slide; the finale pulls back to show all stations connected.
- Controls now hide while the mouse is still; only a thin progress line stays visible.
- Rebalanced speakers to the format: Soriano 1–5, Corpuz 6–8, Barsomo 9–11, Nuril 12–14, Mariano 15–17.
- Applied the data notes from the original conversation: PAGASA data is mostly daily (often Excel on request), the DOE plant list is a periodic PDF, IEMOP also publishes day-ahead and week-ahead projections, and NGCP/DOE already publish outlooks, so the contribution is framed as integrated pattern analysis.

## Earlier rebuild

- Replaced the 24-slide, game-HUD presentation with 16 core slides and 5 optional technical appendix slides.
- Created a 19:30 speaking schedule plus 0:30 buffer within the user's 20-minute limit.
- Assigned Soriano (leader), Corpuz, Barsomo, Nuril, and Mariano in order, with explicit handoffs and individual scripts.
- Removed compulsory mini-games, achievements, sound effects, and multiple timed interactions. No live demo is required to finish the explanation.
- Retained the domain introduction, evidence, gap, objectives, sources, big-data sizing, architecture, dimensional model, preprocessing, methods, deployment concept, monitoring, ethics, limitations, conclusion, and references. Detailed OLAP and risk discussion moves to the appendix/script.
- Checked the primary figures used in the main story against the cited news articles. Corrected the distinction between alert occurrences, unique alert days, and actual blackouts.
- Replaced the absolute “no integrated framework exists” claim with a narrower, defensible study proposal.
- Corrected scalar values versus rows; removed the misleading comparison of scalar values to Excel's row limit.
- Removed the claim that the proposed workload necessarily cannot fit on one machine, and replaced it with actual-workload benchmarking.
- Made the pilot batch-first. Kafka and streaming require an available, authorized timely feed.
- Distinguished observation resolution, publication time, validity, ingestion time, and data freshness. Daily data is not magically five-minute telemetry.
- Removed absolute “zero data lost” claims and explained checkpoints, replay, retention, and idempotent writes in the script/Q&A.
- Made chronological splitting and training-only preprocessing explicit.
- Labeled correlation relationships, PCA components, cluster names, and k=4 as hypotheses or illustrations—not measured findings.
- Added the missing bridge from exploratory clustering to a separately defined and validated warning rule.
- Required as-issued historical forecasts for forecast-input backtesting; retrospective realized weather cannot substitute without leakage.
- Defined recall and false-warning share, treated three-day lead time as a target to investigate, and separated proposed performance from achieved performance.
- Added same-horizon baselines, event-matching rules, and human review.
- Rebuilt 3D illustrations with local assets, bounded rendering resolution, reduced-motion support, a motion toggle, and a static fallback.

The original uploaded files remain unchanged in `originals/`.
