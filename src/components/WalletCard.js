import React from 'react';
import { View, Text, ActivityIndicator, Button } from 'react-native';
import { useTheme } from '../theme';

export default function WalletCard({ balance, loading, onTopUp, onNavigateToWallet }) {
  const theme = useTheme();

  const formatBalance = (cents) => {
    const v = (typeof cents === 'number' ? cents : 0) / 100;
    try {
      return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(v);
    } catch (e) {
      return `€${v.toFixed(2)}`;
    }
  };

  return (
    <View style={{ marginTop: 16 }}>
      <Text style={{ ...theme.typography.h2, color: theme.colors.accent }}>Wallet</Text>
      {loading ? (
        <ActivityIndicator color={theme.colors.primary} />
      ) : (
        <Text style={{ ...theme.typography.body, color: theme.colors.text }}>Balance: {formatBalance(balance)}</Text>
      )}
      <View style={{ marginTop: 8 }}>
        <Button color={theme.colors.primary} title="Top up" onPress={onNavigateToWallet || onTopUp} />
      </View>
    </View>
  );
}
