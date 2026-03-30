import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../../theme';
import AppButton from '../../../components/AppButton';

// Displays saved agendas
export default function MeetingListItem({ item, membersList = [], canEdit, beginEdit, deleteItem }) {
  const theme = useTheme();
  return (
    <View style={{ padding: theme.spacing.md, marginBottom: theme.spacing.sm, backgroundColor: theme.colors.card, borderRadius: 8 }}>
      <Text style={{ ...theme.typography.h3, color: theme.colors.textLight, marginBottom: theme.spacing.xs }}>{item.title}</Text>
      {(item.date || item.location) ? (
        <Text style={{ ...theme.typography.body, color: theme.colors.textLight, marginBottom: theme.spacing.md }}>
          {item.date ? item.date : ''}{item.date && item.location ? ' • ' : ''}{item.location ? item.location : ''}
        </Text>
      ) : null}
      {item.description ? <Text style={{ ...theme.typography.body, color: theme.colors.textLight, marginVertical: theme.spacing.md }}>{item.description}</Text> : null}
      {item.present && item.present.length ? (
        <Text style={{ ...theme.typography.body, color: theme.colors.muted, marginTop: theme.spacing.xs }}>
          Attendees: {(item.present || []).map((id) => {
            const mm = membersList.find((m) => m.id === id) || {};
            const name = mm.name || id;
            const roles = mm.roles || [];
            if (!roles.length) return name;
            const roleAbbrev = { chair: 'ch.', treasurer: 'tr.', secretary: 'sec.' };
            const abbrs = roles.map((r) => roleAbbrev[r] || (r.length <= 4 ? r + '.' : r.slice(0, 3) + '.'));
            return `${name} (${abbrs.join(', ')})`;
          }).join(', ')}
        </Text>
      ) : null}
      {canEdit ? (
        <View style={{ flexDirection: 'row', marginTop: theme.spacing.sm }}>
          <AppButton title="Edit" variant="tertiary" onPress={() => beginEdit(item)} style={{ flex: 1 }} />
          <View style={{ width: 8 }} />
          <AppButton title="Delete" variant="secondary" onPress={() => deleteItem(item.id)} style={{ flex: 1 }} />
        </View>
      ) : null}
    </View>
  );
}
