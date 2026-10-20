import { mkdir, access, writeFile, chmod } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomBytes } from 'node:crypto';
import { spawnSync } from 'node:child_process';

const repo = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const directory = resolve(process.env.ELECTRO_SIGNING_DIRECTORY ?? resolve(repo, '..', 'electro-signing'));
if (directory === repo || directory.startsWith(repo + '/')) throw new Error('Keep signing files outside the repository.');
await mkdir(directory, { recursive: true, mode: 0o700 });
await chmod(directory, 0o700);
const key = resolve(directory, 'electro-beta.p12');
const properties = resolve(directory, 'signing.properties');
const exists = async path => access(path).then(() => true, () => false);
if (await exists(key) && await exists(properties)) {
  console.log('Existing private beta signing key preserved.');
} else {
  if (await exists(key) || await exists(properties)) throw new Error('Incomplete signing setup. Recover the matching signing files before continuing; do not replace the existing key.');
  const passwordPath = resolve(directory, 'password.txt');
  const password = randomBytes(32).toString('hex');
  await writeFile(passwordPath, password, { mode: 0o600, flag: 'wx' });
  const generated = spawnSync('keytool', ['-genkeypair', '-storetype', 'PKCS12', '-keystore', key, '-storepass:file', passwordPath, '-keypass:file', passwordPath, '-alias', 'electro-beta', '-keyalg', 'RSA', '-keysize', '3072', '-validity', '3650', '-dname', 'CN=ELECTRO Private Beta'], { encoding: 'utf8' });
  if (generated.status !== 0) throw new Error('Private beta key generation failed. Inspect the signing directory before retrying.');
  await chmod(key, 0o600);
  await writeFile(properties, `storeFile=${key.replaceAll('\\', '\\\\')}\nstorePassword=${password}\nkeyAlias=electro-beta\nkeyPassword=${password}\n`, { mode: 0o600, flag: 'wx' });
  console.log('Created a dedicated private beta signing key outside the repository. Keep a secure backup for future app updates.');
}
console.log(`Signing properties path: ${properties}`);
