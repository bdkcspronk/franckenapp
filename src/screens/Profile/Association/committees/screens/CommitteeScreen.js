import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useTheme } from '../../../../../theme';
import { useRoute } from '@react-navigation/native';
import committees from './data';

export default function CommitteeScreen() {
  const theme = useTheme();
  const route = useRoute();
  const { id } = route.params || {};

  const committee = committees.find((c) => c.id === id);

  if (!committee) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.canvas }}>
        <Text style={theme.typography.h2}>Committee not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.canvas, padding: theme.spacing.lg }}>
      <Text style={{ ...theme.typography.h2, marginBottom: theme.spacing.sm }}>{committee.name}</Text>
      <Text style={{ ...theme.typography.body, color: theme.colors.muted, marginBottom: theme.spacing.md }}>{committee.description}</Text>

      <Text style={{ ...theme.typography.h3, marginBottom: theme.spacing.sm }}>Members</Text>
      {committee.members.length === 0 ? (
        <Text style={{ ...theme.typography.body, color: theme.colors.muted }}>No public member list.</Text>
      ) : (
        committee.members.map((m) => (
          <View key={m.id} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: theme.spacing.xs }}>
            <Text style={{ ...theme.typography.body, color: theme.colors.text }}>{m.name}</Text>
            <Text style={{ ...theme.typography.body, color: theme.colors.muted }}>{m.role}</Text>
          </View>
        ))
      )}

      <Text style={{ ...theme.typography.label, color: theme.colors.muted, marginTop: theme.spacing.md }}>Note: membership management is restricted to the board and will be added later.</Text>
    </ScrollView>
  );
}
