# Testing In-App Purchases in Expo

## Why Expo Go Doesn't Support IAP

In-app purchases require native modules that aren't included in Expo Go. You need to create a **development build** or **production build** to test IAP.

## Option 1: Development Build (Recommended for Testing)

### Prerequisites
- Expo account (free)
- EAS CLI installed: `npm install -g eas-cli`
- iOS: Apple Developer account (free for testing)
- Android: Google Play Console account (free)

### Steps

1. **Install EAS CLI:**
   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo:**
   ```bash
   eas login
   ```

3. **Configure EAS:**
   ```bash
   eas build:configure
   ```

4. **Create a development build for iOS:**
   ```bash
   eas build --profile development --platform ios
   ```
   
   Or for Android:
   ```bash
   eas build --profile development --platform android
   ```

5. **Install the build on your device:**
   - iOS: Download from the build URL or use TestFlight
   - Android: Download the APK and install

### Testing with Sandbox Accounts

**iOS:**
1. Create sandbox test accounts in App Store Connect
2. Sign out of your Apple ID on the device
3. When prompted during purchase, sign in with sandbox account
4. Test purchases won't charge real money

**Android:**
1. Add test accounts in Google Play Console
2. Add yourself as a license tester
3. Purchases will be free for testers

## Option 2: Local Development Build

### For iOS (macOS only):

1. **Install CocoaPods dependencies:**
   ```bash
   cd ios
   pod install
   cd ..
   ```

2. **Run on device/simulator:**
   ```bash
   npx expo run:ios --device
   ```

### For Android:

1. **Run on device/emulator:**
   ```bash
   npx expo run:android
   ```

## Option 3: Production Build (For Final Testing)

```bash
# iOS
eas build --profile production --platform ios

# Android  
eas build --profile production --platform android
```

## Setting Up Products

### iOS (App Store Connect):

1. Go to App Store Connect → Your App → Features → In-App Purchases
2. Create a "Consumable" product
3. Product ID: `com.runvent.removeads` (must match your code)
4. Set price and description
5. Submit for review (can take time)

### Android (Google Play Console):

1. Go to Google Play Console → Your App → Monetize → Products → In-app products
2. Create a product
3. Product ID: `com.runvent.removeads` (must match your code)
4. Set price and description
5. Activate the product

## Testing Checklist

- [ ] Product ID matches in code and store
- [ ] Sandbox/test account created
- [ ] Development build installed on device
- [ ] Test purchase flow
- [ ] Test restore purchases
- [ ] Verify purchase status persists
- [ ] Test on both iOS and Android

## Troubleshooting

**"In-app purchases not available" error:**
- Make sure you're using a development/production build, not Expo Go
- Verify product ID matches exactly
- Check that products are approved/active in stores
- Ensure you're signed in with a test account

**Purchase not completing:**
- Check network connection
- Verify product exists in store
- Try signing out and back in with test account
- Check device logs for errors

## Quick Test Without Real IAP

For development/testing, you can temporarily add a test button that simulates a purchase:

```typescript
// In SettingsScreen.tsx - temporary for testing
const handleTestPurchase = async () => {
  await PurchaseService.setAdsRemoved(true);
  setAdsRemoved(true);
  Alert.alert('Test Mode', 'Ads removed (test mode)');
};
```

## Resources

- [Expo Development Builds](https://docs.expo.dev/development/introduction/)
- [EAS Build](https://docs.expo.dev/build/introduction/)
- [iOS In-App Purchase Testing](https://developer.apple.com/in-app-purchase/)
- [Android In-App Billing Testing](https://developer.android.com/google/play/billing/test)

