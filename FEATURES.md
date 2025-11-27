# Runvent App - Feature Documentation

## Overview

Runvent is a mobile running challenge app where users progressively increase their daily running distance throughout December, starting at 1 km/mile on December 1st and ending at 31 km/miles on December 31st.

## Core Features

### 1. Calendar View (Main Screen)

**Visual Calendar Grid**
- Displays all 31 days of December in a 2-column grid
- Each day card shows:
  - Day number (Day 1, Day 2, etc.)
  - Target distance for that day
  - Completion status (✓ checkmark if completed)
  - Actual distance logged (if any)
  - Visual indicators:
    - 🟢 **Green border**: Completed challenge
    - 🔴 **Red border**: Today's challenge
    - 🔒 **"LOCKED"**: Future dates (cannot log yet)

**Progress Statistics**
- Two stat boxes at the top:
  1. **Days Completed**: Count of successfully completed challenges
  2. **Total Distance**: Sum of all logged runs

**Smart Date Handling**
- Users can only log runs for:
  - Today's date
  - Past dates
- Future dates are locked to prevent cheating
- Alert shown if user tries to log future run

### 2. Run Logging System

**Modal Dialog**
- Appears when tapping a day card
- Shows:
  - Day number being logged
  - Target distance for that day
  - Input field for actual distance run
  - Cancel and Save buttons

**Completion Logic**
- Run is marked "completed" if distance ≥ target
- Partial runs can be logged but won't show as complete
- Success celebration when target is met
- Helpful feedback if target not yet reached

**Data Persistence**
- All runs saved to device storage
- Can update existing runs
- Timestamp recorded for each entry

### 3. Settings Screen

**Unit Preferences**
- Toggle between:
  - Kilometers (km)
  - Miles
- Changes apply immediately
- Persisted across app restarts

**Year Selection**
- Choose challenge year:
  - 2024
  - 2025
  - 2026
- Each year has independent data
- Allows planning ahead or catching up on past years

**Information Section**
- Explains the challenge concept
- Shows total distance calculation (496 km/miles)
- Provides motivation and context

### 4. Data Management

**AsyncStorage Integration**
- All data stored locally on device
- Two main storage keys:
  1. `@runvent_runs`: Array of run entries
  2. `@runvent_settings`: User preferences
- No account or internet required
- Privacy-first approach

**Data Structure**
```typescript
RunEntry {
  date: "YYYY-MM-DD"
  distance: number
  completed: boolean
  timestamp: number
}

UserSettings {
  unitType: "km" | "miles"
  year: number
}
```

### 5. Navigation

**Bottom Tab Navigation**
- Two main tabs:
  1. **Calendar** (🗓️): Main challenge view
  2. **Settings** (⚙️): Preferences and info
- Red theme color (#FF4444)
- Icons change based on active tab
- Clean, modern design

## User Experience Flow

### First Time User
1. Opens app → sees December calendar
2. Days 1-current are unlocked
3. Future days are locked
4. No runs logged yet
5. Can tap today's or past day to log first run

### Daily Usage
1. User completes their run
2. Opens Runvent app
3. Taps today's day card
4. Enters distance
5. Saves run
6. Sees immediate visual feedback
7. Progress stats update

### Checking Progress
1. Opens app
2. Sees at-a-glance calendar with green checks
3. Views total distance in header stats
4. Feels motivated by visual progress

## UI Design Principles

**Color Scheme**
- Primary Red: `#FF4444` (energetic, motivating)
- Success Green: `#4CAF50` (positive reinforcement)
- Neutral Grays: Clean, readable
- White backgrounds: Clear, spacious

**Typography**
- Bold headers for emphasis
- Clear, readable body text
- Numeric stats large and prominent

**Interaction Design**
- Tap targets appropriately sized
- Modal overlays for focused tasks
- Immediate feedback on actions
- Helpful alerts and messages

**Layout**
- Grid-based calendar (intuitive)
- Consistent spacing and padding
- Bottom navigation (thumb-friendly)
- Scrollable content areas

## Technical Architecture

### Component Structure
```
App.tsx (Root)
├── Navigation Container
    ├── Bottom Tab Navigator
        ├── Calendar Screen
        │   ├── Stats Header
        │   ├── Day Cards Grid (FlatList)
        │   └── Run Logging Modal
        └── Settings Screen
            ├── Unit Selection
            ├── Year Selection
            └── Info Section
```

### Services Layer
- **StorageService**: Handles all data persistence
- **dateUtils**: Date formatting and comparison helpers

### State Management
- React hooks (useState, useEffect)
- useFocusEffect for screen focus handling
- Local component state (no global store needed)

## Future Enhancement Ideas

### Fitness Integration
- [ ] Strava API integration
- [ ] Apple Health / Google Fit sync
- [ ] Auto-import runs from GPS watches

### Social Features
- [ ] Share progress on social media
- [ ] Compare with friends
- [ ] Leaderboards
- [ ] Challenge friends

### Gamification
- [ ] Achievement badges
- [ ] Streak counters
- [ ] Progress milestones
- [ ] Rewards system

### Advanced Tracking
- [ ] GPS route recording
- [ ] Pace tracking
- [ ] Elevation data
- [ ] Weather conditions

### Customization
- [ ] Custom challenge lengths (21 days, 50 days, etc.)
- [ ] Variable distance increments
- [ ] Theme customization
- [ ] Custom app icons

### Analytics
- [ ] Charts and graphs
- [ ] Running statistics
- [ ] Export data (CSV, PDF)
- [ ] Year-over-year comparisons

## Testing Checklist

- [ ] Install fresh app
- [ ] Log a run for today
- [ ] Try to log future date (should block)
- [ ] Complete a day's challenge
- [ ] Log partial run (incomplete)
- [ ] Switch between km/miles
- [ ] Change year
- [ ] Close and reopen app (data persists?)
- [ ] Update existing run
- [ ] View stats update correctly
- [ ] Test on both iOS and Android

## Known Limitations

1. **No Cloud Backup**: Data only on device
2. **No Multi-Device Sync**: Can't use on multiple devices
3. **Manual Entry Only**: No automatic tracking
4. **Fixed Challenge**: Always 1-31, can't customize
5. **No Social Features**: Solo experience only

## Support & Maintenance

### Common Issues
- Expo Go version compatibility
- Device storage permissions
- Date/timezone handling
- Numerical input validation

### Update Considerations
- Database migration strategy
- Backward compatibility
- User data preservation
- Feature flags for rollout

---

Built with ❤️ for runners who love a challenge! 🏃‍♀️

