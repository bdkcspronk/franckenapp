// Purpose: UI card showing wallet balance and quick wallet actions.
import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useTheme } from '../theme';
import AppButton from './AppButton';

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
        <ActivityIndicator color={theme.colors.activate} />
      ) : (
        <Text style={{ ...theme.typography.body, color: theme.colors.text }}>Balance: {formatBalance(balance)}</Text>
      )}
      <View style={{ marginTop: 8 }}>
        <AppButton title="Top up" variant="activate" onPress={onNavigateToWallet || onTopUp} />
      </View>
    </View>
  );
}
