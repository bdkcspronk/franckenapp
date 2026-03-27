// Central theme and small helpers for styling across the app.
import React, { createContext, useContext } from 'react';
import { View, Text } from 'react-native';

const colors = {
  primary: '#e62c2c',
  accent: '#ffb400',
  canvas: '#f8f9fa',
  card: '#131f2b',
  surface: '#404350',
  surfaceAlt1: '#194f88',
  surfaceAlt2: '#b42f2f',
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

  return (
    <ThemeContext.Provider value={Theme}>
      <View style={{ flex: 1, backgroundColor: Theme.colors.canvas }}>{children}</View>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

export { Theme };
