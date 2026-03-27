import React from 'react';
import { View, Text } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import ProfileHeader from '../components/ProfileHeader';
import { useTheme } from '../theme';

export default function PersonalDetailsScreen() {
  const { user } = useAuth();
  const theme = useTheme();

  if (!user) {
    return (
      <View style={{ flex: 1, padding: 16 }}>
        <Text style={theme.typography.body}>Please log in to view personal details.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <ProfileHeader user={user} />
      <View style={{ marginTop: 16 }}>
        <Text style={theme.typography.h2}>Account</Text>
        <Text style={theme.typography.body}>Name: {user.displayName || '—'}</Text>
        <Text style={theme.typography.body}>Email: {user.email || user.uid}</Text>
      </View>
    </View>
  );
}
