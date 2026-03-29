// Purpose: Combined Feed screen that toggles between News and Events lists.
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  LayoutAnimation,
  Platform,
  UIManager,
  useWindowDimensions,
} from 'react-native';
import { useTheme } from '../../theme';
import { fetchNews } from '../../services/api';
import { fetchEvents } from '../../services/api';
import { useNavigation } from '@react-navigation/native';

export default function FeedScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const { height: windowH } = useWindowDimensions();
  const [active, setActive] = useState(null); // 'news' | 'events' | null
  const [news, setNews] = useState([]);
  const [events, setEvents] = useState([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoadingNews(true);
      try {
        const n = await fetchNews();
        if (mounted) setNews(n || []);
      } catch (e) {
        console.warn(e);
      }
      if (mounted) setLoadingNews(false);
    })();
    (async () => {
      setLoadingEvents(true);
      try {
        const ev = await fetchEvents();
        if (mounted) setEvents(ev || []);
      } catch (e) {
        console.warn(e);
      }
      if (mounted) setLoadingEvents(false);
    })();
    return () => (mounted = false);
  }, []);

  function toggle(section) {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActive((cur) => (cur === section ? null : section));
  }

  function renderHeader() {
    const pill = (label, key) => (
      <TouchableOpacity
        key={key}
        onPress={() => toggle(key)}
        style={{
          flex: 1,
          alignItems: 'center',
          paddingVertical: theme.spacing.md,
          marginHorizontal: theme.spacing.sm,
          backgroundColor: active === key ? theme.colors.surfaceAlt1 : theme.colors.card,
          borderRadius: 12,
        }}
      >
        <Text style={{ color: active === key ? theme.colors.textLight : theme.colors.textLight, ...theme.typography.h3 }}>{label}</Text>
      </TouchableOpacity>
    );

    return (
      <View style={{ flexDirection: 'row', paddingTop: theme.spacing.md, paddingHorizontal: theme.spacing.md }}>
        {pill('News', 'news')}
        {pill('Events', 'events')}
      </View>
    );
  }

  function renderNews() {
    if (loadingNews) return <ActivityIndicator color={theme.colors.activate} />;
    const sorted = [...news].sort((a, b) => {
      const ai = parseInt(a.id, 10), bi = parseInt(b.id, 10);
      if (!Number.isNaN(ai) && !Number.isNaN(bi)) return bi - ai;
      return String(b.id).localeCompare(String(a.id));
    });
    return (
      <FlatList
        data={sorted}
        keyExtractor={(i) => i.id}
        renderItem={({ item, index }) => {
          const bg = index % 2 === 0 ? theme.colors.surfaceAlt1 : theme.colors.surfaceAlt2;
          return (
            <View style={{ padding: theme.spacing.md, marginBottom: theme.spacing.sm, backgroundColor: bg, borderRadius: 8 }}>
              <Text style={{ ...theme.typography.h2, color: theme.colors.textLight }}>{item.title}</Text>
              <Text style={{ ...theme.typography.body, color: theme.colors.textLight }}>{item.body}</Text>
            </View>
          );
        }}
        contentContainerStyle={{ padding: theme.spacing.md }}
      />
    );
  }

  function renderEvents() {
    if (loadingEvents) return <ActivityIndicator color={theme.colors.activate} />;
    const upcomingH = Math.min(500, windowH * 0.6);
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const parsed = (events || []).map((e) => ({ ...e, _date: new Date(e.date) }));
    const upcoming = parsed.filter((e) => e._date >= todayStart).sort((a, b) => a._date - b._date);
    const pastList = parsed.filter((e) => e._date < todayStart).sort((a, b) => b._date - a._date).slice(0, 5);

    return (
      <View style={{ flex: 1 }}>
        <View style={{ height: upcomingH }}>
          <FlatList
            data={upcoming}
            keyExtractor={(i) => i.id}
            renderItem={({ item, index }) => {
              const bg = index % 2 === 0 ? theme.colors.surfaceAlt1 : theme.colors.surfaceAlt2;
              return (
                <TouchableOpacity onPress={() => navigation.navigate('Event Details', { event: { ...item } })}>
                  <View style={{ padding: theme.spacing.md, marginBottom: theme.spacing.sm, backgroundColor: bg, borderRadius: 8 }}>
                    <Text style={{ ...theme.typography.h2, color: theme.colors.textLight }}>{item.title}</Text>
                    <Text style={{ ...theme.typography.body, color: theme.colors.textLight }}>{item.date}</Text>
                  </View>
                </TouchableOpacity>
              );
            }}
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: theme.spacing.md }}
            nestedScrollEnabled={true}
          />
        </View>

        <Text style={{ ...theme.typography.h2, color: theme.colors.muted, paddingHorizontal: theme.spacing.md, marginTop: theme.spacing.md, marginBottom: 0 }}>Past events</Text>
        <View style={{ flex: 1, paddingHorizontal: theme.spacing.xl }}>
          <FlatList
            data={pastList}
            keyExtractor={(i) => i.id}
            renderItem={({ item }) => (
              <View style={{ padding: theme.spacing.sm }}>
                <Text style={{ ...theme.typography.h3, color: theme.colors.text }}>{item.title}</Text>
                <Text style={{ ...theme.typography.body, color: theme.colors.muted }}>{item.date}</Text>
              </View>
            )}
            contentContainerStyle={{ padding: theme.spacing.md }}
            nestedScrollEnabled={true}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.canvas }}>
      {renderHeader()}
      {active === 'news' && renderNews()}
      {active === 'events' && renderEvents()}
      {!active && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ ...theme.typography.body, color: theme.colors.muted }}>Tap "News" or "Events" to expand</Text>
        </View>
      )}
    </View>
  );
}
