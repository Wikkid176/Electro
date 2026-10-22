# ElectroLessonLab Android beta download

[Download ELL 0.5.0-beta.4 APK](https://github.com/Wikkid176/Electro/raw/refs/heads/android-beta-download/downloads/ELL-0.5.0-beta.4.apk) · 38.4 MiB · Android 7+ on ARM phones.

On your Android phone, open the download in Chrome or your browser, then open the APK and choose Install / Update. This is the standalone app; Expo Go and a computer are not needed. Install over the existing beta to retain course scores. Do not uninstall or clear app storage first. Keep Android device protections enabled.

Open **Lab → Virtual wiring** for three builds: a switched lamp, a relay-controlled lamp and a start/stop holding circuit. Tap pairs of screw terminals to fit wires, turn virtual power on, use the controls and follow the test checklist. Click gives connection-specific hints. Wires and proved-build badges save locally, reopening with virtual power off. The meter now has movable probe tips and the motor lab has equipment graphics.

[See the actual app-rendered previews and lab guide](https://github.com/Wikkid176/Electro/blob/main/docs/VIRTUAL_WIRING_LABS.md).

The existing 47 lessons, 235 explanatory sections, 141 quiz questions and 282 question-specific hints remain. Earlier known beta study records remain paused/exportable; course scores are preserved. Read START-HERE.md for tester instructions.

APK SHA-256: `ca31f569078f36701e8809a91f5492106bf7b9572662d6fb0c0f31e62db6f353`. Public checksum: `ELL-0.5.0-beta.4.apk.sha256`. Verification: `beta4-verification.json`; checks: `beta4-validation.json`. The existing beta signing certificate and package are retained; Android update version is 4.

Optional organizer kit: `ELL-Android-Beta-Kit-0.5.0-beta.4.zip` includes the APK, instructions, blank observer/roster templates, notices and verification. It contains no private signing keys or reference documents.

Built and signed in the development workspace from source commit `7086d0769d6e9e9278e8858f39a253d888d481e5`. TypeScript, 50 unit tests, 76 full browser cases and 12 final focused lab cases passed. Signature, manifest, native SVG registration, bundled lessons/lab content and ZIP alignment verified. No physical-phone test or new human learning outcomes are claimed. A GitHub Actions build is not claimed for this download.

Earlier APK links remain available: `ELL-0.4.0-beta.3.apk`, `ELL-0.3.0-beta.2.apk`, `ELL-0.2.0-beta.1.apk`. This branch holds binary downloads separately from main.
