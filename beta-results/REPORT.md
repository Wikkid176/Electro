# ELECTRO simulated beta report

October 19, 2026 · electro-beta-2026-10-19-v1 · 12 profiles, as confirmed by the user

**This is an automated synthetic beta, not a study with real people.** Browser interactions and app scores were checked against deliberately generated answer plans. The accuracy differences and study times below come from unvalidated assumptions about prior knowledge, reading pace and decision time. They do not establish what any age group will learn or how real users will perform.

## Scope and results

All 12 isolated browser journeys passed: **564 mission completions, 1,692 graded mission answers, 144 component answers, 48 practical navigation/state tasks and four mid-course reload/resume checks**. Saved scores and XP matched each answer plan after reload. No uncaught page errors or browser console errors occurred in these journeys. No horizontal overflow was detected at the tested quiz states across 320, 390 and 1,280 pixel viewport widths. Four profiles activated controls with keyboard focus and Enter; eight used pointer activation. This does not replace a screen-reader audit, native touch testing or visual review on physical phones.

“Completion” here means one attempt at all 47 missions plus a practice pass through all four labs. It does not mean mastering all missions. Mastery requires 3/3 in a mission; repeat attempts to achieve full mastery are excluded from the time estimates. Scripted 12/12 completion is an automation result, not a prediction of human retention or dropout.

## Group metrics

First-pass quiz and workshop performance is simulated. Times include the four labs and represent active study, without breaks.

| Group | Profiles | Mean estimated study time | Profile time range | Quiz correct | Workshop correct | Mean first-pass mastered |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Adults 30–45 / novice | 5 | 3h 18m | 2h 46m–4h 00m | 415/705 (58.9%) | 42/60 (70.0%) | 10.4/47 |
| Teens / assumed novice | 2 | 3h 29m | 3h 04m–3h 53m | 169/282 (59.9%) | 16/24 (66.7%) | 11.0/47 |
| Adults 18–30 / novice | 2 | 2h 58m | 2h 47m–3h 09m | 177/282 (62.8%) | 16/24 (66.7%) | 12.0/47 |
| Electrical professionals | 3 | 2h 00m | 1h 45m–2h 17m | 385/423 (91.0%) | 33/36 (91.7%) | 34.7/47 |
| All profiles | 12 | 2h 57m | 1h 45m–4h 00m | 1146/1692 (67.7%) | 107/144 (74.3%) | 16.8/47 |

The overall averages weight each profile equally (5/2/2/3), rather than weighting the four groups equally. Overall median estimated time: **3h 05m**. Overall mean XP: **2388 / 3,525**. Each profile completed 47 missions and four lab tasks. The two teens were assumed to have no formal electrical training because their prior knowledge was unspecified.

## Individual metrics

| Profile | Age | Group | Estimated active study | Quiz correct | Missions mastered | Workshop | XP |
| --- | ---: | --- | ---: | ---: | ---: | ---: | ---: |
| A01 | 30 | Adults 30–45 / novice | 3h 09m | 84/141 (59.6%) | 9/47 | 9/12 | 2100 |
| A02 | 34 | Adults 30–45 / novice | 4h 00m | 73/141 (51.8%) | 6/47 | 8/12 | 1825 |
| A03 | 38 | Adults 30–45 / novice | 2h 46m | 98/141 (69.5%) | 20/47 | 7/12 | 2450 |
| A04 | 42 | Adults 30–45 / novice | 3h 30m | 85/141 (60.3%) | 11/47 | 8/12 | 2125 |
| A05 | 45 | Adults 30–45 / novice | 3h 06m | 75/141 (53.2%) | 6/47 | 10/12 | 1875 |
| T01 | 16 | Teens / assumed novice | 3h 04m | 86/141 (61.0%) | 11/47 | 9/12 | 2150 |
| T02 | 17 | Teens / assumed novice | 3h 53m | 83/141 (58.9%) | 11/47 | 7/12 | 2075 |
| Y01 | 22 | Adults 18–30 / novice | 3h 09m | 91/141 (64.5%) | 13/47 | 7/12 | 2275 |
| Y02 | 28 | Adults 18–30 / novice | 2h 47m | 86/141 (61.0%) | 11/47 | 9/12 | 2150 |
| P01 | 32 | Electrical professionals | 1h 59m | 132/141 (93.6%) | 38/47 | 11/12 | 3300 |
| P02 | 41 | Electrical professionals | 2h 17m | 126/141 (89.4%) | 32/47 | 10/12 | 3150 |
| P03 | 37 | Electrical professionals | 1h 45m | 127/141 (90.1%) | 34/47 | 12/12 | 3175 |

## Bugs reproduced and fixed

Three pre-fix phone checks failed, then passed after changes:

1. **Unfinished quizzes were lost on reload.** A mid-mission refresh returned to the home page with no answer checkpoint. Added one validated local checkpoint, explicit Resume/Discard actions, checked-answer/feedback and hint restoration, and completion cleanup. Partial answers do not award XP. Completed scores use their existing separate storage key. Invalid, stale or impossible checkpoints are rejected; question changes invalidate the checkpoint. Starting a different mission replaces the previous checkpoint, as explained on screen.
2. **Selected control states were missing from the browser accessibility tree.** Root navigation tabs lacked aria-selected and mission radios lacked aria-checked. Added explicit states, a mission answer group, meter pressed states and drawing-sheet selection states, while keeping native accessibility state. This is a programmatic accessibility correction; speech output on real assistive technology still needs testing.
3. **A mastered path still recommended mission one as the next new task.** With all 47 scores at 3/3, the home page offered Start mission 01. It now shows Learning path mastered and a Review mastered missions action leading to Progress.

Regression coverage also checks an unchecked selected answer with an open hint, checkpoint discard without score loss, checkpoint-only read failure while completed scores still save, and malformed/stale checkpoint rejection. Complete verification totals and build outcomes are recorded in [validation.json](validation.json).

Final verification: **23 model/content tests, 44 phone/desktop browser cases and 12 synthetic journeys passed (79 distinct checks)**. The strengthened discard assertion also passed a focused phone/desktop rerun. TypeScript checks and web, Android and iOS JavaScript exports succeeded. Native signed packages and physical-device tests are still pending.

Review the corrected phone screens: [unfinished mission with Resume/Discard](screenshots/phone-resume.png) and [fully mastered learning path](screenshots/phone-mastered.png).

## Model and reproducibility

Source and model hashes are in [summary.json](summary.json). Raw individual answer plans/results are in individual/; [individual-metrics.csv](individual-metrics.csv) and [group-metrics.csv](group-metrics.csv) open in a spreadsheet. [playwright-beta.json](playwright-beta.json) records runner outcomes and automation wall time. Automation wall time is not study time.

The answer model uses a deterministic 32-bit LCG seeded separately for each profile: seed = (1664525 × seed + 1013904223) modulo 2^32. Each question draws correctness against the probability below plus the individual offset, then a distractor and optional-hint draw. A failed draw selects a uniformly sampled incorrect choice. This uses the answer key; it does not represent independent electrical reasoning. Hints do not increase the modeled success probability. There is no modeled learning gain, fatigue, or dependence between answers. Professional profiles have higher probabilities only because that prior-knowledge assumption was explicitly chosen. Age is never used in the formulas.

| Topic | Assumed novice probability | Assumed professional probability |
| --- | ---: | ---: |
| Safety | 78.0% | 93.0% |
| Fundamentals | 56.0% | 87.0% |
| Meters | 56.0% | 90.0% |
| Print reading | 55.0% | 88.0% |
| Reference skills | 57.0% | 86.0% |
| Panel build | 58.0% | 90.0% |
| Troubleshooting | 68.0% | 92.0% |
| Motors and drives | 54.0% | 90.0% |
| Sensors | 55.0% | 89.0% |
| Automation | 60.0% | 90.0% |

Workshop probabilities before the individual offset: novice identification 70%, novice visible-defect identification 62%, professional 92%. These numbers are illustrative scenario settings, not validated pass rates. Differences between the three novice age groups are random-seed and pace/input differences, not age findings. No real subgroup ranking is supported by this small synthetic sample.

| Profile | Technical reading words/min | Decision seconds/question | Probability offset | Hint probability | Lab minutes | Viewport / input | Mid-course reload |
| --- | ---: | ---: | ---: | ---: | ---: | --- | --- |
| A01 | 180 | 24 | +0 | 30.0% | 34 | 390×844 / pointer | Yes |
| A02 | 150 | 30 | -0.04 | 45.0% | 40 | 320×740 / pointer | No |
| A03 | 205 | 22 | +0.04 | 20.0% | 30 | 1280×900 / keyboard | No |
| A04 | 165 | 28 | -0.02 | 35.0% | 36 | 390×844 / pointer | No |
| A05 | 190 | 25 | +0.02 | 25.0% | 32 | 1280×900 / keyboard | No |
| T01 | 190 | 25 | +0.02 | 25.0% | 32 | 390×844 / pointer | Yes |
| T02 | 150 | 30 | -0.04 | 45.0% | 40 | 320×740 / pointer | No |
| Y01 | 180 | 24 | +0 | 30.0% | 34 | 1280×900 / keyboard | No |
| Y02 | 205 | 22 | +0.04 | 20.0% | 30 | 390×844 / pointer | Yes |
| P01 | 240 | 13 | +0 | 8.0% | 22 | 1280×900 / keyboard | No |
| P02 | 220 | 16 | -0.02 | 12.0% | 25 | 390×844 / pointer | Yes |
| P03 | 260 | 11 | +0.02 | 5.0% | 20 | 390×844 / pointer | No |

Active study minutes = (13,497 lesson/question/answer/feedback words + 319 reference-card words + selected hint words + one extra feedback reread per wrong answer) / reading words per minute + 141 × decision seconds / 60 + 47 × navigation seconds / 60 + 8 seconds reflection per used hint + lab allowance + one minute recovery for profiles with an interruption. Reference cards are counted once per unique card ID within each lesson. Lab allowances include reading, exploration and the 12 workshop rounds. Navigation input assumes 4–9 seconds per mission; routine tapping time is included in decision/lab allowances. The app's displayed mission estimates total 231 minutes, independently of this model.

Reading, decisions and lab allowances have not been calibrated with humans. As a simple sensitivity check, changing every time input by ±20% changes the overall estimated mean from **2h 22m to 3h 32m**. This is not a confidence interval. Breaks, optional component exploration beyond the lab allowance, remediation, and physical-equipment work are excluded.

## What this beta establishes

The current browser build can complete these scripted paths, score mixed correct/incorrect answers, preserve local records, recover four interrupted missions, render component art, and run the practical models. It does not establish educational effectiveness, electrical competence, real-user satisfaction, accessibility certification or native-device reliability. The assumed professional score advantage cannot be claimed as a measured finding.

The next useful validation is a real supervised pilot using these same 5/2/2/3 cohorts, recording active study time, first-attempt answers, hints, abandonment, delayed retention and task comprehension. All teens' activities should remain conceptual and supervised. Qualified electrical reviewers and real Android/iOS testing remain release prerequisites.

## Rerun

From the repository root with the README cloud cache variables set:

```sh
ELECTRO_TEST_PORT=8091 npm run test:beta
npm run report:beta
```

Do not edit app or model sources during a run. The report generator refuses a failed or incomplete runner result. Review the transparent assumptions before interpreting any simulated score or time.
