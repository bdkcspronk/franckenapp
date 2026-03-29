// Purpose: Committee homepage for members — basic placeholder until committee home content is created.
import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme';
import { useRoute } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';

import AgendaSection from './sections/Agenda';
import MeetingsSection from './sections/Meetings';
import BudgetSection from './sections/Budget';
import MinutesSection from './sections/Minutes';

export default function CommitteeHome() {
  const theme = useTheme();
  const route = useRoute();
  const { user } = useAuth();
  const { id, name } = route.params || {};

  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    let found = false;
    try {
      const committees = require('../../mocks/committees.json');
      const committee = (committees || []).find((c) => c.id === id);
      const memberId = user?.uid || user?.email || null;
      if (committee && memberId) {
        found = (committee.members || []).map(String).includes(String(memberId));
      }
    } catch (e) {
      // ignore
    }
    setIsMember(Boolean(found));
  }, [id, user]);

  const [tab, setTab] = useState('Overview');

  const roleFlags = useMemo(() => {
    let isChair = false; let isTreasurer = false; let isSecretary = false;
    try {
      const committees = require('../../mocks/committees.json');
      const committee = (committees || []).find((c) => c.id === id) || {};
      const roles = committee.roles || {};
      const memberId = user?.uid || user?.email || null;
      if (memberId) {
        isChair = String(roles.chair) === String(memberId);
        isTreasurer = String(roles.treasurer) === String(memberId);
        isSecretary = String(roles.secretary) === String(memberId);
      }
    } catch (e) {}
    return { isChair, isTreasurer, isSecretary };
  }, [id, user]);

  if (!isMember) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: theme.spacing.lg, backgroundColor: theme.colors.canvas }}>
        <Text style={{ ...theme.typography.h2, marginBottom: theme.spacing.md }}>Not authorized</Text>
        <Text style={{ ...theme.typography.body, color: theme.colors.muted }}>You are not a member of this committee.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.canvas }}>
      <View style={{ flexDirection: 'row', padding: theme.spacing.sm, backgroundColor: theme.colors.canvas, justifyContent: 'space-around' }}>
        {['Overview','Agenda','Meetings','Budget','Minutes'].map((t) => (
          <TouchableOpacity key={t} onPress={() => setTab(t)} style={{ paddingVertical: theme.spacing.xs }}>
            <Text style={{ color: tab === t ? theme.colors.activate : theme.colors.muted, ...theme.typography.label }}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ flex: 1, padding: theme.spacing.lg }}>
        {tab === 'Overview' && (
          <Text style={{ ...theme.typography.body, color: theme.colors.muted }}>Overview — use the tabs to manage agendas, meetings, budgets and minutes.</Text>
        )}
        {tab === 'Agenda' && <AgendaSection committeeId={id} canEdit={roleFlags.isChair} />}
        {tab === 'Meetings' && <MeetingsSection committeeId={id} canEdit={roleFlags.isChair} membersRole={roleFlags} />}
        {tab === 'Budget' && <BudgetSection committeeId={id} canEdit={roleFlags.isTreasurer} />}
        {tab === 'Minutes' && <MinutesSection committeeId={id} canEdit={roleFlags.isSecretary} />}
      </View>
    </View>
  );
}
