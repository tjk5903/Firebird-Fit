/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#2B5CB0'; // Royal Blue
const tintColorDark = '#FFD700'; // Gold

export const Colors = {
  light: {
    text: '#11181C',
    background: '#FAFAFA', // Soft White
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    primary: '#2B5CB0', // Royal Blue
    secondary: '#FFD700', // Gold
    accent: '#FAFAFA', // Soft White
    success: '#4CAF50',
    warning: '#FF5722',
    error: '#F44336',
    cardBackground: '#FFFFFF',
    border: '#E1E8ED',
    placeholder: '#9CA3AF',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    primary: '#2B5CB0', // Royal Blue
    secondary: '#FFD700', // Gold
    accent: '#FAFAFA', // Soft White
    success: '#4CAF50',
    warning: '#FF5722',
    error: '#F44336',
    cardBackground: '#1F2937',
    border: '#374151',
    placeholder: '#6B7280',
  },
};

export const FirebirdColors = {
  royalBlue: '#2B5CB0',
  gold: '#FFD700',
  softWhite: '#FAFAFA',
  white: '#FFFFFF',
  lightGray: '#F5F5F5',
  mediumGray: '#9CA3AF',
  darkGray: '#374151',
  success: '#4CAF50',
  warning: '#FF5722',
  error: '#F44336',
  danger: '#DC2626',
};
