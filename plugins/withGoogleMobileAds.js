const { withInfoPlist, withAndroidManifest } = require('@expo/config-plugins');

function withGoogleMobileAds(config, { androidAppId, iosAppId }) {
  // iOS configuration
  config = withInfoPlist(config, (config) => {
    if (iosAppId) {
      config.modResults.GADApplicationIdentifier = iosAppId;
    }
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
