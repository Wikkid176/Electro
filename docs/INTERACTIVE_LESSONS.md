# Interactive teaching and coaching: 0.4.0-beta.3

The course now has 235 authored explanatory sections across 47 lessons. Each lesson begins with two core sections and offers three expandable deep dives: mechanism, misconception and application. This keeps the main path readable while supporting more detailed study. Worked examples reveal the coach's reasoning one step at a time. Guided practice and the original three-question quiz remain separate.

Every quiz question has two authored hints, keyed by its stable lesson ID and question index: 141 initial nudges and 141 deeper reasoning hints. There is no repeated category fallback. **Coach hint** shows the relevant nudge; **Work through this hint** adds the second level. Extra help resumes with the quiz checkpoint. Hiding the hint clears expanded visibility, and a new question starts with its own hints hidden. Existing study metrics continue to count questions on which any hint was used; they do not count each expansion as a separate answer or hint event.

All 47 lesson visuals include vector graphics with selected-state highlighting and full explanatory text. The eight scene layouts include illustrated energy maps, relationship diagrams, comparisons, meter faces, document stacks, proportional plots, timelines and evidence chains. Diagram taps and accessible text controls select the same explanation. Original generated component images remain available with labeled parts. A circuit-return arrow remains distinct from a protective-earth symbol, and selecting a static diagram item does not change its depicted contact operating state.

Seven experiment types are embedded in 13 relevant lessons:

| Experiment | What changes |
| --- | --- |
| Energy and STOP | Motion command changes while the displayed supply/stored-energy paths remain |
| Ohm's-law bench | 12/24 V and 120/240 Ω alter current and power |
| Series/parallel network | Two 60 Ω resistors at 12 V; opening one branch has topology-dependent effects |
| Starter holding state | Start, stop, overload trip and reset; reset alone does not restart |
| On-delay timer | A three-second uninterrupted enable interval; removal resets timing |
| Analog scaling | Valid 4–20 mA maps to −10 to 50 °C; invalid input is not reported as valid temperature |
| Event sampling | A 5–10 ms disturbance can be missed by 20 ms samples and captured by 2 ms samples |

The models are limited to their stated assumptions. They operate only inside the app. No external equipment interface, field pinout, source print or proprietary image is included. Learning activities award no additional XP; the quiz maximum remains 3,525 XP.

Repetitive fiction/provenance labels were removed from learner-facing examples and reference cards. Mathematical conditions and relevant technical distinctions remain explicit. Reference-rights handling stays in development documentation. Wording-only edits have an explicit checkpoint migration: an older checkpoint is accepted only when its mapped current fingerprint matches the exact unchanged answer structure. Changed answers or ordering still reject stale checkpoints.

Android uses the same package and signing certificate with versionName 0.4.0 and versionCode 3. Install over the earlier beta to retain scores. Earlier 0.2.0-beta.1 and 0.3.0-beta.2 study records stay exportable but paused; export and start a new record before collecting results for this version. Guided reading, experiments and visible idle time contribute to estimated foreground study time. Old synthetic timings remain historical and do not measure this expanded course.

SVG rendering uses Expo's recommended `react-native-svg` 15.16.0. Notices for its 13 added packages are included in the app. Installed notices were preserved; the missing boolbase notice was obtained from its declared upstream repository with the source URL and checksum recorded. Earlier dependency-review gaps remain documented and no legal clearance is claimed. Native compilation and browser verification do not replace qualified content review or physical-phone testing.
