import React from 'react';
import { View, Text, FlatList, Button, ActivityIndicator } from 'react-native';
import { useTheme } from '../theme';

export default function ProfileSignups({ signups, loading, onCancel }) {
  const theme = useTheme();

  return (
    <View style={{ marginTop: 16, flex: 1 }}>
      <Text style={{ ...theme.typography.h2 }}>Your signups</Text>
      {loading ? (
        <ActivityIndicator color={theme.colors.primary} />
      ) : (
        <FlatList
          data={signups}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => (
            <View style={{ paddingVertical: 8, borderBottomWidth: 1, paddingHorizontal: 8 }}>
              <Text style={{ ...theme.typography.h2, color: theme.colors.text }}>{item.event.title}</Text>
              <Text style={{ ...theme.typography.body, color: theme.colors.muted }}>{item.event.date}</Text>
              <View style={{ marginTop: 8 }}>
                <Button color={theme.colors.danger} title="Cancel" onPress={() => onCancel && onCancel(item)} />
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}
