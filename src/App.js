import React from 'react';
import { NavigationContainer, DefaultTheme as NavDefaultTheme } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Text, View, Image, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './contexts/AuthContext';
import RootNavigator from './navigation';
import { ThemeProvider, Theme, useTheme } from './theme';

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

  return (
    <AuthProvider>
      <ThemeProvider>
        {fontsLoaded ? <ThemedNavigation /> : <InitialPlaceholder />}
      </ThemeProvider>
    </AuthProvider>
  );
}

function InitialPlaceholder() {
  return (
    <>
      <StatusBar style="light" backgroundColor={Theme.colors.card} />
      <View style={[styles.container, { backgroundColor: Theme.colors.card }]}>
        <Image source={require('../assets/splash/splash_2048.png')} style={styles.logo} resizeMode="contain" />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  logo: { width: 280, height: 280 },
});

function ThemedNavigation() {
  const theme = useTheme();
  const navTheme = {
    ...NavDefaultTheme,
      colors: {
      ...NavDefaultTheme.colors,
      background: theme.colors.canvas,
      card: theme.colors.card,
      text: theme.colors.text,
      primary: theme.colors.activate
    }
  };

  return (
    <>
      <StatusBar style="light" backgroundColor={theme.colors.card} />
      <NavigationContainer theme={navTheme}>
        <RootNavigator />
      </NavigationContainer>
    </>
  );
}
