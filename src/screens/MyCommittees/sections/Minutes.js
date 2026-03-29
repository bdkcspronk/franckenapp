import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { expandShortCommands } from '../../../utils/shortCommands';

const storageKey = (committeeId) => `committee:${committeeId}:minutes`;

export default function MinutesSection({ committeeId, canEdit }) {
  const theme = useTheme();
  const [minutes, setMinutes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [agendas, setAgendas] = useState([]);
  const [selectedAgenda, setSelectedAgenda] = useState(null);

  useEffect(() => {
    let mounted = true;
    AsyncStorage.getItem(storageKey(committeeId)).then((v) => {
      if (!mounted) return;
      if (v) setMinutes(JSON.parse(v));
    }).catch(() => {});
    // also load agendas to allow linking
    AsyncStorage.getItem(`committee:${committeeId}:agenda`).then((v) => { if (v && mounted) setAgendas(JSON.parse(v)); }).catch(() => {});
    return () => (mounted = false);
  }, [committeeId]);

  const save = async (next) => { try { await AsyncStorage.setItem(storageKey(committeeId), JSON.stringify(next)); } catch (e) {} };

  const add = () => {
    if (!title.trim()) return;
    const processedTitle = expandShortCommands(title.trim());
    const processedContent = expandShortCommands(content.trim());
    const next = [{ id: Date.now().toString(), title: processedTitle, content: processedContent, agendaId: selectedAgenda, createdAt: new Date().toISOString() }, ...minutes];
    setMinutes(next); setTitle(''); setContent(''); setSelectedAgenda(null); save(next);
  };

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
          <Button title="Create Minutes" onPress={add} />
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
        renderItem={({ item }) => (
        <View style={{ padding: theme.spacing.md, marginBottom: theme.spacing.sm, backgroundColor: theme.colors.card, borderRadius: 8 }}>
          <Text style={{ ...theme.typography.h3 }}>{item.title}</Text>
          <Text style={{ ...theme.typography.body, color: theme.colors.muted }}>{item.content}</Text>
        </View>
      )} />
    </View>
  );
}
