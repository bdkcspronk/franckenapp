import React from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { useTheme } from '../theme';

// TODO: replace with your real latest-issue URL or a fetch that returns the latest file
const LATEST_ISSUE_URL = 'https://example.com/francken-vrij-latest.pdf';

export default function FranckenVrijScreen() {
  const theme = useTheme();

  async function handleOpen() {
    try {
      await Linking.openURL(LATEST_ISSUE_URL);
    } catch (e) {
      console.warn('Failed to open URL', e);
    }
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={theme.typography.h2}>Francken Vrij</Text>
      <Text style={{ marginTop: 8, ...theme.typography.body }}>Download the latest issue of our association magazine.</Text>

      <TouchableOpacity
        style={{ marginTop: 20, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, backgroundColor: theme.colors.primary }}
        onPress={handleOpen}
      >
        <Text style={{ color: theme.colors.textLight, ...theme.typography.label }}>Download Latest Issue</Text>
      </TouchableOpacity>
    </View>
  );
}
