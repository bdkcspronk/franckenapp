// Purpose: Committee budget items editor and listing.
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList } from 'react-native';
import AppButton from '../../../components/AppButton';
import { useTheme } from '../../../theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

const storageKey = (committeeId) => `committee:${committeeId}:budget`;

export default function BudgetSection({ committeeId, canEdit }) {
  const theme = useTheme();
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    let mounted = true;
    AsyncStorage.getItem(storageKey(committeeId)).then((v) => {
      if (!mounted) return;
      if (v) setItems(JSON.parse(v));
    }).catch(() => {});
    return () => (mounted = false);
  }, [committeeId]);

  const save = async (next) => {
    try { await AsyncStorage.setItem(storageKey(committeeId), JSON.stringify(next)); } catch (e) {}
  };

  const add = () => {
    if (!title.trim()) return;
    const next = [{ id: Date.now().toString(), title: title.trim(), amount: parseFloat(amount) || 0 }, ...items];
    setItems(next); setTitle(''); setAmount(''); save(next);
  };

  return (
    <View>
      {canEdit && (
        <View style={{ marginBottom: theme.spacing.md }}>
          <TextInput placeholder="Item title" value={title} onChangeText={setTitle} style={{ backgroundColor: theme.colors.canvas, padding: theme.spacing.sm, borderRadius: 6, marginBottom: theme.spacing.xs, borderWidth: 1, borderColor: theme.colors.muted }} />
          <TextInput placeholder="Amount" value={amount} onChangeText={setAmount} keyboardType="numeric" style={{ backgroundColor: theme.colors.canvas, padding: theme.spacing.sm, borderRadius: 6, marginBottom: theme.spacing.xs, borderWidth: 1, borderColor: theme.colors.muted }} />
          <AppButton title="Add Budget Item" onPress={add} />
        </View>
      )}

      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        ListEmptyComponent={() => (
          <View style={{ padding: theme.spacing.md }}>
            <Text style={{ ...theme.typography.body, color: theme.colors.muted }}>No items yet.</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <View style={{ padding: theme.spacing.md, marginBottom: theme.spacing.sm, backgroundColor: theme.colors.card, borderRadius: 8 }}>
            <Text style={{ ...theme.typography.h3 }}>{item.title}</Text>
            <Text style={{ ...theme.typography.body, color: theme.colors.muted }}>€{Number(item.amount).toFixed(2)}</Text>
          </View>
        )}
      />
    </View>
  );
}
