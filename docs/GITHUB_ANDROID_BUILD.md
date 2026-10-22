# Build the Android APK on GitHub

The **Build Android beta APK** Actions workflow builds a standalone, signed Android release using the existing private beta certificate. It runs on pushes to `main` that change build/app inputs, and through **Run workflow**. It does not publish a Play Store or GitHub Release.

## One-time signing setup

The four repository **Actions secrets** are `ELL_BETA_KEYSTORE_BASE64`, `ELL_BETA_STORE_PASSWORD`, `ELL_BETA_KEY_PASSWORD`, and `ELL_BETA_KEY_ALIAS`. Use the existing `/workspace/electro-signing` files so testers can install over the APK already provided. Never commit these files, paste secrets into chat, or generate a replacement key for CI.

From the prepared workspace, with authorized GitHub API access to manage this repository's Actions secrets:

```sh
cd /workspace/Electro
node scripts/upload-github-signing.mjs
gh workflow run android-beta.yml --repo Wikkid176/Electro --ref main
gh run list --repo Wikkid176/Electro --workflow android-beta.yml
```

The helper sends values to `gh secret set` through stdin. GitHub CLI encrypts them with the repository public key. It never prints values or puts them in process arguments. Existing complete secret sets are preserved; a partial set requires recovery. Do not upload a new key to resolve a missing or mismatched certificate. The workflow checks the signer against the public SHA-256 certificate digest in its YAML.

If Actions are disabled, enable them in the repository's **Settings → Actions → General**. The job needs only `contents: read`; no publishing permission is requested. The workspace's Git push authentication and GitHub API/secret-management access are separate capabilities.

## Download the APK

1. Open the repository's **Actions** tab and **Build Android beta APK**.
2. Select a successful run. Under **Artifacts**, download **ELL-Android-beta-APK** while signed in to GitHub.
3. Unzip the download. Transfer `ELL-0.5.0-beta.4.apk` to an Android 7+ ARM phone and install it. No Expo Go or development server is required.

Artifacts are retained for 14 days. The download also contains the checksum, verification report, software notices and `START-HERE.md`. Signing files are restored only in the runner's private temporary directory, excluded from uploads, and removed in an unconditional cleanup step. A missing secret makes the job fail before installing dependencies or compiling; no substitute signing key is generated.

## Validation and limits

The job installs pinned Node 24, Java 17/21 and Android components, uses `npm ci`, runs TypeScript and all 50 unit tests, and runs the same native release build used locally. It verifies the dedicated signing certificate, app identity/version, non-debuggable manifest, disabled backups, blocked permissions, embedded Hermes bundle, component/coach resources, exact bundled notices, ZIP integrity and alignment, and ARM architectures. Third-party Actions are pinned to inspected commit hashes. The Gradle distribution checksum remains enforced.

Browser automation has separate saved validation evidence; it is not rerun in the APK job. Neither this workflow nor a successful native build establishes physical-phone behavior. Check launch, graphics, mission completion, interruption/resume and full results sharing on the organizer's phone before group distribution. Increase `android.versionCode` before distributing an updated app, and keep the APK filename/build-label references consistent when changing the release version.
