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
      <ActivityIndicator color={theme.colors.primary} />
    </View>
  );

  return (
    <View style={{ flex: 1, padding: theme.spacing.xl }}>
      <FlatList
        data={news}
        keyExtractor={(i) => i.id}
        renderItem={({ item, index }) => {
          const bg = index % 2 === 0 ? theme.colors.surfaceAlt1 : theme.colors.surfaceAlt2;
          return (
            <View style={{ paddingVertical: theme.spacing.md, paddingHorizontal: theme.spacing.md, justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: theme.colors.background, backgroundColor: bg, marginBottom: theme.spacing.sm, borderRadius: 8 }}>
              <Text style={{ ...theme.typography.h2, color: theme.colors.textLight }}>{item.title}</Text>
              <Text style={{ ...theme.typography.body, color: theme.colors.textLight }}>{item.body}</Text>
            </View>
          );
        }}
        contentContainerStyle={{ paddingBottom: theme.spacing.sm }}
      />
    </View>
  );
}
