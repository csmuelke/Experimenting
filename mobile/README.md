# LearnSocial Mobile App

React Native + Expo mobile application for LearnSocial.

## Quick Start

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your API URL

# Start development server
npm start
```

Then press:
- `i` for iOS simulator
- `a` for Android emulator
- Scan QR code for physical device

## Available Scripts

```bash
npm start          # Start Expo development server
npm run android    # Run on Android
npm run ios        # Run on iOS
npm run web        # Run in browser (experimental)
npm test          # Run tests
npm run lint      # Lint code
```

## Project Structure

```
mobile/
├── src/
│   ├── components/        # Reusable UI components
│   ├── screens/          # Screen components
│   │   ├── LoginScreen.tsx
│   │   ├── RegisterScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── TimerScreen.tsx
│   │   └── ProfileScreen.tsx
│   ├── navigation/       # Navigation configuration
│   │   └── AppNavigator.tsx
│   ├── store/           # State management (Zustand)
│   │   └── authStore.ts
│   ├── services/        # API services
│   │   └── api/
│   │       ├── client.ts
│   │       └── auth.ts
│   ├── types/           # TypeScript type definitions
│   │   └── index.ts
│   └── utils/           # Utility functions
├── App.tsx              # Root component
└── index.js             # Entry point
```

## Environment Variables

```env
API_URL=http://localhost:3000/api
NODE_ENV=development
```

**Note:** For physical devices, replace `localhost` with your computer's IP address.

## Features

### Implemented
- ✅ User authentication (login/register)
- ✅ Basic navigation
- ✅ Profile screen
- ✅ Timer screen
- ✅ Feed screen layout

### In Progress
- 🔄 Learning session creation
- 🔄 Activity feed
- 🔄 User search
- 🔄 Follow/unfollow

### Planned
- 📋 Analytics
- 📋 Notifications
- 📋 Comments
- 📋 Study groups

## State Management

Uses Zustand for global state:

```typescript
// Example: Using auth store
import { useAuthStore } from '@/store/authStore';

function MyComponent() {
  const { user, login, logout } = useAuthStore();
  
  // ...
}
```

## API Integration

API calls are organized in `/src/services/api/`:

```typescript
// Example: Making API calls
import { sessionsApi } from '@/services/api/sessions';

const sessions = await sessionsApi.getAll();
```

## Navigation

React Navigation with stack and tab navigators:

- Auth Stack (Login, Register)
- Main Tabs (Home, Timer, Profile)

## Styling

Uses React Native Paper for UI components and StyleSheet for custom styles.

```typescript
import { Button, Text } from 'react-native-paper';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
```

## Running on Devices

### iOS Simulator (macOS only)
```bash
npm run ios
```

### Android Emulator
```bash
npm run android
```

### Physical Device
1. Install Expo Go from App Store/Play Store
2. Run `npm start`
3. Scan QR code with device

## Building for Production

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure build
eas build:configure

# Build iOS
eas build --platform ios

# Build Android
eas build --platform android
```

See [Deployment Guide](../docs/DEPLOYMENT.md) for details.

## Testing

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
```

## Troubleshooting

**App not loading on device**
- Ensure device and computer on same WiFi
- Check firewall settings
- Try: `npm start --tunnel`

**Build failed**
- Clear cache: `expo start -c`
- Reinstall: `rm -rf node_modules && npm install`

**API not connecting**
- Check API_URL in .env
- Use IP address instead of localhost for physical devices
- Ensure backend is running

## Development Tips

- Use React Native Debugger for better debugging
- Reload: Shake device or `Cmd+D` (iOS) / `Cmd+M` (Android)
- Clear cache when dependencies change: `expo start -c`

## Learn More

- [Setup Guide](../docs/SETUP.md)
- [Architecture](../docs/ARCHITECTURE.md)
- [Development Guide](../docs/DEVELOPMENT.md)
- [React Native Docs](https://reactnative.dev/)
- [Expo Docs](https://docs.expo.dev/)
