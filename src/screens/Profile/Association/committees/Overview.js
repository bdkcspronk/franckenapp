// Purpose: Committee overview — displays committee tiles and navigation to details.
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useTheme } from '../../../../theme';
import { useNavigation } from '@react-navigation/native';
import committees from '../../../../mocks/committees.json';

export default function CommitteesOverview() {
  const theme = useTheme();
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const numColumns = 2;
  const horizontalPadding = theme.spacing.lg * 2; // left + right
  const columnGap = theme.spacing.md; // spacing between columns
  const tileSize = Math.floor((width - horizontalPadding - columnGap) / numColumns);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.canvas, padding: theme.spacing.lg }}>
      <FlatList
        data={committees}
        keyExtractor={(i) => i.id}
        numColumns={numColumns}
        columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: theme.spacing.md }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('Committee', { id: item.id, name: item.name })}
            style={{ width: tileSize, height: tileSize }}
          >
            <View style={{ backgroundColor: theme.colors.card, padding: theme.spacing.md, borderRadius: 12, alignItems: 'center', justifyContent: 'center', height: '100%', overflow: 'hidden' }}>
              <Text numberOfLines={2} style={{ ...theme.typography.h3, color: theme.colors.textLight, textAlign: 'center' }}>{item.name}</Text>
              <Text numberOfLines={1} style={{ ...theme.typography.body, color: theme.colors.muted, marginTop: theme.spacing.xs, textAlign: 'center' }}>{item.year || ''}</Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: theme.spacing.xl }}
      />
    </View>
  );
}
