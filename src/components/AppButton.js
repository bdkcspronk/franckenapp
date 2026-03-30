// Purpose: Reusable button component with app-specific styling and variants.
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { useTheme } from '../theme';

export default function AppButton({ title, onPress, variant = 'primary', color, disabled, loading, style, textStyle }) {
  const theme = useTheme();

  const variants = {
    primary: { background: theme.colors.activate, text: theme.colors.textLight },
    secondary: { background: theme.colors.accent, text: theme.colors.textLight },
    tertiary: { background: theme.colors.muted, text: theme.colors.textLight },
    danger: { background: theme.colors.deactivate, text: theme.colors.textLight },
    ghost: { background: 'transparent', text: theme.colors.activate },
    activate: { background: theme.colors.activate, text: theme.colors.textLight },
    deactivate: { background: theme.colors.deactivate, text: theme.colors.textLight },
  };

  const v = variants[variant] || variants.primary;
  const backgroundColor = color || v.background;
  const textColor = v.text;

  return (
    <TouchableOpacity
      accessible
      accessibilityRole="button"
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      style={[styles.button, { backgroundColor: backgroundColor, opacity: disabled ? 0.6 : 1 }, style]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <View style={styles.content}>
          <Text style={[{ color: textColor, fontFamily: theme.typography.label.fontFamily, fontSize: theme.typography.label.fontSize }, textStyle]}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
});
