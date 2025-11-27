# 🏃‍♀️ Runvent - Quick Start Guide

## Getting Started in 3 Steps

### 1️⃣ Install Dependencies
```bash
npm install
```

### 2️⃣ Start Development Server
```bash
npm start
```

### 3️⃣ Run on Your Phone
1. Download **Expo Go** app from App Store or Play Store
2. Scan the QR code shown in terminal
3. App opens on your device!

**Or use the quick start script:**
```bash
./start.sh
```

---

## What You Get

✅ **Calendar View** - See all 31 days of December  
✅ **Run Tracking** - Log your daily runs  
✅ **Progress Stats** - Track completed days and total distance  
✅ **km/miles Toggle** - Choose your preferred unit  
✅ **Local Storage** - Data persists on your device  
✅ **Smart Date Locking** - Can't cheat by logging future runs!  

---

## The Challenge

| Day | Distance | Day | Distance | Day | Distance |
|-----|----------|-----|----------|-----|----------|
| 1   | 1 km     | 11  | 11 km    | 21  | 21 km    |
| 2   | 2 km     | 12  | 12 km    | 22  | 22 km    |
| 3   | 3 km     | 13  | 13 km    | 23  | 23 km    |
| 4   | 4 km     | 14  | 14 km    | 24  | 24 km    |
| 5   | 5 km     | 15  | 15 km    | 25  | 25 km    |
| 6   | 6 km     | 16  | 16 km    | 26  | 26 km    |
| 7   | 7 km     | 17  | 17 km    | 27  | 27 km    |
| 8   | 8 km     | 18  | 18 km    | 28  | 28 km    |
| 9   | 9 km     | 19  | 19 km    | 29  | 29 km    |
| 10  | 10 km    | 20  | 20 km    | 30  | 30 km    |
|     |          |     |          | 31  | 31 km    |

**Total: 496 km (or miles) in one month!** 🎯

---

## Project Structure

```
Runvent/
├── App.tsx                    # Main app entry
├── src/
│   ├── screens/              # UI screens
│   │   ├── CalendarScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── services/             # Business logic
│   │   └── StorageService.ts
│   ├── types/                # TypeScript types
│   │   └── index.ts
│   └── utils/                # Helper functions
│       └── dateUtils.ts
├── package.json              # Dependencies
├── app.json                  # Expo config
└── tsconfig.json             # TypeScript config
```

---

## Tech Stack

- **React Native** - Mobile framework
- **Expo** - Development tools
- **TypeScript** - Type safety
- **React Navigation** - Tab navigation
- **AsyncStorage** - Local data storage
- **Expo Vector Icons** - UI icons

---

## Need Help?

📖 Read the full [README.md](./README.md)  
🎨 See all [FEATURES.md](./FEATURES.md)  
🛠️ Check [SETUP.md](./SETUP.md) for detailed setup

---

## Tips

💡 **Tip 1**: Test on a real device for the best experience  
💡 **Tip 2**: You can switch between km and miles in Settings  
💡 **Tip 3**: Data is saved locally, no internet required  
💡 **Tip 4**: You can log partial runs and update them later  
💡 **Tip 5**: Future dates are locked to keep the challenge fair  

---

**Happy Running! 🏃‍♂️💨**

