import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, Button, FlatList, Alert, Switch } from 'react-native';
import { useTheme } from '../../../theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { expandShortCommands } from '../../../utils/shortCommands';
import { WebView } from 'react-native-webview';
import { makeHtml, exportPdfFromText, exportPngFromRef } from '../../../../scripts/katexUtils';

const storageKey = (committeeId) => `committee:${committeeId}:agenda`;

// AgendaSection component
// Props:
// - committeeId: id of the committee this agenda belongs to
// - canEdit: whether current user (chair) can edit/create agendas
export default function AgendaSection({ committeeId, canEdit }) {
  const theme = useTheme();
  // Saved agenda items (loaded/saved from AsyncStorage)
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  // Editor fields
  const [dateText, setDateText] = useState(new Date().toISOString().slice(0,10)); // YYYY-MM-DD
  const [location, setLocation] = useState('');
  // Committee members and attendance map
  const [membersList, setMembersList] = useState([]); // {id,name}
  const [presentMap, setPresentMap] = useState({});
  // KaTeX input for preview/export
  const [katexInput, setKatexInput] = useState('');
  // Preview state and webview ref
  const [previewVisible, setPreviewVisible] = useState(false);
  const webviewRef = useRef(null);
  // editingId != null => editing existing item
  const [editingId, setEditingId] = useState(null);

  // makeHtml is provided by scripts/katexUtils; keep local wrapper if needed

  const handleExportPdf = async () => {
    try {
      await exportPdfFromText(katexInput);
    } catch (e) {
      Alert.alert('Export failed', String(e));
    }
  };

  const handleExportPng = async () => {
    try {
      if (!webviewRef.current) {
        Alert.alert('Preview required', 'Open preview first to capture PNG.');
        return;
      }
      await exportPngFromRef(webviewRef);
    } catch (e) {
      Alert.alert('Export failed', String(e));
    }
  };

  // Load saved agendas for this committee from AsyncStorage when component mounts / committeeId changes
  useEffect(() => {
    let mounted = true;
    AsyncStorage.getItem(storageKey(committeeId)).then((v) => {
      if (!mounted) return;
      if (v) setItems(JSON.parse(v));
    }).catch(() => {});
    return () => (mounted = false);
  }, [committeeId]);

  // Load committee members (from mocks) to show attendance checkboxes and initialize presentMap
  useEffect(() => {
    try {
      const committees = require('../../../mocks/committees.json');
      const membersMock = require('../../../mocks/members.json');
      const committee = (committees || []).find((c) => c.id === committeeId) || {};
      const memberIds = (committee.members || []).map(String);
      const members = (membersMock || []).filter((m) => memberIds.includes(String(m.id))).map((m) => ({ id: String(m.id), name: m.displayName || m.name || m.email || String(m.id) }));
      setMembersList(members);
      // initialize presentMap with true for each member (present by default)
      const pm = {};
      members.forEach((m) => { pm[m.id] = true; });
      setPresentMap(pm);
    } catch (e) {
      console.warn('Failed to load members for agenda attendees', e);
    }
  }, [committeeId]);

  // Persist agendas to AsyncStorage
  const save = async (next) => {
    try {
      await AsyncStorage.setItem(storageKey(committeeId), JSON.stringify(next));
    } catch (e) {}
  };

  // Create or update an agenda entry using editor fields and current presentMap
  const saveItem = () => {
    if (!title.trim()) return;
    const processedTitle = expandShortCommands(title.trim());
    const processedDesc = expandShortCommands(desc.trim());

    if (editingId) {
      const next = items.map((i) => (i.id === editingId ? { ...i, title: processedTitle, description: processedDesc, date: dateText, location, present: Object.keys(presentMap).filter((k) => presentMap[k]) } : i));
      setItems(next);
      setTitle(''); setDesc(''); setEditingId(null);
      save(next);
      return;
    }

    const newItem = { id: Date.now().toString(), title: processedTitle, description: processedDesc, createdAt: new Date().toISOString(), date: dateText, location, present: Object.keys(presentMap).filter((k) => presentMap[k]) };
    const next = [newItem, ...items];
    setItems(next);
    setTitle(''); setDesc('');
    save(next);
  };

  // Start editing: prefill editor with the selected agenda's data
  const beginEdit = (item) => {
    setTitle(item.title || '');
    setDesc(item.description || '');
    setEditingId(item.id);
    setDateText(item.date || new Date().toISOString().slice(0,10));
    setLocation(item.location || '');
    // populate presentMap from item.present
    const pm = {};
    membersList.forEach((m) => { pm[m.id] = (item.present || []).includes(m.id); });
    setPresentMap(pm);
  };

  // Delete an agenda with confirmation
  const deleteItem = (id) => {
    Alert.alert('Delete agenda', 'Are you sure you want to delete this agenda?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        const next = items.filter((i) => i.id !== id);
        setItems(next);
        if (editingId === id) { setEditingId(null); setTitle(''); setDesc(''); }
        await save(next);
      } }
    ]);
  };

  return (
    <View>
      {/* Root */}
      {/* Editor area (visible only when `canEdit` is true - typically the chair) */}
      {canEdit && (
        <View style={{ marginBottom: theme.spacing.md }}>
          {/* Editor */}
          <TextInput placeholder="Agenda title" value={title} onChangeText={setTitle} style={{ backgroundColor: theme.colors.canvas, padding: theme.spacing.sm, borderRadius: 6, marginBottom: theme.spacing.xs, borderWidth: 1, borderColor: theme.colors.muted }} />
          <TextInput
            placeholder="Agenda points"
            value={desc}
            onChangeText={setDesc}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            style={{ backgroundColor: theme.colors.canvas, padding: theme.spacing.sm, borderRadius: 6, marginBottom: theme.spacing.xs, minHeight: 120, borderWidth: 1, borderColor: theme.colors.muted }}
          />

          <TextInput placeholder="Date (YYYY-MM-DD)" value={dateText} onChangeText={setDateText} style={{ backgroundColor: theme.colors.canvas, padding: theme.spacing.sm, borderRadius: 6, marginBottom: theme.spacing.xs, borderWidth: 1, borderColor: theme.colors.muted }} />
          <TextInput placeholder="Location" value={location} onChangeText={setLocation} style={{ backgroundColor: theme.colors.canvas, padding: theme.spacing.sm, borderRadius: 6, marginBottom: theme.spacing.xs, borderWidth: 1, borderColor: theme.colors.muted }} />

          <Text style={{ ...theme.typography.label, marginTop: theme.spacing.md, marginBottom: theme.spacing.xs }}>Attendees</Text>
          {/* List of committee members with switches to mark present/absent */}
          <View style={{ maxHeight: 160, marginBottom: theme.spacing.xs }}>
            {/* Attendees */}
            <FlatList
              data={membersList}
              keyExtractor={(m) => m.id}
              contentContainerStyle={{ paddingVertical: 0 }}
              renderItem={({ item }) => (
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text style={{ ...theme.typography.body, marginVertical: 0 }}>{item.name}</Text>
                  <Switch value={!!presentMap[item.id]} onValueChange={(v) => setPresentMap((pm) => ({ ...pm, [item.id]: v }))} />
                </View>
              )}
            />
          </View>

          <TextInput placeholder="KaTeX (LaTeX) input for export/preview" value={katexInput} onChangeText={setKatexInput} multiline numberOfLines={4} textAlignVertical="top" style={{ backgroundColor: theme.colors.canvas, padding: theme.spacing.sm, borderRadius: 6, marginBottom: theme.spacing.xs, minHeight: 80, borderWidth: 1, borderColor: theme.colors.muted }} />

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: theme.spacing.sm }}>
            <Button title={previewVisible ? 'Close Preview' : 'Preview'} onPress={() => setPreviewVisible(!previewVisible)} />
            <Button title="Export PDF" onPress={handleExportPdf} />
            <Button title="Export PNG" onPress={handleExportPng} />
          </View>

          {editingId ? (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Button title="Save Changes" onPress={saveItem} />
              <Button title="Cancel" onPress={() => { setEditingId(null); setTitle(''); setDesc(''); }} />
            </View>
          ) : (
            <Button title="Create Agenda" onPress={saveItem} />
          )}
        </View>
      )}

      {/* Preview area: KaTeX-rendered HTML shown inside a WebView */}
      {previewVisible && (
        <View style={{ height: 300, marginBottom: theme.spacing.md, borderRadius: 8, overflow: 'hidden' }} collapsable={false}>
          {/* Preview */}
          <WebView
            originWhitelist={["*"]}
            source={{ html: makeHtml(katexInput) }}
            style={{ flex: 1 }}
            ref={webviewRef}
          />
        </View>
      )}

      {/* Saved agendas list (shows created agendas, date/location, attendees, and edit/delete) */}
      {/* Saved List */}
      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        ListEmptyComponent={() => (
          <View style={{ padding: theme.spacing.md }}>
            <Text style={{ ...theme.typography.body, color: theme.colors.muted }}>No items yet.</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <View style={{ padding: theme.spacing.md, marginBottom: theme.spacing.sm, backgroundColor: theme.colors.card, borderRadius: 8 }}>
            {/* Header */}
            <Text style={{ ...theme.typography.h3 }}>{item.title}</Text>
            {item.date || item.location ? (
              <Text style={{ ...theme.typography.body, color: theme.colors.muted }}>{item.date ? item.date : ''}{item.date && item.location ? ' • ' : ''}{item.location ? item.location : ''}</Text>
            ) : null}
            {item.description ? <Text style={{ ...theme.typography.body, color: theme.colors.muted }}>{item.description}</Text> : null}
            {item.present && item.present.length ? (
              <Text style={{ ...theme.typography.body, color: theme.colors.muted, marginTop: theme.spacing.xs }}>Present: {(item.present || []).map((id) => ((membersList.find((mm) => mm.id === id) || {}).name || id)).join(', ')}</Text>
            ) : null}
            {canEdit ? (
              <View style={{ flexDirection: 'row', marginTop: theme.spacing.sm }}>
                <Button title="Edit" onPress={() => beginEdit(item)} />
                <View style={{ width: 8 }} />
                <Button title="Delete" color="#d9534f" onPress={() => deleteItem(item.id)} />
              </View>
            ) : null}
          </View>
        )}
      />
    </View>
  );
}
