# Click in the ELL logo: 0.5.1-beta.5

Click now appears on the app logo with his silver/lime hard hat, brown eyes, blue relay housing, visible copper coil, thumbs-up and lime ELL badge. The logo replaces the header lightning tile, standard Android icon and browser favicon. Android uses a separate transparent foreground on the existing navy background.

![Click ELL logo](../assets/icon.png)

The artwork was generated with image_gen using only the project-owned Click atlas and prior project icon. The full generated PNGs are copied unchanged. Their hashes and source-reference details are in asset-provenance.json. No proprietary training print or external mascot reference was used.

A drawable inset of 14% on each side fits the adaptive foreground into round/squircle masks without editing the source pixels. Alpha inspection found all opaque foreground pixels within radius 0.279 of the full canvas after the inset, inside Android's central safe circle (radius 1/3). The launcher background is navy; the old lightning monochrome override was removed so it cannot replace Click when themed icons are enabled. No custom monochrome icon is claimed.

Android update versionCode 5 uses the existing package and signing certificate. Training, course/checkpoint keys, wiring storage and measurement rules are unchanged. A 0.5.0-beta.4 study retains its original build label and recording state and can continue feedback/recording. Earlier course versions remain paused/exportable.

Checks: TypeScript, all 51 unit cases, 16 targeted phone/desktop browser cases, native compilation and APK verification. The latter checks the actual Click header resource, launcher foreground and safe-area drawable in addition to the existing app/content/signature checks. The earlier beta4 76-case full suite is historical evidence, not a fresh full-suite run for beta5. Physical-device rendering remains to be checked on the organizer's phone.
