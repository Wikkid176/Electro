# ElectroLessonLab (ELL) status report

Updated October 19, 2026 · Human beta version 0.2.0-beta.1

## Status

The user selected ElectroLessonLab (ELL) as the app name and Android as the first human-beta target. The beta includes an opt-in local study record, first-attempt scoring separate from replayed best scores, approximate foreground timing, feedback notes and manual results sharing. Legacy course/checkpoint storage keys remain unchanged. See [HUMAN_BETA.md](HUMAN_BETA.md) and release validation in `releases/android/` for the current build status; previous synthetic results below are historical and are not human outcomes.

Current human-beta checks: TypeScript and all 27 model/content/study tests pass. All 50 distinct browser cases passed across the initial run (49 passes and one full-course phone time-budget failure) plus the successful focused phone-course rerun, with all assertions retained. The native release build succeeded and produced [ELL-0.2.0-beta.1.apk](releases/android/ELL-0.2.0-beta.1.apk). Its dedicated-key signature, identity/version, non-debuggable manifest, disabled backups, bundled lessons/graphics/notices and ZIP alignment are verified. The official dependency download blocker is resolved. Physical-device installation, launch, resume and sharing still require an organizer smoke test; no Play Store publication has taken place.

The base game is implemented as a working Expo/React Native prototype with a tested browser version. It contains 47 original missions, 141 mission questions, four interactive practice labs, fictional document/evidence exercises, and device-local progress. Android and iOS JavaScript exports succeeded. It has not yet been validated on real phones or packaged and published for app-store distribution.

## What learners do

The app has four tabs and a friendly generated relay coach, Click, whose name remains provisional:

- **Learn:** Choose a mission, read its briefing and learning points, then answer three scenario questions. Select an answer and check it to see immediate feedback and an explanation. Optional coach hints support reasoning without changing XP; thoughtful and encouraging expressions accompany feedback. Some questions include invented reference documents, inspection records, or fault evidence to compare.
- **Lab:** Practice simplified motor-control behavior, interpret a virtual meter, follow an original fictional drawing path, or explore illustrated components and identification/defect challenges. These practice sessions do not award course XP and do not represent real equipment or field procedures.
- **Progress:** See total XP, a learning rank, mastered/completed missions, and each mission's saved best score. Open a mission again to improve it.

- **Beta:** Optionally record first attempts, estimated foreground time and feedback locally, then manually share the results with the organizer.

Each correct answer is worth 25 XP, with 75 available per mission and 3,525 across the course. Three correct answers mark a mission mastered. Only improvements to the saved best score add XP; replaying cannot farm points or erase a better score. The Learn screen recommends the first mission not yet mastered. Ranks are game milestones, not professional qualifications. Click celebrates game mastery without awarding a work credential.

Progress saves automatically on the same device/browser. A separate checkpoint lets learners resume one unfinished mission, including the selected answer, checked feedback and optional hint. Learn provides Resume/Discard actions; opening another mission replaces the checkpoint. Finishing clears it, and partial answers do not earn XP. When every mission is mastered, Learn offers a review action instead of recommending mission one again. No account, backend, analytics, or cross-device synchronization is included. Clearing app/browser data removes these local records. Earlier course versions' saved scores retain their original lesson identities and earned XP.

## Training coverage

| Area | Missions |
| --- | ---: |
| Electrical safety and hazardous-energy control | 6 |
| Electrical fundamentals and meter use | 7 |
| Schematic reading and drawing references | 6 |
| Standards scope and information finding | 4 |
| Panel-build practices and inspection | 7 |
| Troubleshooting and conceptual diagnosis | 5 |
| Motor controls, motors, VFDs, and servos | 6 |
| Sensors and I/O | 5 |
| PLC introduction | 1 |
| Total | 47 |

## Practice labs

- **Motor controls:** Start/stop and holding logic, simulated emergency stop and overload. A trip blocks starting; releasing/resetting the condition does not automatically restart the simulated motor.
- **Meter bench:** Ideal DC polarity, isolated resistance and continuity, open paths, wrong-input warnings, and blocked powered-resistance combinations. It does not simulate physical current measurement or prove that equipment is safe.
- **Trace prints:** Five targets across two independent fictional teaching sheets, including a coil/contact relationship and return path. Wrong targets do not advance the exercise. Highlighting records selections, not actual energized state.
- **Component workshop:** Eight devices with original generated image artwork, 24 tappable part explanations, paired teaching symbols, two selectable image states per component, four dedicated defect images, and 12 identification/visible-defect rounds. Workshop practice leaves mission XP unchanged.

## Reference handling

Twenty-six supplied documents informed topic selection and independent explanations. Source files, images, proprietary print fragments, machine identifiers, and source-provider branding are excluded from the app. All practice records, diagrams, values, and lesson copy are original. Attachment instructions were treated as reference data rather than project commands. CONTENT_REVIEW.md records omitted source claims, model assumptions, and review requirements.

## Verification completed

- TypeScript checks passed.
- All 23 gameplay/content/model/checkpoint checks passed, including generated-asset/coach registration, hint boundaries, progress rules, and malformed/stale checkpoint rejection.
- All 44 browser cases passed across phone/desktop layouts in one full run. Coverage includes optional hints and mood changes, earlier progress, existing labs, generated component images, workshop challenges, accessible selected states, interruption recovery, completed-path navigation and checkpoint-storage failures.
- Web, Android, and iOS JavaScript exports completed successfully. Native exports are not signed application packages or real-device test results.
- App-source and exported web-text scans found no checked private identifiers; no source reference documents were found in the exported app.

## Simulated beta

A separate 12-profile synthetic beta passed every full-course journey: five novice adults aged 30–45, two assumed-novice teens, two novice adults aged 18–30, and three professionals. This exercised 564 mission completions, 1,692 quiz answers, 144 workshop answers and four interrupted-quiz recoveries. Assumption-based overall first-pass study time averages about 2h 57m, including a lab allowance. This is not measured human learning or completion time. Individual/group scores, timing inputs, bug evidence and CSVs are in [the simulated beta report](beta-results/REPORT.md).

## Before a training release

1. Have qualified electrical-content reviewers validate the teaching against applicable current requirements, equipment instructions, and approved safe-work practices.
2. Test the native app, local storage, navigation, and accessibility on real Android and iOS devices.
3. Prepare signed release packages, store materials, and the chosen distribution process.

This is conceptual practice. Game completion does not qualify or authorize electrical work, approve a panel, validate a safety system, or authorize energization.

## Cloud workspace

Reusable installation and startup instructions are saved in the cloud environment configuration draft. Review and save that draft in Environment settings, then publish the environment to activate it. Environment publishing applies to the development workspace configuration. See README.md for local development commands.

## Brand and rights screen

The user selected ElectroLessonLab (ELL); the earlier name review does not establish clearance of this name. Coach Click remains a working mascot label. A local exact text-window check against 26 extracted references found no matching 14-word windows, with no legal-clearance conclusion. Existing Expo notices were preserved, and a dependency inventory plus installed notices were collected; project licensing and release-specific attribution/source obligations remain open. See BRAND_AND_MARKET_REVIEW.md and RIGHTS_REVIEW.md. Live official app-store, trademark, mascot and copyright-source checks remain blocked by HTTP 403 until their saved targeted network changes are reviewed/saved and the environment published.
