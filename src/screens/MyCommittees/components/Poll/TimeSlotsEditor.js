// Purpose: UI for editing time slots for selected poll dates.
import React from 'react';
import { View, Text, TextInput } from 'react-native';
import AppButton from '../../../../components/AppButton';
import { useTheme } from '../../../../theme';

export default function TimeSlotsEditor({ selectedDays = {}, timesMap = {}, addTime, removeTime, setTimePart, copyFirstToAll }) {
  const theme = useTheme();

  const keys = Object.keys(selectedDays).sort();

  return (
    <>
      {keys.map((k, idx) => (
        <View key={k} style={{ paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: theme.colors.muted }}>
          <Text style={{ ...theme.typography.h4 }}>{k} ({new Date(selectedDays[k]).toLocaleString(undefined, { weekday: 'short' })})</Text>

          {(timesMap[k] || []).map((slot, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
              <TextInput style={{ backgroundColor: theme.colors.canvas, padding: theme.spacing.sm, borderRadius: 6, width: 56, marginRight: 6, borderWidth: 1, borderColor: theme.colors.muted, textAlign: 'center' }}
                value={(slot.start || '').split(':')[0]}
                onChangeText={(v) => setTimePart(k, i, 'startHour', v)}
                keyboardType="numeric"
                maxLength={2}
              />
              <Text style={{ marginHorizontal: 2 }}>:</Text>
              <TextInput style={{ backgroundColor: theme.colors.canvas, padding: theme.spacing.sm, borderRadius: 6, width: 56, marginRight: 8, borderWidth: 1, borderColor: theme.colors.muted, textAlign: 'center' }}
                value={(slot.start || '').split(':')[1] || ''}
                onChangeText={(v) => setTimePart(k, i, 'startMin', v)}
                keyboardType="numeric"
                maxLength={2}
              />

              <Text style={{ marginHorizontal: 6 }}>-</Text>

              <TextInput style={{ backgroundColor: theme.colors.canvas, padding: theme.spacing.sm, borderRadius: 6, width: 56, marginRight: 6, borderWidth: 1, borderColor: theme.colors.muted, textAlign: 'center' }}
                value={(slot.end || '').split(':')[0] || ''}
                onChangeText={(v) => setTimePart(k, i, 'endHour', v)}
                keyboardType="numeric"
                maxLength={2}
              />
              <Text style={{ marginHorizontal: 2 }}>:</Text>
              <TextInput style={{ backgroundColor: theme.colors.canvas, padding: theme.spacing.sm, borderRadius: 6, width: 56, marginRight: 8, borderWidth: 1, borderColor: theme.colors.muted, textAlign: 'center' }}
                value={(slot.end || '').split(':')[1] || ''}
                onChangeText={(v) => setTimePart(k, i, 'endMin', v)}
                keyboardType="numeric"
                maxLength={2}
              />

              <AppButton title="Remove" variant="ghost" onPress={() => removeTime(k, i)} />
            </View>
          ))}

          <View style={{ flexDirection: 'row', marginTop: 8, marginBottom: idx === 0 ? theme.spacing.sm : 0 }}>
            <AppButton title="Add time" onPress={() => addTime(k)} variant="tertiary" style={{ flex: 1, marginRight: idx === 0 ? 8 : 0 }} />
            {idx === 0 && <AppButton title="Copy first to all" onPress={copyFirstToAll} style={{ flex: 1 }} />}
          </View>
        </View>
      ))}
    </>
  );
}
