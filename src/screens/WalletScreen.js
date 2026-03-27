import React from 'react';
import { View, Text, Button } from 'react-native';
import { useTheme } from '../theme';
import { useAuth } from '../contexts/AuthContext';

export default function WalletScreen() {
  const { user } = useAuth();
  const theme = useTheme();

  if (!user) return null;

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ ...theme.typography.h1, color: theme.colors.accent }}>Wallet</Text>
      <Text style={{ ...theme.typography.body, color: theme.colors.text }}>Balance: €0.00 (placeholder)</Text>
      <Button color={theme.colors.primary} title="Top up" onPress={() => alert('Top-up flow not implemented')} />
    </View>
  );
}
