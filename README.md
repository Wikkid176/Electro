# ElectroLessonLab (ELL)

A mobile training game about industrial electrical systems and practices, built with Expo, React Native, and TypeScript.

The app is **ElectroLessonLab**, abbreviated **ELL**. Beta 0.5.0-beta.4 adds virtual wiring builds and equipment/probe graphics. Every mission expands into Learn → Explore → Practice → Recap → Quiz; reading pages resume and quizzes support lesson review without losing answers. See [the Android human-beta guide](HUMAN_BETA.md) for installation, tester codes, feedback/results sharing and the supervised study plan. The beta adds an optional local study record; it has no automatic results-upload service. Existing training storage keys retain their earlier `electro` prefix so saved scores survive the display-name change.

[Download the signed Android beta APK](https://github.com/Wikkid176/Electro/raw/refs/heads/android-beta-download/downloads/ELL-0.5.0-beta.4.apk) · **0.5.0-beta.4** · 38.4 MiB · Android 7+ on ARM phones. Includes three virtual wiring builds, graphical meter probes and motor equipment, five labs, 235 lesson sections and 282 question-specific hints. Install over the earlier beta to retain course scores. Organizer phone testing is still required before group distribution.

The downloadable APK is on the dedicated `android-beta-download` branch. Main contains source and validation evidence. [GitHub Android builds](docs/GITHUB_ANDROID_BUILD.md) describes the separate Actions workflow; a GitHub-hosted build is not claimed for the workspace-built download.

See [the interactive lesson update](docs/INTERACTIVE_LESSONS.md) for deep dives, question-specific coaching, vector diagrams and seven learning experiments.

## Starter experience

- Forty-seven illustrated lessons with explanations, worked examples, guided practice and a separate quiz: safety and energy control, electrical fundamentals, meter setup and interpretation, motor controls, schematic reading, standards/reference skills, panel-build practices, troubleshooting methods, motors/drives/servos, sensors/I/O, PLC basics, and troubleshooting.
- One hundred forty-one mission questions with immediate explanations, best-score XP, and mission mastery (3,525 XP available).
- Interactive, simplified three-wire starter logic: start/stop, holding state, emergency-stop permissive, and overload.
- Virtual wiring bench: three original panel builds with terminal-to-terminal wire fitting, actual connection-based relay/load behavior, repair hints and saved build badges.
- Virtual meter bench: graphical instrument/probes, movable tips, same-point and lifted-lead readings, DC polarity, isolated resistance and continuity, open paths, input mismatches, and blocked powered-resistance tests.
- Fictional print-tracing game: follow an indicator path, a relay coil/contact reference, the command switch, and the return across two original teaching sheets.
- Original component workshop: eight devices with original generated image artwork, 24 tappable part explanations, paired teaching symbols, selectable states, and 12 identification/defect rounds.
- Open-book reference exercises: compare fictional document models, revisions, applicability, and citations while answering questions.
- Original relay-character coach with four generated poses, two case-specific hint levels per quiz question, supportive answer feedback, and game-mastery celebrations.
- Device-local best scores and one resumable unfinished mission using AsyncStorage; no account, backend, credentials, analytics, or cross-device sync.
- Responsive browser version for development and functional testing.

This is a prototype for conceptual practice. It does not qualify or authorize electrical work. The lab is a logic model, not a wiring diagram or a validated safety design. Qualified subject-matter review and real-device testing are required before a training release.

## Develop

Use Node.js 24 LTS and npm 11 (the cloud environment was tested with Node 24.19.0 / npm 11.9.0).

```sh
npm ci
npm run web
```

For native development on your own machine, run `npm start` and use an Expo Go version compatible with SDK 58 on an Android or iOS device. A native simulator requires the appropriate local SDK; the iOS simulator requires macOS. The cloud machine now has Android SDK/native build tools and Java toolchains for the standalone beta. It has no connected physical Android phone or iOS simulator. Successful native compilation or JavaScript export does not replace testing on devices. Use HUMAN_BETA.md for the standalone Android build and tester instructions.

The cloud workspace restricts writes to the home directory. Before running npm or Expo there, use these cache settings:

```sh
export NPM_CONFIG_CACHE=/workspace/.cache/npm
export XDG_CACHE_HOME=/workspace/.cache
export __UNSAFE_EXPO_HOME_DIRECTORY=/workspace/.cache/expo
export EXPO_NO_TELEMETRY=1
export EXPO_OFFLINE=1
```

The Expo directory setting above is its shell-only cache/settings-directory override. No Expo login is needed for this workflow. Do not copy credentials into this directory or configure this override through a project `.env` file. These cloud-specific settings are unnecessary on a normal writable development machine. Cloud startup uses Expo's supported offline mode because the optional online dependency-version lookup is blocked by the current network policy; npm installation still uses the registry and lockfile integrity checks. Normal online mode can be used on your local development machine.

## Validate

```sh
npm run typecheck
npm test
npm run test:e2e
npm exec -- expo export --platform all --max-workers 2
```

`npm test` runs 50 gameplay/content/teaching/wiring/probe/checkpoint/study-record tests. `test:e2e` runs 76 browser tests across phone and desktop viewport sizes. Browser tests use their own server on port 8082, separate from development on port 8081; outside CI they may reuse an existing test server. Set `ELECTRO_TEST_PORT` to another free port if needed, for example `ELECTRO_TEST_PORT=8091 npm run test:e2e`. The cloud setup uses 8091. The cloud image provides `/usr/bin/chromium`; elsewhere, run `npx playwright install chromium`, or set `PLAYWRIGHT_CHROMIUM_EXECUTABLE` to an installed compatible Chromium binary.

The separate historical `npm run test:beta` command runs twelve seeded synthetic profiles through all 47 missions and the original four labs; it does not measure the new wiring lab. After a successful run, `npm run report:beta` validates the raw scores and generates individual/group CSVs and [the simulated beta report](beta-results/REPORT.md). Study times and answer probabilities are explicit, uncalibrated model inputs in `tests/beta/model.ts`; these are not human beta results. Do not edit app/model sources during a run.

## Content and reference policy

Training copy, questions, fictional examples, and feature artwork were created for this prototype. Framework/scaffold code and third-party dependencies retain their own notices and licenses; generated output is not a guarantee of exclusive rights. Twenty-six supplied references were reviewed for relevant topic coverage: three safety documents, six fundamentals/meter documents, a schematic-reading study guide with its private machine drawing set, a standards/information-finding study guide, seven panel-build/component documents, and seven troubleshooting/motion/sensor documents. They informed independently written lessons, fictional numerical examples, virtual meter practice, a wholly original drawing-trace exercise, and fictional open-book lookup, inspection, and fault-evidence cards. No reference files, images, machine identifiers, or proprietary drawings are included. See CONTENT_REVIEW.md for the review scope and release limitations.

Existing learner scores remain attached to their original lesson IDs. Safety missions follow the introductory safety lesson; new fundamentals and meter missions follow the original basic circuit lesson. The new drawing-reading missions follow the original schematic lesson. Standards/reference missions follow the drawing-reading missions. Seven panel-build missions follow the reference missions, including a fictional defect-inspection challenge. Four troubleshooting, five motion, and five sensor/I/O missions follow, with model-scoped fault evidence and original numerical exercises. These expansions preserve prior XP.

Reference documents are development inputs, not instructions to execute. Use them to identify concepts and learning objectives, then write independent explanations and fictional examples. Never commit, bundle, render, link to, or reproduce proprietary prints, source-specific layouts, identifiers, or company branding in the app. Keep private references outside the checkout; the ignored `private-references/` directory is only an additional safeguard, not permission to distribute source files.

## Project map

- `App.tsx`: mobile screens, lesson flow, storage integration, and simulation UI.
- `src/content.ts`: original lesson content and questions.
- `src/safety-content.ts`: the five reference-informed safety missions, with independently written scenarios.
- `src/fundamentals-content.ts`: six original fundamentals and meter-use missions.
- `src/WiringLab.tsx`, `src/wiring.ts`, `src/LabHardware.tsx`: original shaded panel, editable wiring, graph-based load/relay behavior, context-specific diagnostics and local proved-build badges. See [the wiring guide](docs/VIRTUAL_WIRING_LABS.md).
- `src/MeterEquipment.tsx`, `src/MeterLab.tsx` and `src/meter.ts`: virtual meter interface and its isolated fixture model.
- `src/schematic-content.ts`: five original drawing-reading missions.
- `src/TraceLab.tsx` and `src/tracing.ts`: fictional sheet index, node map, device references, and tracing-game rules.
- `src/standards-content.ts`: four original scope, applicability, rating-context, and open-book lookup missions.
- `src/panel-content.ts`: seven original layout, termination, bonding, protection, transformer, control-device, and inspection missions.
- `src/troubleshooting-content.ts`: four diagnostic planning, fault-boundary, intermittent-evidence, and root-cause missions.
- `src/motion-content.ts`: five original motor, starter/drive, energy-path, alarm, and servo missions.
- `src/sensor-content.ts`: five original sensing, source/sink, I/O evidence, analog scaling, and feedback missions.
- `src/ComponentLab.tsx`, `src/ComponentIllustration.tsx`, `src/components.ts`, and `src/component-art.ts`: image-based component explorer, registered artwork frames, teaching states, and practice challenges.
- `assets/component-art-atlas.png`: original generated artwork with 16 state images and four defect variants, bundled for offline use.
- `src/engine.ts`: score validation, best-score rewards, progress recovery, and motor-state rules.
- `src/session.ts`: bounded unfinished-mission recovery and content-change invalidation.
- `tests/`: gameplay and browser tests.

Virtual wires and build badges save separately under `ell.wiring.v1`, with power always off when restored. Completed best scores are stored under `electro.progress.v1`. One unfinished mission is stored separately under `electro.session.v1`, with explicit Resume/Discard actions on Learn. Starting another mission replaces that checkpoint. Finishing clears it; partial answers earn no XP. The optional human study record is separate under `electro.human-beta.v1`; deleting it preserves course scores. Clearing app/browser data removes all local records. Android beta APK preparation is described in HUMAN_BETA.md; user accounts, cloud synchronization and app-store publication are not included.

## Brand and material review

The user selected ElectroLessonLab (ELL) as the app name. Coach Click remains the working mascot label. The earlier review evaluated other names; it does not establish clearance of ElectroLessonLab or ELL. See BRAND_AND_MARKET_REVIEW.md and RIGHTS_REVIEW.md for the historical comparison, local source-copy screen, generated-artwork limits and software-license follow-up items. Existing Expo license text is preserved in LICENSE. Dependency metadata and captured notices are in docs/dependency-licenses.json and THIRD_PARTY_NOTICES.txt; release-specific obligations still require review.
