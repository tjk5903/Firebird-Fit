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
- **React Native Gifted Chat** for messaging features
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
   npm start
   ```

3. **Run on specific platforms**
   ```bash
   npm run android   # Android emulator/device
   npm run ios       # iOS simulator (macOS only)
   npm run web       # Web browser
   ```

## 🔧 Development

- **Type checking**: `npx tsc --noEmit`
- **Linting**: `npm run lint`
- **Dependency compatibility**: `npx expo install --fix`

## 📋 Current Status

✅ **Completed Features:**
- Complete app framework and navigation
- Authentication system with onboarding
- Role-based UI (athlete vs coach)
- Home dashboard with widgets
- Workout creation and management
- Calendar with event management
- Team messaging system
- User profile with stats and settings

🔄 **Next Steps:**
- Backend integration
- Real-time messaging
- Push notifications
- Offline functionality
- Performance analytics
- Team roster management

## 🎯 Key Differentiators

- **Role-Based Experience**: Different interfaces and features for athletes vs coaches
- **Modern UI/UX**: Beautiful, intuitive design that appeals to high school users
- **Comprehensive Solution**: Replaces multiple tools (paper workouts, group chats, scheduling apps)
- **Team-Focused**: Built specifically for team sports communication and coordination

---

Built with ❤️ for high school athletics teams
