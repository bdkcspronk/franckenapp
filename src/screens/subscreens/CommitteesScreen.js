import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../theme';

// Placeholder data; replace with real API call later
const sample = [
  { id: 'c1', name: 'Activity Committee', year: '2023/2024' },
  { id: 'c2', name: 'Education Committee', year: '2022/2023' },
];

export default function CommitteesScreen() {
  const { user } = useAuth();
  const theme = useTheme();

  if (!user) return (
    <View style={{ flex:1, padding: theme.spacing.lg }}>
      <Text style={theme.typography.body}>Please log in to see your committees.</Text>
    </View>
  );

  return (
    <View style={{ flex:1, padding: theme.spacing.lg }}>
      <Text style={theme.typography.h2}>My Committees</Text>
      <FlatList
        data={sample}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View style={{ padding: theme.spacing.sm }}>
            <Text style={theme.typography.h2}>{item.name}</Text>
            <Text style={theme.typography.body}>{item.year}</Text>
          </View>
        )}
      />
    </View>
  );
}
