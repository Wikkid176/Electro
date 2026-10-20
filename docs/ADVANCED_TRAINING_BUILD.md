# ElectroLessonLab 0.3.1-beta.1 — Advanced Training Build

This branch introduces an OPTIONAL Advanced Training screen, accessible from the Learn home screen. Existing original missions, quiz IDs, XP rules, 0.3.0 progress data and virtual labs are unchanged.

## What is implemented

- 21 complete research-authored deep-dive lessons with objectives, four teaching sections each, worked examples, misconceptions, two ungraded knowledge checks with revealed reasoning, and virtual-exercise specifications.
- 12 fictional diagnostic work-order case studies, each with observations, candidate faults, discriminating evidence, visible safety boundaries and optional diagnostic debriefs.
- Offline Android/web native React UI, visually aligned with existing ElectroLessonLab cards.
- Existing main navigation retained; the Advanced Training page can be exited to Learn, and other tabs remain available.
- Version increment to 0.3.1-beta.1, Android versionCode increment 2 -> 3 for installation over prior beta.
- Earlier 0.3.0-beta.2 beta-study exports remain readable but paused (instead of discarded), consistent with earlier betas.
- Automated content validation in `tests/deep-training.test.ts`.

## Explicit limits

- This is expanded reading, reasoning and knowledge-check functionality, NOT the future interactive wiring-fault simulation engine.
- `virtualExercise` strings are surfaced as classroom exercise briefs, not represented as working interactive simulators.
- Work orders are evidence-based fictional case studies, not live diagnostic models.
- No new electrical certification or real-world authorization is claimed. Site-specific supervision, qualification and energy-control procedures always govern practical work.

## Build/export

GitHub Actions `Build Advanced Training preview APK` runs on this feature branch without requiring the existing beta signing secrets. It builds a standalone **separately installable** `ELL-0.3.1-preview.apk` for `com.wikkid176.electrolessonlab.preview`, exported as `ELL-0.3.1-Preview-APK`. Its temporary build signing certificate is NOT the original signing identity, so this preview cannot be installed as an update over the original beta. Existing beta data is not shared across these two package IDs. The signed beta workflow remains available through manual dispatch after restoring the ORIGINAL signing credentials.

The original beta-signed build currently fails in GitHub Actions because original signing secrets are missing. This preview avoids replacing or impersonating that signature by changing to an isolated application package. Do not declare the preview APK built until the new workflow succeeds and the artifact exists.

## Manual physical-device checks

1. Install the preview alongside the existing beta; its progress starts independently. Once the original beta signing key is available, separately test an in-place upgrade to versionCode 3 on the beta app.
2. Navigate Learn -> Advanced Training -> Deep Lessons; select safety and three-wire starter lessons.
3. Answer a wrong and right knowledge-check response; explanation should appear.
4. Open a work order; debrief remains hidden until selected.
5. Navigate back, resume a paused original mission, open the motor lab, inspect progress, and verify the original 47 mission count.
6. Inspect scrolling/accessibility and performance on a smaller Android phone.

Not Play Store signed and not independently certified to confer qualifications.
