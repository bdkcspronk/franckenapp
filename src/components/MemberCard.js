import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../theme';

export default function MemberCard() {
  const theme = useTheme();

  return (
    <View style={{ marginTop: 16 }}>
      <Text style={{ ...theme.typography.h2 }}>Member card</Text>
      <View style={{ height: 120, borderWidth: 1, borderColor: theme.colors.surface, justifyContent: 'center', alignItems: 'center', marginTop: 8 }}>
        <Text style={{ ...theme.typography.body, color: theme.colors.text }}>QR / Member code (placeholder)</Text>
      </View>
    </View>
  );
}
