import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { useTheme } from '../theme';

const board = [
  { id: 'b1', role: 'President', name: 'Alice Example' },
  { id: 'b2', role: 'Secretary', name: 'Bob Example' },
  { id: 'b3', role: 'Treasurer', name: 'Carol Example' },
];

export default function BoardScreen() {
  const theme = useTheme();
  return (
    <View style={{ flex:1, padding:16 }}>
      <Text style={theme.typography.h2}>Board</Text>
      <FlatList
        data={board}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View style={{ padding: 12 }}>
            <Text style={theme.typography.h2}>{item.role}</Text>
            <Text style={theme.typography.body}>{item.name}</Text>
          </View>
        )}
      />
    </View>
  );
}
