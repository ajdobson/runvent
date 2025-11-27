# Quick Setup Guide for Runvent

## Installation Steps

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```

3. **Run on your device:**
   - Install the "Expo Go" app on your iOS or Android device
   - Scan the QR code from the terminal with:
     - **iOS**: Use the Camera app
     - **Android**: Use the Expo Go app
   
   OR run on a simulator:
   ```bash
   # iOS Simulator (macOS only)
   npm run ios
   
   # Android Emulator
   npm run android
   ```

## Features Overview

### Calendar Screen
- View all 31 days of December
- See your progress at a glance
- Days show as:
  - **GREEN border** = Completed
  - **RED border** = Today
  - **LOCKED** = Future dates (can't log yet)
- Tap any day to log a run
- Stats at the top show total days completed and distance

### Logging a Run
1. Tap on a day card (today or past dates only)
2. Enter the distance you ran
3. Tap "Save"
4. If you meet or exceed the target, the day is marked as complete! 🎉

### Settings Screen
- Switch between kilometers and miles
- Change the challenge year (2024, 2025, 2026)
- View information about the challenge

## How the Challenge Works

- **Day 1**: Run 1 km (or mile)
- **Day 2**: Run 2 km (or miles)
- **Day 3**: Run 3 km (or miles)
- **...**
- **Day 31**: Run 31 km (or miles)

**Total by end of December: 496 km (or miles)!**

## Troubleshooting

### "Expo Go" not working?
- Make sure your phone and computer are on the same WiFi network
- Try restarting the Expo server with `npm start`

### App crashes or errors?
- Clear the app data in Expo Go
- Restart the development server
- Check that all dependencies are installed

### Want to customize?
- Edit colors in the StyleSheet objects in each screen
- Modify the app name in `app.json`
- Adjust the challenge rules in `CalendarScreen.tsx`

## Data Storage

All your run data is stored locally on your device using AsyncStorage. Your data will persist even if you close the app!

To clear all data, you can uninstall and reinstall the app.

## Next Steps

Consider adding:
- Strava/Apple Health integration
- Social sharing features
- Achievements and badges
- Export your progress
- Custom app icons

Happy running! 🏃‍♀️💨

