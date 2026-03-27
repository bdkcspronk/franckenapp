import React from 'react';
import { NavigationContainer, DefaultTheme as NavDefaultTheme } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Text } from 'react-native';
import { AuthProvider } from './contexts/AuthContext';
import RootNavigator from './navigation';
import { ThemeProvider, useTheme } from './theme';

export default function App() {
  // load custom fonts from assets/fonts (MADE TOMMY family)
  const [fontsLoaded] = useFonts({
    'MadeTommy-Thin': require('../assets/fonts/MADE TOMMY Thin.otf'),
    'MadeTommy-Light': require('../assets/fonts/MADE TOMMY Light.otf'),
    'MadeTommy-Regular': require('../assets/fonts/MADE TOMMY Regular.otf'),
    'MadeTommy-Medium': require('../assets/fonts/MADE TOMMY Medium.otf'),
    'MadeTommy-Bold': require('../assets/fonts/MADE TOMMY Bold.otf'),
    'MadeTommy-Black': require('../assets/fonts/MADE TOMMY Black.otf'),
    'MadeTommy-ExtraBold': require('../assets/fonts/MADE TOMMY ExtraBold.otf')
  });

  // set default Text font family after fonts loaded
  if (fontsLoaded) {
    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.style = { ...(Text.defaultProps.style || {}), fontFamily: 'MadeTommy-Regular' };
  }

  if (!fontsLoaded) return null; // or show a loader

  return (
    <AuthProvider>
      <ThemeProvider>
        <ThemedNavigation />
      </ThemeProvider>
    </AuthProvider>
  );
}

function ThemedNavigation() {
  const theme = useTheme();
  const navTheme = {
    ...NavDefaultTheme,
    colors: {
      ...NavDefaultTheme.colors,
      background: theme.colors.canvas,
      card: theme.colors.card,
      text: theme.colors.text,
      primary: theme.colors.primary
    }
  };

  return (
    <NavigationContainer theme={navTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}
