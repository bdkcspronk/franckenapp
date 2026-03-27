import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import MemberQRCode from '../components/MemberQRCode';
import { useTheme } from '../theme';
import { makeQrPayload, decodeQrPayload } from '../utils/qrPayload';

// Test secret — replace with secure storage for production
const TEST_SECRET = 'FRANCKEN1984';

export default function MemberCardScreen() {
  const { user } = useAuth();
  const theme = useTheme();

  if (!user) return (
    <View style={{ flex:1, padding:16 }}>
      <Text style={theme.typography.body}>Please log in to view your member card.</Text>
    </View>
  );

  const [now, setNow] = useState(null);

  const payload = makeQrPayload(user.uid || user.email, TEST_SECRET, now);
  const decoded = decodeQrPayload(payload, TEST_SECRET);

  return (
    <View style={{ flex: 1, padding: 16, alignItems: 'center' }}>
      <Text style={{ ...theme.typography.h2, marginBottom: 100 }}></Text>
      <MemberQRCode memberId={user.uid || user.email} size={260} now={now} />

      <TouchableOpacity style={[styles.button, { backgroundColor: theme.colors.primary }]} onPress={() => setNow(new Date().toISOString())}>
        <Text style={{ color: theme.colors.textLight, ...theme.typography.label }}>Refresh QR</Text>
      </TouchableOpacity>

      {decoded && decoded.ok && decoded.valid && (
        <Text style={{ marginTop: 12, ...theme.typography.body }}>Generated: {new Date(decoded.ts).toLocaleString()}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
});
