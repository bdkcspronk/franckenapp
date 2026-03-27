import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { fetchNews } from '../services/api';
import { useTheme } from '../theme';

export default function NewsScreen() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const n = await fetchNews();
        if (mounted) setNews(n || []);
      } catch (e) {
        console.warn('Failed to load news', e);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => (mounted = false);
  }, []);
  if (loading) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator color={theme.colors.activate} />
    </View>
  );

  const sorted = [...news].sort((a, b) => {
    const ai = parseInt(a.id, 10);
    const bi = parseInt(b.id, 10);
    const aIsNum = !Number.isNaN(ai);
    const bIsNum = !Number.isNaN(bi);
    if (aIsNum && bIsNum) return bi - ai; // numeric descending
    return String(b.id).localeCompare(String(a.id));
  });

  return (
    <View style={{ flex: 1, padding: theme.spacing.xl }}>
      <FlatList
        data={sorted}
        keyExtractor={(i) => i.id}
        renderItem={({ item, index }) => {
          const bg = index % 2 === 0 ? theme.colors.surfaceAlt1 : theme.colors.surfaceAlt2;
          return (
            <View style={{ paddingVertical: theme.spacing.md, paddingHorizontal: theme.spacing.md, justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: theme.colors.background, backgroundColor: bg, marginBottom: theme.spacing.sm, borderRadius: 8 }}>
              <Text style={{ ...theme.typography.h2, color: theme.colors.textLight, padding: theme.spacing.md }}>{item.title}</Text>
              <Text style={{ ...theme.typography.body, color: theme.colors.textLight, padding: theme.spacing.md }}>{item.body}</Text>
            </View>
          );
        }}
        contentContainerStyle={{ paddingBottom: theme.spacing.sm }}
      />
    </View>
  );
}
