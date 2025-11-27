# Runvent 🏃‍♀️📅

A mobile running advent calendar app built with React Native and Expo.

## What is Runvent?

Runvent is a December running challenge where you progressively run more each day:
- Day 1: Run 1 km (or mile)
- Day 2: Run 2 km (or miles)
- Day 3: Run 3 km (or miles)
- ...and so on through December 31st!

By the end of the month, you'll have run a total of **496 km** (or miles)!

## Features

- 📅 **Visual Calendar**: See all 31 days of December with your progress
- ✅ **Track Progress**: Log your runs and mark days as complete
- 🎯 **Daily Targets**: Clear targets for each day
- 📊 **Statistics**: View total distance and completed days
- ⚙️ **Flexible Settings**: Switch between kilometers and miles
- 🔒 **Date Protection**: Can only log runs for today or past dates
- 💾 **Local Storage**: All your data is saved on your device

## Getting Started

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn
- Expo Go app on your mobile device (for testing)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Scan the QR code with:
   - **iOS**: Camera app
   - **Android**: Expo Go app

### Build for Production

```bash
# iOS
npx expo build:ios

# Android
npx expo build:android
```

## Tech Stack

- **React Native**: Cross-platform mobile development
- **Expo**: Development framework and tools
- **TypeScript**: Type-safe code
- **React Navigation**: Navigation between screens
- **AsyncStorage**: Local data persistence
- **Expo Vector Icons**: Beautiful icons

## Project Structure

```
Runvent/
├── App.tsx                 # Main app entry point
├── src/
│   ├── screens/           # Screen components
│   │   ├── CalendarScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── services/          # Business logic
│   │   └── StorageService.ts
│   ├── utils/             # Helper functions
│   │   └── dateUtils.ts
│   └── types/             # TypeScript types
│       └── index.ts
├── assets/                # Images and icons
├── package.json
└── app.json
```

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT

## Acknowledgments

Inspired by running advent calendars and the amazing running community! 🏃‍♂️💨

