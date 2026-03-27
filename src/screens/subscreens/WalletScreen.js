import React, { useState } from 'react';
import { View, Text, Button, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useTheme } from '../../theme';
import { useAuth } from '../../contexts/AuthContext';
import MemberQRCode from '../../components/MemberQRCode';
import { makeQrPayload, decodeQrPayload } from '../../utils/qrPayload';

export default function WalletScreen() {
  const { user } = useAuth();
  const theme = useTheme();

  if (!user) return null;

  // numeric balance (use `user.balance` if provided, otherwise fallback)
  const balanceValue = typeof user.balance === 'number' ? user.balance : 90.99;

  const formatBalance = (v) => {
    try {
      return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(v);
    } catch (e) {
      return `€${v.toFixed(2)}`;
    }
  };

  // use hue interpolation (HSL) to keep saturation/lightness constant for vivid colors
  const hslToHex = (h, s, l) => {
    h = ((h % 360) + 360) % 360; // normalize
    s = Math.max(0, Math.min(1, s));
    l = Math.max(0, Math.min(1, l));
    const hueToRgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    let r, g, b;
    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      const hk = h / 360;
      r = hueToRgb(p, q, hk + 1 / 3);
      g = hueToRgb(p, q, hk);
      b = hueToRgb(p, q, hk - 1 / 3);
    }
    const toHex = (n) => Math.round(n * 255).toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  // mapping: <= €2 => red (hue 0), >= €10 => green (hue 120), interpolate hue only
  const redHue = 0;
  const greenHue = 120;
  const t = balanceValue <= 2 ? 0 : balanceValue >= 10 ? 1 : (balanceValue - 2) / 8;
  const hue = redHue + (greenHue - redHue) * t;
  const saturation = 0.92; // high saturation for vivid colors
  const lightness = 0.5; // mid lightness for contrast
  const amountColor = hslToHex(hue, saturation, lightness);

  // Member card QR state and payload
  const [now, setNow] = useState(null);
  const TEST_SECRET = 'FRANCKEN1984';
  const payload = makeQrPayload(user.uid || user.email, TEST_SECRET, now);
  const decoded = decodeQrPayload(payload, TEST_SECRET);

  // sample/fake purchases for UI preview
  const samplePurchases = [
    { id: 'p1', date: '2026-03-20', title: 'Pepsi Max', amount: -0.88 },
    { id: 'p2', date: '2026-03-15', title: 'Noodles', amount: -0.40 },
    { id: 'p3', date: '2026-02-28', title: 'Membership Fee 2026', amount: -5.0 },
    { id: 'p4', date: '2026-01-10', title: 'Declaration Fraccie: Cups', amount: 2.12 },
  ];

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, padding: theme.spacing.xl }}>
      <View style={{ alignItems: 'center', marginBottom: theme.spacing.xxl }}>
        <Text style={{ ...theme.typography.h2, marginBottom: theme.spacing.sm }}>Member Card:</Text>
        <MemberQRCode memberId={user.uid || user.email} size={220} now={now} />

        <TouchableOpacity style={{ backgroundColor: theme.colors.primary, marginTop: theme.spacing.md, paddingVertical: theme.spacing.sm, paddingHorizontal: theme.spacing.md, borderRadius: 6 }} onPress={() => setNow(new Date().toISOString())}>
          <Text style={{ color: theme.colors.textLight, ...theme.typography.label }}>Refresh QR</Text>
        </TouchableOpacity>

        {decoded && decoded.ok && decoded.valid && (
          <Text style={{ marginTop: theme.spacing.sm, ...theme.typography.body }}>Generated: {new Date(decoded.ts).toLocaleString()}</Text>
        )}
      </View>
      
      <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: theme.spacing.xl }}>
        <Text style={{ ...theme.typography.h2, marginBottom: theme.spacing.sm }}>Balance:</Text>
        <Text style={{ fontSize: 50, lineHeight: 100, color: amountColor, textAlign: 'center', fontWeight: '700' }}>{formatBalance(balanceValue)}</Text>
        <View style={{ marginTop: theme.spacing.md }}>
          <Button color={theme.colors.accent} title="Top up" onPress={() => alert('Top-up flow not implemented')} />
        </View>
      </View>

      <View style={{ marginBottom: theme.spacing.xl }}>
        <Text style={{ ...theme.typography.h2, marginBottom: theme.spacing.sm }}>Recent Transactions</Text>
        <FlatList
          data={samplePurchases}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: theme.spacing.sm }}>
              <View>
                <Text style={{ ...theme.typography.body, color: theme.colors.text }}>{item.title}</Text>
                <Text style={{ ...theme.typography.label, color: theme.colors.muted }}>{new Date(item.date).toLocaleDateString()}</Text>
              </View>
              <Text style={{ ...theme.typography.body, color: item.amount < 0 ? theme.colors.danger : theme.colors.primary }}>{formatBalance(item.amount)}</Text>
            </View>
            
          )}
        />
        <View style={{ marginTop: theme.spacing.xl }}>
                <Button color={theme.colors.accent} title="All transactions" onPress={() => alert('Transaction details not implemented')}/>
              </View>
      </View>
    </ScrollView>
  );
}
