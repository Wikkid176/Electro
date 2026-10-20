"""Restore GitHub encrypted signing secrets into private, temporary runner files."""
import base64
import os
from pathlib import Path


names = ["ELL_BETA_KEYSTORE_BASE64", "ELL_BETA_STORE_PASSWORD",
         "ELL_BETA_KEY_PASSWORD", "ELL_BETA_KEY_ALIAS"]
missing = [name for name in names if not os.environ.get(name)]
if missing:
    raise SystemExit("Missing GitHub Actions secrets: " + ", ".join(missing)
                     + ". See docs/GITHUB_ANDROID_BUILD.md. No replacement key was generated.")


def properties_value(value):
    return (value.replace("\\", "\\\\").replace("\n", "\\n")
            .replace("\r", "\\r").replace("\t", "\\t").replace(" ", "\\ "))


directory = Path(os.environ["RUNNER_TEMP"]) / "ell-signing"
directory.mkdir(mode=0o700)
os.chmod(directory, 0o700)
key = directory / "electro-beta.p12"
properties = directory / "signing.properties"
data = base64.b64decode(os.environ[names[0]], validate=True)
if not data:
    raise SystemExit("The encrypted keystore secret is empty.")
with key.open("xb") as file:
    os.chmod(key, 0o600)
    file.write(data)
values = {"storeFile": str(key), "storePassword": os.environ[names[1]],
          "keyPassword": os.environ[names[2]], "keyAlias": os.environ[names[3]]}
with properties.open("x") as file:
    os.chmod(properties, 0o600)
    file.write("".join(f"{name}={properties_value(value)}\n" for name, value in values.items()))
with open(os.environ["GITHUB_ENV"], "a") as file:
    file.write(f"ELECTRO_BETA_SIGNING_PROPERTIES={properties}\n")
print("Restored private signing files outside the checkout.")
