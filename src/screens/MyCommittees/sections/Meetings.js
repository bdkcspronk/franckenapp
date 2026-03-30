import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList } from 'react-native';
import AppButton from '../../../components/AppButton';
import { useTheme } from '../../../theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

const storageKey = (committeeId) => `committee:${committeeId}:meetings`;

export default function MeetingsSection({ committeeId, canEdit }) {
  const theme = useTheme();
  const [meetings, setMeetings] = useState([]);
  const [date, setDate] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    let mounted = true;
    AsyncStorage.getItem(storageKey(committeeId)).then((v) => {
      if (!mounted) return;
      if (v) setMeetings(JSON.parse(v));
    }).catch(() => {});
    return () => (mounted = false);
  }, [committeeId]);

  const save = async (next) => {
    try { await AsyncStorage.setItem(storageKey(committeeId), JSON.stringify(next)); } catch (e) {}
  };

  const add = () => {
    if (!date.trim()) return;
    const next = [{ id: Date.now().toString(), date: date.trim(), note: note.trim() }, ...meetings];
    setMeetings(next); setDate(''); setNote(''); save(next);
  };

  return (
    <View>
      {canEdit && (
        <View style={{ marginBottom: theme.spacing.md }}>
          <TextInput placeholder="Date / time" value={date} onChangeText={setDate} style={{ backgroundColor: theme.colors.canvas, padding: theme.spacing.sm, borderRadius: 6, marginBottom: theme.spacing.xs, borderWidth: 1, borderColor: theme.colors.muted }} />
          <TextInput placeholder="Notes (optional)" value={note} onChangeText={setNote} multiline numberOfLines={6} textAlignVertical="top" style={{ backgroundColor: theme.colors.canvas, padding: theme.spacing.sm, borderRadius: 6, marginBottom: theme.spacing.xs, borderWidth: 1, borderColor: theme.colors.muted, minHeight: 120 }} />
          <AppButton title="Schedule Meeting" onPress={add} />
        </View>
      )}

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
          </View>
        )}
      />
    </View>
  );
}
