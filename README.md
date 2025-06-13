# Firebird Fit 🔥

A modern fitness and communication app designed specifically for high school athletes and coaches to replace traditional paper-based workout tracking and improve team communication.

## 🌟 Features

### For Athletes
- **Dashboard**: Personalized widget-based home screen with workout stats and upcoming events
- **Workouts**: View assigned workouts, track progress, and complete exercises
- **Calendar**: See upcoming games, practices, and workout sessions
- **Messages**: Team communication and direct messaging with coaches
- **Profile**: Personal stats, achievements, and settings

### For Coaches
- **Dashboard**: Team management overview with athlete activity and stats
- **Workout Management**: Create and assign workouts to individual athletes or groups
- **Schedule Management**: Add games, practices, and team events to the calendar
- **Team Communication**: Broadcast messages and manage team chats
- **Athlete Monitoring**: Track team progress and individual performance

## 🎨 Design

The app features a beautiful, modern UI built with:
- **Royal Blue** (#2B5CB0) - Primary brand color
- **Gold** (#FFD700) - Secondary/accent color  
- **Soft White** (#FAFAFA) - Background color

## 🏗️ Tech Stack

- **React Native** with **Expo** for cross-platform mobile development
- **TypeScript** for type safety
- **Expo Router** for navigation
- **React Navigation** for tab and stack navigation
- **Expo Linear Gradient** for beautiful gradient effects
- **React Native Calendars** for calendar functionality
- **Custom Chat Implementation** for messaging features (Expo Go compatible)
- **React Native Gesture Handler** for enhanced navigation and swipe gestures
- **AsyncStorage** for local data persistence

## 📱 App Structure

```
FirebirdFit/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx          # Home dashboard
│   │   ├── workouts.tsx       # Workout management
│   │   ├── calendar.tsx       # Schedule & calendar
│   │   ├── messages.tsx       # Team communication
│   │   ├── profile.tsx        # User profile
│   │   └── _layout.tsx        # Tab navigation
│   ├── auth.tsx               # Authentication screen
│   ├── onboarding.tsx         # First-time user onboarding
│   └── _layout.tsx            # Root layout with auth context
├── contexts/
│   └── AuthContext.tsx        # Authentication state management
├── constants/
│   └── Colors.ts              # App color scheme
└── components/                # Reusable UI components
```

## 🚀 Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the development server**
   ```bash
   npx expo start
   ```

3. **Run on specific platforms**
   ```bash
   npx expo start --android   # Android emulator/device
   npx expo start --ios       # iOS simulator (macOS only)
   npx expo start --web       # Web browser
   ```

## 🔧 Development

- **Type checking**: `npx tsc --noEmit`
- **Dependency compatibility**: `npx expo install --fix`
- **Clear cache**: `npx expo start --clear`

## 📋 Current Status

✅ **Completed Features:**
- Complete app framework and navigation
- Authentication system with onboarding
- Role-based UI (athlete vs coach)
- Home dashboard with widgets
- Workout creation and management
- Calendar with event management
- Team messaging system with custom implementation
- User profile with stats and settings
- **Enhanced Navigation**: Swipe-to-dismiss modals and improved back buttons
- **Modern UX**: Gesture-based interactions and smooth animations
- **Expo Go Compatible**: All features work in Expo Go for easy testing

🔄 **Next Steps:**
- Backend integration
- Real-time messaging
- Push notifications
- Offline functionality
- Performance analytics
- Team roster management

## 🎯 Key Differentiators

- **Role-Based Experience**: Different interfaces and features for athletes vs coaches
- **Modern UI/UX**: Beautiful, intuitive design with swipe gestures and enhanced navigation
- **Comprehensive Solution**: Replaces multiple tools (paper workouts, group chats, scheduling apps)
- **Team-Focused**: Built specifically for team sports communication and coordination
- **Expo Go Ready**: Fully compatible with Expo Go for immediate testing and development

## 🎮 Enhanced Navigation Features

- **Swipe Gestures**: All modals support swipe-down to dismiss
- **Visual Feedback**: Swipe indicators and enhanced button styling
- **Consistent UX**: Uniform navigation patterns across all screens
- **Accessibility**: Improved touch targets and visual hierarchy

---

Built with ❤️ for high school athletics teams
