// Purpose: Show detailed information about a single committee and its members.
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useTheme } from '../../../../theme';
import { useRoute } from '@react-navigation/native';
import committees from '../../../../mocks/committees.json';
import membersMock from '../../../../mocks/members.json';

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
      {(!committee.members || committee.members.length === 0) ? (
        <Text style={{ ...theme.typography.body, color: theme.colors.muted }}>No public member list.</Text>
      ) : (
        (() => {
          // Resolve members: committee.members may be ids or full objects
          const membersList = (committee.members || []).map((m) => {
            if (typeof m === 'string' || typeof m === 'number') {
              const idStr = String(m);
              const mem = (membersMock || []).find((mm) => String(mm.id) === idStr);
              const name = mem ? (mem.displayName || mem.email || idStr) : idStr;
              return { id: idStr, name, role: '' };
            }
            // assume object with id and possibly name/role
            return { id: String(m.id), name: m.name || m.displayName || m.email || String(m.id), role: m.role || '' };
          });

          // Map members by id for quick lookup
          const byId = new Map(membersList.map((mm) => [String(mm.id), mm]));

          // Role ordering
          const roleOrder = ['chair', 'treasurer', 'secretary'];
          const ordered = [];
          const seen = new Set();

          const roles = committee.roles || {};
          for (const r of roleOrder) {
            const id = roles[r];
            if (!id) continue;
            const idStr = String(id);
            let member = byId.get(idStr);
            if (!member) {
              // member not in committee.members list, try to resolve from mocks
              const mem = (membersMock || []).find((mm) => String(mm.id) === idStr);
              const name = mem ? (mem.displayName || mem.email || idStr) : idStr;
              member = { id: idStr, name, role: r.charAt(0).toUpperCase() + r.slice(1) };
            } else {
              member = { ...member, role: r.charAt(0).toUpperCase() + r.slice(1) };
            }
            ordered.push(member);
            seen.add(String(member.id));
          }

          // Add remaining members (sorted by name)
          const others = membersList.filter((m) => !seen.has(String(m.id))).sort((a, b) => (a.name || '').localeCompare(b.name || ''));
          for (const o of others) ordered.push(o);

            return ordered.map((m) => (
            <View key={m.id} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: theme.spacing.xs }}>
              <Text style={{ ...theme.typography.body, color: theme.colors.text }}>{m.name}</Text>
              <Text style={{ ...theme.typography.body, color: theme.colors.muted }}>{m.role || ''}</Text>
            </View>
          ));
        })()
      )}

      <Text style={{ ...theme.typography.label, color: theme.colors.muted, marginTop: theme.spacing.md }}>Note: membership management is restricted to the board and will be added later.</Text>
    </ScrollView>
  );
}
