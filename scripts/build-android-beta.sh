#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
: "${ANDROID_HOME:?Set ANDROID_HOME to an installed Android SDK}"
: "${ELECTRO_BETA_SIGNING_PROPERTIES:?Set the path to the private beta signing.properties file}"
test -r "$ELECTRO_BETA_SIGNING_PROPERTIES"
export EXPO_NO_TELEMETRY=1
export CMAKE_BUILD_PARALLEL_LEVEL=2
npm exec -- expo prebuild --platform android --no-install
node scripts/pin-gradle-checksum.mjs
cd android
./gradlew :app:assembleRelease --max-workers=2 --no-daemon -PreactNativeArchitectures=arm64-v8a,armeabi-v7a
mkdir -p ../releases/android
cp app/build/outputs/apk/release/app-release.apk ../releases/android/ELL-0.2.0-beta.1.apk
echo 'Standalone signed beta APK: releases/android/ELL-0.2.0-beta.1.apk'
