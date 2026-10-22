const { withAppBuildGradle, withDangerousMod } = require('expo/config-plugins');
const { mkdir, copyFile, writeFile } = require('node:fs/promises');
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
    // Keep the complete mascot/badge inside round and squircle mask safe areas.
    // This is a drawable composition; the generated source PNG is unchanged.
    const res = path.join(result.modRequest.platformProjectRoot, 'app/src/main/res');
    await mkdir(path.join(res, 'drawable'), { recursive: true });
    await writeFile(path.join(res, 'drawable/ell_click_foreground.xml'), `<?xml version="1.0" encoding="utf-8"?>
<inset xmlns:android="http://schemas.android.com/apk/res/android" android:drawable="@mipmap/ic_launcher_foreground" android:inset="14%" />
`);
    await mkdir(path.join(res, 'mipmap-anydpi-v26'), { recursive: true });
    const adaptive = `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/iconBackground" />
    <foreground android:drawable="@drawable/ell_click_foreground" />
</adaptive-icon>
`;
    for (const name of ['ic_launcher.xml', 'ic_launcher_round.xml']) await writeFile(path.join(res, 'mipmap-anydpi-v26', name), adaptive);
    return result;
  }]);
};
