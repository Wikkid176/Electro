"""Verify the installable release artifact without accessing a private signing key."""
import argparse
import datetime
import hashlib
import json
import os
from pathlib import Path
import re
import subprocess
import xml.etree.ElementTree as ET
import zipfile

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("--apk", required=True, type=Path)
parser.add_argument("--certificate-sha256", required=True)
parser.add_argument("--output-dir", required=True, type=Path)
args = parser.parse_args()
expected = args.certificate_sha256.lower().replace(":", "")
if not re.fullmatch(r"[a-f0-9]{64}", expected):
    raise SystemExit("Invalid expected public certificate digest")
root = Path(__file__).resolve().parent.parent
app = json.loads((root / "app.json").read_text())["expo"]
sdk = Path(os.environ["ANDROID_HOME"])
tools = sdk / "build-tools" / "37.0.0"
args.output_dir.mkdir(parents=True, exist_ok=True)


def require(condition, message):
    if not condition:
        raise SystemExit(message)


def run(command, output):
    result = subprocess.run([str(part) for part in command], capture_output=True, text=True)
    require(result.returncode == 0, f"Verification failed: {command[0]}\n{result.stderr[-2000:]}")
    (args.output_dir / output).write_text(result.stdout)
    return result.stdout


signature = run([tools / "apksigner", "verify", "--verbose", "--print-certs", args.apk], "APK-SIGNATURE.txt")
digests = re.findall(r"certificate SHA-256 digest: ([a-fA-F0-9]+)", signature)
require(digests == [expected], "APK signer does not match the existing private beta certificate")
run([tools / "zipalign", "-c", "-P", "16", "-v", "4", args.apk], "APK-ALIGNMENT.txt")
badging = run([tools / "aapt", "dump", "badging", args.apk], "APK-METADATA.txt")
for value in [f"name='{app['android']['package']}'", f"versionName='{app['version']}'",
              f"versionCode='{app['android']['versionCode']}'", f"application-label:'{app['name']}'"]:
    require(value in badging, "APK identity/version mismatch: " + value)
manifest = run([sdk / "cmdline-tools/latest/bin/apkanalyzer", "manifest", "print", args.apk], "APK-MANIFEST.xml")
xml = ET.fromstring(manifest)
ns = "{http://schemas.android.com/apk/res/android}"
application = xml.find("application")
require(application is not None, "Missing application manifest")
require(application.get(ns + "debuggable", "false") == "false", "APK must not be debuggable")
require(application.get(ns + "allowBackup") == "false", "Beta app backups must be disabled")
permissions = [node.get(ns + "name") for node in xml.findall("uses-permission")]
require(not set(app["android"]["blockedPermissions"]) & set(permissions), "Blocked permissions found in APK")
resources = run([tools / "aapt", "dump", "resources", args.apk], "APK-RESOURCES.txt")
for resource in ["drawable/assets_componentartatlas", "drawable/assets_relaycoachatlas"]:
    require(resource in resources, "Missing component/coach artwork: " + resource)
with zipfile.ZipFile(args.apk) as archive:
    require(archive.testzip() is None, "APK ZIP integrity check failed")
    names = archive.namelist()
    bundle = archive.read("assets/index.android.bundle")
    require(bundle.startswith(bytes.fromhex("c61fbc03c103191f")), "Missing standalone Hermes bytecode")
    require(b"ElectroLessonLab" in bundle, "Wrong embedded application")
    for marker in ["COACH-LED LESSON", "WORKED EXAMPLE", "Continue to visual", "Check practice", "Your lesson recap"]:
        require(marker.encode() in bundle or marker.encode("utf-16-le") in bundle,
                "Expanded lesson interface missing from embedded app: " + marker)
    authored = subprocess.check_output([
        "node", "--input-type=module", "-e",
        "import { teachingLessons } from './src/teaching/index.ts'; console.log(JSON.stringify(teachingLessons));"
    ], cwd=root, text=True)
    teaching = json.loads(authored)
    require(len(teaching) == 47, "Expected 47 authored lessons")
    for lesson_id, content in teaching.items():
        for section in content["sections"]:
            text = section["body"]
            require(text.encode() in bundle or text.encode("utf-16-le") in bundle,
                    "Authored lesson missing from standalone bundle: " + lesson_id)
    for notice in ["LICENSE", "THIRD_PARTY_NOTICES.txt"]:
        require(archive.read("assets/" + notice) == (root / notice).read_bytes(), "Missing or altered software notice: " + notice)
    forbidden = (".pdf", ".doc", ".docx", ".ppt", ".pptx", ".p12", ".jks", ".pfx", ".pem", ".key")
    require(not any(name.lower().endswith(forbidden) or "signing.properties" in name for name in names),
            "Private reference/signing file found in APK")
    abis = sorted({name.split("/")[1] for name in names if name.startswith("lib/") and name.endswith(".so")})
    require(abis == ["arm64-v8a", "armeabi-v7a"], "Unexpected Android architectures")
sha256 = hashlib.sha256(args.apk.read_bytes()).hexdigest()
(args.output_dir / "APK-SHA256.txt").write_text(f"{sha256}  {args.apk.name}\n")
verification = {
    "verifiedAt": datetime.datetime.now(datetime.timezone.utc).isoformat(),
    "file": args.apk.name, "bytes": args.apk.stat().st_size, "sha256": sha256,
    "package": app["android"]["package"], "versionName": app["version"],
    "versionCode": app["android"]["versionCode"], "architectures": abis,
    "signatureVerified": True, "signerCertificateSha256": expected,
    "zipAlignment16KiBVerified": True, "debuggable": False, "allowBackup": False,
    "permissions": permissions, "embeddedHermes": True, "artworkResourcesPresent": True,
    "expandedLessonInterfaceIncluded": True,
    "authoredLessonsBundled": len(teaching),
    "softwareNoticesIncluded": True, "privateReferenceOrSigningFilesIncluded": False,
    "commit": os.environ.get("GITHUB_SHA"), "runId": os.environ.get("GITHUB_RUN_ID"),
    "physicalDeviceTested": False,
}
(args.output_dir / "APK-VERIFICATION.json").write_text(json.dumps(verification, indent=2) + "\n")
print("Verified standalone beta APK, dedicated signer, bundled app, manifest and ZIP alignment.")
