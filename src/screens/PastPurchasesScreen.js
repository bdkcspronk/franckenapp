import React from 'react';
import { View, Text } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../theme';

export default function PastPurchasesScreen() {
  const { user } = useAuth();
  const theme = useTheme();

  if (!user) return (
    <View style={{ flex:1, padding:16 }}>
      <Text style={theme.typography.body}>Please log in to view purchases.</Text>
    </View>
  );

  return (
    <View style={{ flex:1, padding:16 }}>
      <Text style={theme.typography.h2}>Past Purchases</Text>
      <Text style={theme.typography.body}>No purchases yet.</Text>
    </View>
  );
}
