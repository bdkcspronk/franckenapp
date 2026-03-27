// Central theme and small helpers for styling across the app.
import React, { createContext, useContext } from 'react';
import { View, Text, Platform, StatusBar as RNStatusBar } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

const colors = {
  primary: '#139119',
  activate: '#28e732',
  deactivate:'#e02424',
  accent: '#c70909',
  canvas: '#f8f9fa',
  card: '#1d2f41',
  surface: '#f2e8f3',
  surfaceAlt1: '#618bbb',
  surfaceAlt2: '#ca6565',
  text: '#222222',
  textDark: '#222222',
  textLight: '#ffffff',
  muted: '#6b7280',
  danger: '#e02424'
};

const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 50,
};

const typography = {
  h1: { fontFamily: 'MadeTommy-Black', fontSize: 24, fontWeight: '700' },
  h2: { fontFamily: 'MadeTommy-Bold', fontSize: 18, fontWeight: '600' },
  h3: { fontFamily: 'MadeTommy-Regular', fontSize: 16, fontWeight: '600' },
  body: { fontFamily: 'MadeTommy-Regular', fontSize: 14, fontWeight: '400' },
  label: { fontFamily: 'MadeTommy-Medium', fontSize: 12, fontWeight: '500' }
};

// base theme object exported at bottom as default

export function themedStyle(getStyles) {
  // helper to create styles with theme injected
  return (theme) => getStyles(theme || { colors, spacing, typography });
}

// Theme context + provider + hook
const Theme = { colors, spacing, typography };
const ThemeContext = createContext(Theme);

export function ThemeProvider({ children }) {
  // apply global default Text color to the chosen theme text token
  Text.defaultProps = Text.defaultProps || {};
  Text.defaultProps.style = { ...(Text.defaultProps.style || {}), color: Theme.colors.textDark };
  function ThemeInterior() {
    const insets = useSafeAreaInsets();
    return (
      <View style={{ flex: 1, backgroundColor: Theme.colors.card }}>
        <View style={{ flex: 1, backgroundColor: Theme.colors.canvas, marginTop: Theme.spacing.xl, marginBottom: Theme.spacing.sm }}>{children}</View>
      </View>
    );
  }

  return (
    <ThemeContext.Provider value={Theme}>
      <SafeAreaProvider>
        <ThemeInterior />
      </SafeAreaProvider>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

export { Theme };
