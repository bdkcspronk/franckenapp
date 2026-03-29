// Purpose: Component that lists a member's signups and allows cancellations.
import React from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { useTheme } from '../theme';
import AppButton from './AppButton';

export default function ProfileSignups({ signups, loading, onCancel }) {
  const theme = useTheme();

  return (
    <View style={{ marginTop: 16, flex: 1 }}>
      <Text style={{ ...theme.typography.h2 }}>My signups</Text>
      {loading ? (
        <ActivityIndicator color={theme.colors.activate} />
      ) : (
        <FlatList
          data={signups}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => (
            <View style={{ paddingVertical: 8, borderBottomWidth: 1, paddingHorizontal: 8 }}>
              <Text style={{ ...theme.typography.h2, color: theme.colors.text }}>{item.event.title}</Text>
              <Text style={{ ...theme.typography.body, color: theme.colors.muted }}>{item.event.date}</Text>
              <View style={{ marginTop: 8 }}>
                <AppButton title="Cancel" variant="deactivate" onPress={() => onCancel && onCancel(item)} />
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}
