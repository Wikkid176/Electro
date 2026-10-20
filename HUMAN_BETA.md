# ElectroLessonLab (ELL): Android human beta

Version 0.3.0-beta.2 · 47 illustrated lessons, 47 guided-practice questions, 141 quiz questions, four practice labs

**Build status:** The [signed Android APK](https://github.com/Wikkid176/Electro/raw/refs/heads/android-beta-download/downloads/ELL-0.3.0-beta.2.apk) is available (35.5 MiB; Android 7 or newer on ARM phones). Its signature, dedicated beta key, app identity/version, release manifest, bundled lessons/graphics/notices and archive alignment passed verification. See `releases/android/beta2/APK-VERIFICATION.json`. Install it on the organizer's own phone and check launch, mission completion, resume and results sharing before inviting the full group. No physical-phone test has been performed in this workspace.

## What to send testers

Send the signed APK `ELL-0.3.0-beta.2.apk`, the tester instructions below, their assigned code/group, and your preferred contact for returning results. Keep the APK and study within your invited test group. No Play Store listing or Expo account is needed to install this standalone APK. Testers do not need a computer or development server. They should install only the file you provide.

The package is `com.wikkid176.electrolessonlab.beta`. It is separate from any future production package. The private signing key is kept outside this repository; preserve it securely so later beta updates can install over this build without uninstalling or losing data. Never send signing files to testers.

First install the APK on your own Android phone and confirm that it opens, renders component images, completes a mission, resumes after closing, and opens the results share sheet. The browser automation does not validate a physical Android device. Confirm that you receive one test export before inviting all participants.

## Tester instructions: start here

1. Download the APK your organizer sent to your Android phone. Open the download and select **Install**. If Android asks, temporarily allow this browser or file manager to install this particular app, then turn that permission off afterward. Do not disable Play Protect or device protections. If installation is blocked or the device is managed, ask the organizer for help rather than bypassing it.
2. Open **ElectroLessonLab Beta**. It contains the app and illustrations; there is no development server to connect to. Use your own device throughout the study. Do not uninstall, clear app storage or switch devices before sharing results.
3. Open **Beta** at the bottom. Read what recording captures. Enter only the assigned code, choose the assigned group, and opt in if you want a test record. Select **Start beta recording**. Recording is optional; the training still works without it.
4. Open **Learn** and start the safety mission. Read the two teaching sections, explore the visual and worked example, check the ungraded practice question, and read the recap. Then start the three-question quiz and read its answer feedback. Use Review lesson if needed; it preserves quiz answers. Use hints naturally. Do not look up answer keys or replay for a perfect score before your first pass is recorded.
5. Try the tasks below. Take breaks. Background time is excluded from estimated foreground time, but visible idle time and replays are included. Pause recording when appropriate. Reopen the same app to continue; use **Resume mission** for unfinished work.
6. Return to **Beta** to save notes about confusing explanations, bugs, electrical-content concerns or suggestions. Include the mission/lab name and what you expected. Do not include names, employer information, proprietary drawings, real equipment records or photographs of a workplace.
7. When finished, pause recording and select **Share beta results**. Choose the agreed messaging/email app, send the record to the organizer, and confirm it arrived. Opening the share sheet alone does not deliver a report. If the chosen app limits message length, use one that supports the full text or ask your organizer for help; do not clear the local record.

All activities are conceptual. Do not perform electrical work or connect real equipment during this study. Teens should participate under the organizer's appropriate parent/guardian arrangements and supervision.

## Suggested study plan

Begin with a 30–45 minute usability session. This is a session allowance, not a promised course completion time.

| Task | What the observer records |
| --- | --- |
| Install/open and find Beta | Phone model, Android version, installation problems; no personal device identifiers |
| Start a study record | Can the tester understand the privacy wording and choose the intended group? |
| Complete the first three missions | First-attempt answers, points of confusion, hint use, readability |
| Leave a quiz after checking an answer; close and reopen | Can the tester locate Resume and recover the expected answer/feedback? |
| Motor controls | Can the tester explain why an overload reset does not restart the model? |
| Meter bench | Can the tester distinguish blocked powered resistance, an isolated resistor and an open path? |
| Trace prints | Can the tester follow the five targets and distinguish a device association from a conductor connection? |
| Component workshop | Can the tester inspect parts, change illustrated states and complete the 12-round challenge? |
| Leave feedback and share the record | Can the tester find their feedback and return a usable export? |

For full-course timing, have each tester attempt all 47 missions once across as many sessions as needed, and try all four labs. Use the same device and tester code. Keep the first pass separate from retries. Ask about any earlier electrical learning, interruptions, outside help, abandoned attempts and completed work done while recording was paused. Do not require teens to demonstrate anything on real equipment.

## Cohorts

| Codes | Group | Target count |
| --- | --- | ---: |
| A01–A05 | Adults 30–45 / beginner | 5 |
| T01–T02 | Teens / beginner | 2 |
| Y01–Y02 | Adults 18–30 / beginner | 2 |
| P01–P03 | Electrical professionals | 3 |

The teen beginner label is an explicit study assumption; confirm their prior experience. Keep any participant/contact roster separately from exported app data. Use an appropriately supervised, voluntary study. Store received records in your controlled study folder and agree a retention/deletion period with participants.

## Updating from the earlier beta

This update uses the same package and private signing certificate with Android versionCode 2. Install it over beta 0.2.0-beta.1 to retain course scores; do not uninstall or clear storage first. An earlier study record remains readable/exportable and is automatically paused. Export it, then delete only the beta record before starting a fresh study for the expanded course. This prevents mixing old short-briefing timing with the new lessons. Existing course scores are retained as a baseline. Unknown schemas/builds remain preserved without being overwritten.

The displayed mission times are estimated reading/exploration/quiz allowances, not measured completion times. Historical synthetic beta timings describe the earlier course and must not be presented as outcomes for this expanded version.

## What the app records

Only after opting in: tester code and chosen group, baseline course scores, individual lesson attempts, checked choices/correctness, hints used, first workshop-run answers and later runs, unique lab visits, estimated foreground training seconds, and feedback. Each mission's first attempt remains distinct from replayed best scores. Partial or paused first attempts are retained and do not silently become complete first-pass quiz results. Course XP remains independent. Guided-practice choices do not award XP and are not logged as scored quiz answers; foreground mission time includes reading and practice.

Records stay in local app storage. The app has no account, analytics service or automatic results-upload endpoint. Android app backup is disabled for this beta. Sharing happens through the user's chosen external app, which has its own privacy behavior. Deleting the beta record requires confirmation and preserves course scores. Uninstalling/clearing app data removes both. Beta records from a different schema/build are preserved with a warning rather than silently overwritten.

The timing is an estimate from foreground heartbeats every five seconds. It includes visible idle time and replay attempts; it excludes the Beta tab and background time. Delayed intervals are capped at 15 seconds, and abrupt termination can lose the last few seconds. Per-mission recorded time and first-pass completion are available in the JSON. Lab visits establish navigation, not conceptual competence; motor/meter/trace understanding requires observation. The workshop's first run can be partial. An existing progress baseline, outside study, unrecorded attempts, paused recording and missing exports must be identified in the report.

## How to report real results

Collect one final export per code. Compare first attempts, hint use, mission completion/mastery, first workshop-run accuracy and timing for each group and overall. Count incomplete/abandoned testers explicitly. Do not replace missing results with simulated scores. Report approximate foreground time separately from an observer's elapsed session time and breaks. Do not treat an app score as electrical qualification or a measured learning gain; a gain needs an independent pre/post or retention assessment.

Use `releases/android/tester-roster.csv` and `releases/android/observer-notes.csv` as blank study templates. No actual participants or study outcomes have been entered.

## Build again

Use Java 21 for Gradle, a Java 17 toolchain for its React Native plugin, Node 24, the pinned npm lockfile and Android SDK tools recorded in `docs/android-toolchain.json`. The current Android build uses platform 37.0, build-tools 37.0.0, NDK 27.1.12297006 and CMake 3.22.1. Set writable Expo/Gradle/Android cache directories in the cloud as described in README. Prepare signing once:

```sh
# In the prepared cloud workspace:
python /workspace/ell-onboarding/prepare-native.py
source /workspace/ell-onboarding/native-env.sh
npm ci
npm run beta:signing
export ANDROID_HOME=/workspace/android-sdk
export ANDROID_USER_HOME=/workspace/.cache/android
export GRADLE_USER_HOME=/workspace/.cache/gradle
export ELECTRO_BETA_SIGNING_PROPERTIES=/workspace/electro-signing/signing.properties
npm run beta:android
```

The signing command preserves an existing key and refuses an incomplete setup. Keep the private signing directory in secure backup; it is not part of source or tester packages. The build script runs Expo prebuild, pins Gradle's official distribution checksum, builds a release APK with bundled Hermes code/assets and the private beta key, and copies the APK to `releases/android/`. It does not publish to Google Play or contact testers. Rebuilding after source changes requires rerunning relevant checks and recording a new release validation. Increment the Android version code before distributing an update.
