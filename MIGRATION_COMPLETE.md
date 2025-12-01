# Migration from Expo to Bare React Native - COMPLETE

## ✅ Completed Changes

### 1. Package Dependencies
- ✅ Removed: `expo`, `expo-dev-client`, `expo-in-app-purchases`, `expo-status-bar`, `@expo/vector-icons`, `@expo/config-plugins`
- ✅ Added: `react-native-iap`, `react-native-vector-icons`, `@react-native/babel-preset`, `@react-native/metro-config`

### 2. Entry Point
- ✅ Changed `main` from `node_modules/expo/AppEntry.js` to `index.js`
- ✅ Created `index.js` with standard React Native AppRegistry

### 3. Babel Configuration
- ✅ Updated `babel.config.js` to use `@react-native/babel-preset` instead of `babel-preset-expo`

### 4. Metro Configuration
- ✅ Created `metro.config.js` for React Native Metro bundler

### 5. iOS AppDelegate
- ✅ Removed Expo dependencies (`EXAppDelegateWrapper`, `Expo.h`)
- ✅ Converted to standard React Native `RCTAppDelegate`
- ✅ Updated bundle root from `.expo/.virtual-metro-entry` to `index`

### 6. Code Updates
- ✅ Replaced `@expo/vector-icons` with `react-native-vector-icons` in CalendarScreen and SettingsScreen
- ✅ Replaced `expo-in-app-purchases` with `react-native-iap` in PurchaseService
- ✅ Updated PurchaseService API to use react-native-iap methods

### 7. Podfile
- ✅ Removed `use_expo_modules!`
- ✅ Removed `expo_patch_react_imports!`
- ✅ Removed Expo autolinking script
- ✅ Added react-native-vector-icons pod
- ✅ Updated Podfile.properties.json to remove Expo references

### 8. App Configuration
- ✅ Updated scripts in package.json to use `react-native` CLI instead of `expo`

## ⚠️ Next Steps Required

### 1. Install Pods
```bash
cd ios
pod install
cd ..
```

### 2. Link react-native-vector-icons (iOS)
The fonts have been added to Info.plist. You may need to:
- Copy font files to iOS project (react-native-vector-icons should handle this via pod)
- Or manually add fonts to Xcode project

### 3. Configure react-native-iap
- Update `PurchaseService.ts` if needed based on react-native-iap version
- Test in-app purchases functionality

### 4. Remove Expo Files (Optional)
You can now remove:
- `app.json` (or keep for reference, but it won't be used)
- `eas.json` (if not using EAS)
- `plugins/withGoogleMobileAds.js` (you'll need to configure AdMob manually in native projects)
- Expo-specific patches

### 5. Update Build Process
- Use Xcode directly for iOS builds
- Use Android Studio for Android builds
- Or set up your own CI/CD pipeline

### 6. Test the App
```bash
npm start
# In another terminal:
npm run ios
```

## 📝 Important Notes

1. **No More Expo Go**: You can't use Expo Go anymore. You must build native apps.

2. **Native Configuration**: You'll need to configure AdMob and other native modules directly in Xcode/Android Studio.

3. **Build Process**: 
   - iOS: Use Xcode or `react-native run-ios`
   - Android: Use Android Studio or `react-native run-android`

4. **EAS Build**: If you were using EAS Build, you'll need to set up your own build process or use React Native's standard build tools.

5. **One-Way Migration**: This is a one-way process. You cannot easily go back to Expo.

## 🔧 Manual Configuration Still Needed

1. **AdMob Configuration**: The config plugin won't work anymore. You'll need to:
   - Manually add AdMob App ID to `Info.plist` (iOS)
   - Manually add AdMob App ID to `AndroidManifest.xml` (Android)

2. **react-native-vector-icons**: Ensure fonts are properly linked in Xcode

3. **react-native-iap**: May need additional native configuration

