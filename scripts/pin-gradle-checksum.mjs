import { readFile, writeFile } from 'node:fs/promises';
const expected = JSON.parse(await readFile('docs/android-toolchain.json', 'utf8'));
const file = 'android/gradle/wrapper/gradle-wrapper.properties';
let properties = await readFile(file, 'utf8');
if (!properties.includes(`gradle-${expected.gradleVersion}-bin.zip`)) throw new Error('Gradle version changed. Verify its official checksum before building.');
if (!/^[a-f0-9]{64}$/.test(expected.expectedSha256)) throw new Error('Invalid Gradle distribution checksum.');
properties = properties.replace(/^distributionSha256Sum=.*\n?/m, '');
await writeFile(file, `${properties.trim()}\ndistributionSha256Sum=${expected.expectedSha256}\n`);
