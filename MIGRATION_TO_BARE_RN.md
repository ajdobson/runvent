# Migration from Expo to Bare React Native

## Overview
This guide will help you migrate from Expo to bare React Native. This is a significant change that removes Expo tooling.

## What You'll Lose
- EAS Build (you'll need to use Xcode/Android Studio directly)
- Expo Go compatibility
- Expo modules (need to replace with React Native equivalents)
- Expo CLI tooling
- Automatic native configuration

## What You'll Gain
- Full control over native code
- No Expo dependencies
- Direct access to native modules
- Standard React Native setup

## Migration Steps

### 1. Update package.json
Remove Expo dependencies and add React Native equivalents.

### 2. Update App Entry Point
Change from `expo/AppEntry.js` to standard React Native entry.

### 3. Update Babel Config
Replace `babel-preset-expo` with `@react-native/babel-preset`.

### 4. Replace Expo Modules
- `expo-status-bar` → Remove or use React Native StatusBar
- `expo-in-app-purchases` → Use `react-native-iap` or `@react-native-async-storage/async-storage` for receipts
- `@expo/vector-icons` → Use `react-native-vector-icons` or `@react-native-community/icons`

### 5. Update Native Projects
- Remove Expo-specific code from iOS/Android
- Update AppDelegate/MainActivity
- Remove Expo.plist and Expo dependencies

### 6. Update Build Scripts
Replace Expo scripts with React Native CLI scripts.

## Important Notes
- This is a one-way migration - you cannot easily go back to Expo
- You'll need to handle all native configuration manually
- Some Expo modules don't have direct React Native equivalents
- You'll need to set up your own CI/CD for builds

