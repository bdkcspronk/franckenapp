import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTheme } from '../theme';
import { useNavigation } from '@react-navigation/native';
import { fetchEvents } from '../services/api';

export default function EventsScreen() {
  const navigation = useNavigation();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const ev = await fetchEvents();
        if (mounted) setEvents(ev || []);
      } catch (e) {
        console.warn('Failed to load events', e);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => (mounted = false);
  }, []);

  const theme = useTheme();

  const [upcoming, setUpcoming] = useState([]);
  const [past, setPast] = useState([]);

  useEffect(() => {
    if (loading) return;
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const parsed = (events || []).map((e) => ({ ...e, _date: new Date(e.date) }));
    const up = parsed.filter((e) => e._date >= todayStart).sort((a, b) => a._date - b._date);
    const pastList = parsed.filter((e) => e._date < todayStart).sort((a, b) => b._date - a._date).slice(0, 5);
    setUpcoming(up);
    setPast(pastList);
  }, [loading, events]);

  if (loading) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator color={theme.colors.primary} />
    </View>
  );

  function renderEventItem(item, index) {
    const bg = index % 2 === 0 ? theme.colors.surfaceAlt1 : theme.colors.surfaceAlt2;
    return (
      <TouchableOpacity
        onPress={() => {
          const passedEvent = { ...item };
          // remove non-serializable Date instance before passing via navigation
          if (passedEvent && passedEvent._date instanceof Date) delete passedEvent._date;
          const targetNav = navigation.getParent ? navigation.getParent() : navigation;
          targetNav.navigate('Event Details', { event: passedEvent });
        }}
      >
        <View style={{ paddingVertical: theme.spacing.md, paddingHorizontal: theme.spacing.md, justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: theme.colors.background, backgroundColor: bg, marginBottom: theme.spacing.sm, borderRadius: 8 }}>
          <Text style={{ ...theme.typography.h2, color: theme.colors.textLight }}>{item.title}</Text>
          <Text style={{ ...theme.typography.body, color: theme.colors.textLight }}>{item.date}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={{ flex: 1, padding: theme.spacing.xl }}>
      <FlatList
        data={upcoming}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => renderEventItem(item, index)}
        contentContainerStyle={{ paddingBottom: theme.spacing.sm }}
      />

      <Text style={{ ...theme.typography.h2, marginTop: theme.spacing.md, marginBottom: theme.spacing.sm }}>Past events</Text>
      <FlatList
        data={past}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ padding: theme.spacing.sm }}>
            <Text style={{ ...theme.typography.h2, color: theme.colors.text }}>{item.title}</Text>
            <Text style={{ ...theme.typography.body, color: theme.colors.muted }}>{item.date}</Text>
          </View>
        )}
      />
    </View>
  );
}
