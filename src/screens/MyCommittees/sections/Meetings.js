// Purpose: Meetings list and meeting-poll creation/editor.
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, Alert } from 'react-native';
import AppButton from '../../../components/AppButton';
import { useTheme } from '../../../theme';
import * as meetingPollStorage from '../../../services/meetingPollStorage';
import * as meetingStorage from '../../../services/meetingStorage';

import MeetingPollEditor from '../components/Poll/MeetingPollEditor';

export default function MeetingsSection({ committeeId, canEdit }) {
  const theme = useTheme();
  const [meetings, setMeetings] = useState([]);
  const [date, setDate] = useState('');
  const [note, setNote] = useState('');

  // Polls
  const [polls, setPolls] = useState([]);
  const [creatingPoll, setCreatingPoll] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const ms = await meetingStorage.getMeetings(committeeId);
        if (!mounted) return;
        setMeetings(ms || []);
      } catch (e) {}
      try {
        const ps = await meetingPollStorage.getPolls(committeeId);
        if (!mounted) return;
        setPolls(ps || []);
      } catch (e) {}
    };
    load();
    return () => (mounted = false);
  }, [committeeId]);

  const add = async () => {
    if (!date.trim()) return;
    const meeting = { id: Date.now().toString(), date: date.trim(), note: note.trim() };
    try {
      const next = await meetingStorage.addMeeting(committeeId, meeting);
      setMeetings(next);
      setDate(''); setNote('');
    } catch (e) {}
  };

  const confirmDelete = (id) => {
    Alert.alert('Delete meeting', 'Are you sure you want to delete this meeting?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try {
          const next = await meetingStorage.deleteMeeting(committeeId, id);
          setMeetings(next);
        } catch (e) {}
      } },
    ]);
  };

  const onSavePoll = async (poll) => {
    const next = [poll, ...polls];
    setPolls(next);
    try { await meetingPollStorage.savePolls(committeeId, next); } catch (e) {}
    setCreatingPoll(false);
  };

  return (
    <View>
      {canEdit && (
        <View style={{ marginBottom: theme.spacing.md }}>
          <View style={{ height: theme.spacing.md }} />
          {creatingPoll ? (
            <MeetingPollEditor onSave={onSavePoll} onCancel={() => setCreatingPoll(false)} />
          ) : (
            <AppButton title="Create Meeting Poll" onPress={() => setCreatingPoll(true)} />
          )}
        </View>
      )}

      {polls && polls.length ? (
        <View style={{ marginBottom: theme.spacing.md }}>
          <Text style={{ ...theme.typography.h2, marginBottom: theme.spacing.xs }}>Meeting polls</Text>
          <FlatList
            data={polls}
            keyExtractor={(p) => p.id}
            renderItem={({ item }) => (
              <View style={{ padding: theme.spacing.md, marginBottom: theme.spacing.sm, backgroundColor: theme.colors.card, borderRadius: 8 }}>
                <Text style={{ ...theme.typography.h3 }}>{item.title}</Text>
                {item.slots && item.slots.length ? (
                  <View style={{ marginTop: theme.spacing.xs }}>
                    {item.slots.map((s, i) => (
                      <Text key={i} style={{ ...theme.typography.body }}>
                        {typeof s === 'string' ? s : `${s.start}${s.end ? ' — ' + s.end : ''}`}
                      </Text>
                    ))}
                  </View>
                ) : null}
              </View>
            )}
          />
        </View>
      ) : null}

      <FlatList
        data={meetings}
        keyExtractor={(m) => m.id}
        ListEmptyComponent={() => (
          <View style={{ padding: theme.spacing.md }}>
            <Text style={{ ...theme.typography.body, color: theme.colors.muted }}>No items yet.</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <View style={{ padding: theme.spacing.md, marginBottom: theme.spacing.sm, backgroundColor: theme.colors.card, borderRadius: 8 }}>
            <Text style={{ ...theme.typography.h3 }}>{item.date}</Text>
            {item.note ? <Text style={{ ...theme.typography.body, color: theme.colors.muted }}>{item.note}</Text> : null}
            {canEdit ? (
              <View style={{ flexDirection: 'row', marginTop: theme.spacing.sm }}>
                <AppButton title="Delete" variant="secondary" onPress={() => confirmDelete(item.id)} style={{ flex: 1 }} />
              </View>
            ) : null}
          </View>
        )}
      />
    </View>
  );
}
