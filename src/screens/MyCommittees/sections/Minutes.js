// Purpose: Manage meeting minutes for a committee (create/edit/delete).
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Alert } from 'react-native';
import AppButton from '../../../components/AppButton';
import { useTheme } from '../../../theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { expandShortCommands } from '../../../utils/shortCommands';
import MeetingListItem from '../components/Agenda/MeetingListItem';
import meetingStorage from '../../../services/meetingStorage';

const storageKey = (committeeId) => `committee:${committeeId}:minutes`;

export default function MinutesSection({ committeeId, canEdit }) {
  const theme = useTheme();
  const [minutes, setMinutes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [agendas, setAgendas] = useState([]);
  const [selectedAgenda, setSelectedAgenda] = useState(null);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    let mounted = true;
    AsyncStorage.getItem(storageKey(committeeId)).then((v) => {
      if (!mounted) return;
      if (v) setMinutes(JSON.parse(v));
    }).catch(() => {});
    // load agendas via meetingStorage (reused)
    meetingStorage.getMeetings(committeeId).then((v) => { if (v && mounted) setAgendas(v); }).catch(() => {});
    return () => (mounted = false);
  }, [committeeId]);

  const save = useCallback(async (next) => { try { await AsyncStorage.setItem(storageKey(committeeId), JSON.stringify(next)); } catch (e) {} }, [committeeId]);

  const handleSave = () => {
    if (!title.trim()) return;
    const processedTitle = expandShortCommands(title.trim());
    const processedContent = expandShortCommands(content.trim());

    if (editingId) {
      const next = minutes.map((m) => (m.id === editingId ? { ...m, title: processedTitle, content: processedContent, agendaId: selectedAgenda } : m));
      setMinutes(next); setTitle(''); setContent(''); setSelectedAgenda(null); setEditingId(null); save(next);
      return;
    }

    const next = [{ id: Date.now().toString(), title: processedTitle, content: processedContent, agendaId: selectedAgenda, createdAt: new Date().toISOString() }, ...minutes];
    setMinutes(next); setTitle(''); setContent(''); setSelectedAgenda(null); save(next);
  };

  const beginEdit = useCallback((item) => {
    setTitle(item.title || '');
    setContent(item.content || item.description || '');
    setSelectedAgenda(item.agendaId || null);
    setEditingId(item.id);
  }, []);

  const deleteItem = useCallback((id) => {
    Alert.alert('Delete minutes', 'Are you sure you want to delete these minutes?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        const next = minutes.filter((m) => m.id !== id);
        setMinutes(next);
        if (editingId === id) { setEditingId(null); setTitle(''); setContent(''); }
        await save(next);
      } }
    ]);
  }, [minutes, editingId, save]);

  return (
    <View>
      {canEdit && (
        <View style={{ marginBottom: theme.spacing.md }}>
          <TextInput placeholder="Minutes title" value={title} onChangeText={setTitle} style={{ backgroundColor: theme.colors.canvas, padding: theme.spacing.sm, borderRadius: 6, marginBottom: theme.spacing.xs, borderWidth: 1, borderColor: theme.colors.muted }} />
          <TextInput placeholder="Content" value={content} onChangeText={setContent} multiline numberOfLines={6} textAlignVertical="top" style={{ backgroundColor: theme.colors.canvas, padding: theme.spacing.sm, borderRadius: 6, marginBottom: theme.spacing.xs, minHeight: 120, borderWidth: 1, borderColor: theme.colors.muted }} />
          <Text style={{ ...theme.typography.label, marginBottom: theme.spacing.xs }}>Link to agenda (optional)</Text>
          {agendas.map((a) => (
            <TouchableOpacity key={a.id} onPress={() => setSelectedAgenda(a.id)} style={{ padding: theme.spacing.xs, backgroundColor: selectedAgenda === a.id ? theme.colors.activate : theme.colors.card, borderRadius: 6, marginBottom: theme.spacing.xs }}>
              <Text style={{ color: selectedAgenda === a.id ? theme.colors.textLight : theme.colors.text }}>{a.title}</Text>
            </TouchableOpacity>
          ))}
          {editingId ? (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <AppButton title="Save Changes" onPress={handleSave} style={{ flex: 1, marginRight: 8 }} />
              <AppButton title="Cancel" variant="ghost" onPress={() => { setEditingId(null); setTitle(''); setContent(''); setSelectedAgenda(null); }} style={{ flex: 1, marginLeft: 8 }} />
            </View>
          ) : (
            <AppButton title="Create Minutes" onPress={handleSave} />
          )}
        </View>
      )}

      <FlatList
        data={minutes}
        keyExtractor={(m) => m.id}
        ListEmptyComponent={() => (
          <View style={{ padding: theme.spacing.md }}>
            <Text style={{ ...theme.typography.body, color: theme.colors.muted }}>No items yet.</Text>
          </View>
        )}
        renderItem={({ item }) => {
          const mapped = { ...item, description: item.content, date: item.createdAt };
          return <MeetingListItem item={mapped} membersList={[]} canEdit={canEdit} beginEdit={beginEdit} deleteItem={deleteItem} />;
        }}
      />
    </View>
  );
}
