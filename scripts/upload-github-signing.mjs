// One-time provisioning: gh encrypts each value using the repository's public key.
// Values travel on stdin; never print them or put them in process arguments.
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const repo = 'Wikkid176/Electro';
const directory = resolve(process.env.ELECTRO_SIGNING_DIRECTORY ?? '../electro-signing');
const properties = await readFile(resolve(directory, 'signing.properties'), 'utf8');
const fields = Object.fromEntries(properties.trim().split(/\r?\n/).map(line => {
  const index = line.indexOf('=');
  return [line.slice(0, index), line.slice(index + 1)];
}));
for (const name of ['storeFile', 'storePassword', 'keyPassword', 'keyAlias']) {
  if (!fields[name]) throw new Error(`Missing signing property: ${name}. Recover the original signing files.`);
}
const key = await readFile(fields.storeFile);
const secrets = {
  ELL_BETA_KEYSTORE_BASE64: key.toString('base64'),
  ELL_BETA_STORE_PASSWORD: fields.storePassword,
  ELL_BETA_KEY_PASSWORD: fields.keyPassword,
  ELL_BETA_KEY_ALIAS: fields.keyAlias,
};
const listed = spawnSync('gh', ['secret', 'list', '--repo', repo, '--json', 'name'], { encoding: 'utf8' });
if (listed.status !== 0) throw new Error('GitHub secret metadata is inaccessible. Check API access and repository secret permissions; no secrets were changed.');
const existing = new Set(JSON.parse(listed.stdout).map(item => item.name));
const present = Object.keys(secrets).filter(name => existing.has(name));
if (present.length) {
  if (present.length === Object.keys(secrets).length) {
    console.log('All beta signing secrets already exist; left unchanged. The workflow will verify their certificate.');
    process.exit(0);
  }
  throw new Error('Partial beta signing secrets exist. Recover the matching set rather than overwriting keys automatically.');
}
for (const [name, value] of Object.entries(secrets)) {
  const result = spawnSync('gh', ['secret', 'set', name, '--repo', repo], { input: value, encoding: 'utf8' });
  if (result.status !== 0) throw new Error(`Could not save ${name}. Do not rotate the existing beta key; recover any partial provisioning.`);
  console.log(`Saved encrypted repository secret ${name}.`);
}
