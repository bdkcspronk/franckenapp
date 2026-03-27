import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useTheme } from '../../theme';

export default function PrivacyScreen() {
  const theme = useTheme();
  return (
    <ScrollView style={{ flex:1, padding: theme.spacing.lg }}>
      <Text style={theme.typography.h2}>Privacy</Text>
      <Text style={{ ...theme.typography.body, marginTop: theme.spacing.sm }}>
        This is a placeholder privacy statement for the Francken app. Replace with the official privacy policy text.
      </Text>
    </ScrollView>
  );
}
