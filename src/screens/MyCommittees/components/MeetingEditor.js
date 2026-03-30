import React from 'react';
import { View, Text, TextInput, FlatList, Switch } from 'react-native';
import { useTheme } from '../../../theme';
import AppButton from '../../../components/AppButton';

export default function MeetingEditor({ controller, canEdit }) {
  const theme = useTheme();
  if (!controller) return null;

  const {
    title, setTitle,
    desc, setDesc,
    dateText, setDateText,
    location, setLocation,
    membersList,
    presentMap, setPresentMap,
    previewVisible, setPreviewVisible,
    saveItem,
    editingId,
    exportPdf,
    exportTex,
    setKatexInput,
    katexInput,
  } = controller;

  return (
    <>
      {canEdit && (
        <View style={{ marginBottom: theme.spacing.md, marginHorizontal: theme.spacing.sm }}>
          <TextInput placeholder="Agenda title" value={title} onChangeText={setTitle} style={{ backgroundColor: theme.colors.canvas, padding: theme.spacing.sm, borderRadius: 6, marginBottom: theme.spacing.xs, borderWidth: 1, borderColor: theme.colors.muted }} />
          <TextInput
            placeholder="Agenda points"
            value={desc}
            onChangeText={setDesc}
            multiline
            numberOfLines={12}
            textAlignVertical="top"
            style={{ backgroundColor: theme.colors.canvas, padding: theme.spacing.sm, borderRadius: 6, marginBottom: theme.spacing.xs, minHeight: 200, borderWidth: 1, borderColor: theme.colors.muted }}
          />

          <TextInput placeholder="Date (YYYY-MM-DD)" value={dateText} onChangeText={setDateText} style={{ backgroundColor: theme.colors.canvas, padding: theme.spacing.sm, borderRadius: 6, marginBottom: theme.spacing.xs, borderWidth: 1, borderColor: theme.colors.muted }} />
          <TextInput placeholder="Location" value={location} onChangeText={setLocation} style={{ backgroundColor: theme.colors.canvas, padding: theme.spacing.sm, borderRadius: 6, marginBottom: theme.spacing.xs, borderWidth: 1, borderColor: theme.colors.muted }} />

          <Text style={{ ...theme.typography.label, marginTop: theme.spacing.md, marginBottom: theme.spacing.xs }}>Attendees</Text>
          <View style={{ maxHeight: 160, marginBottom: theme.spacing.xs }}>
            <FlatList
              data={membersList}
              keyExtractor={(m) => m.id}
              numColumns={2}
              columnWrapperStyle={{ justifyContent: 'space-between' }}
              renderItem={({ item }) => (
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 8 }}>
                  <Text style={{ ...theme.typography.body }}>{item.name}</Text>
                  <Switch value={!!presentMap[item.id]} onValueChange={(v) => setPresentMap((pm) => ({ ...pm, [item.id]: v }))} />
                </View>
              )}
            />
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: theme.spacing.sm }}>
            <AppButton title={previewVisible ? 'Close Preview' : 'Preview'} variant={previewVisible ? 'secondary' : 'primary'} onPress={() => setPreviewVisible((v) => !v)} style={{ flex: 1, marginRight: 8 }} />
            <AppButton title="Export PDF" variant="tertiary" onPress={exportPdf} style={{ flex: 1, marginRight: 8 }} />
            <AppButton title="Export .tex" variant="tertiary" onPress={exportTex} style={{ flex: 1 }} />
          </View>

          {editingId ? (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <AppButton title="Save Changes" onPress={saveItem} style={{ flex: 1, marginRight: 8 }} />
              <AppButton title="Cancel" variant="ghost" onPress={() => { controller.setEditingId(null); controller.setTitle(''); controller.setDesc(''); }} style={{ flex: 1, marginLeft: 8 }} />
            </View>
          ) : (
            <AppButton title="Save Agenda" onPress={saveItem} />
          )}
        </View>
      )}
    </>
  );
}
