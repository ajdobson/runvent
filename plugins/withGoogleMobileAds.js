const { withInfoPlist, withAndroidManifest, withXcodeProject } = require('@expo/config-plugins');

function withGoogleMobileAds(config, { androidAppId, iosAppId }) {
  // iOS configuration
  config = withInfoPlist(config, (config) => {
    if (iosAppId) {
      config.modResults.GADApplicationIdentifier = iosAppId;
    }
    return config;
  });

  // Configure Xcode project for Swift support
  config = withXcodeProject(config, (config) => {
    const xcodeProject = config.modResults;
    
    // Ensure Swift is enabled
    xcodeProject.addBuildProperty('SWIFT_VERSION', '5.0');
    xcodeProject.addBuildProperty('ALWAYS_EMBED_SWIFT_STANDARD_LIBRARIES', 'YES');
    xcodeProject.addBuildProperty('CLANG_ENABLE_MODULES', 'YES');
    
    return config;
  });

  // Android configuration
  config = withAndroidManifest(config, (config) => {
    const androidManifest = config.modResults.manifest;
    const { application } = androidManifest;

    if (application && androidAppId) {
      // Add meta-data for AdMob App ID
      if (!application.metaData) {
        application.metaData = [];
      }

      // Check if meta-data already exists
      const existingMetaData = application.metaData.find(
        (item) => item.$['android:name'] === 'com.google.android.gms.ads.APPLICATION_ID'
      );

      if (!existingMetaData) {
        application.metaData.push({
          $: {
            'android:name': 'com.google.android.gms.ads.APPLICATION_ID',
            'android:value': androidAppId,
          },
        });
      } else {
        existingMetaData.$['android:value'] = androidAppId;
      }
    }

    return config;
  });

  return config;
}

module.exports = withGoogleMobileAds;
