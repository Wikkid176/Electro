const { withAppBuildGradle, withDangerousMod } = require('expo/config-plugins');
const { mkdir, copyFile } = require('node:fs/promises');
const path = require('node:path');

module.exports = function withBetaAndroid(config) {
  config = withAppBuildGradle(config, result => {
    const marker = '// ELECTRO private beta signing';
    if (!result.modResults.contents.includes(marker)) result.modResults.contents += `
${marker}
def electroSigningFile = System.getenv('ELECTRO_BETA_SIGNING_PROPERTIES')
if (electroSigningFile) {
    def electroSigning = new Properties()
    file(electroSigningFile).withInputStream { electroSigning.load(it) }
    android.signingConfigs {
        electroBeta {
            storeFile file(electroSigning.getProperty('storeFile'))
            storePassword electroSigning.getProperty('storePassword')
            keyAlias electroSigning.getProperty('keyAlias')
            keyPassword electroSigning.getProperty('keyPassword')
        }
    }
    android.buildTypes.release.signingConfig = android.signingConfigs.electroBeta
}
`;
    return result;
  });
  return withDangerousMod(config, ['android', async result => {
    const assets = path.join(result.modRequest.platformProjectRoot, 'app/src/main/assets');
    await mkdir(assets, { recursive: true });
    for (const file of ['THIRD_PARTY_NOTICES.txt', 'LICENSE']) await copyFile(path.join(result.modRequest.projectRoot, file), path.join(assets, file));
    return result;
  }]);
};
