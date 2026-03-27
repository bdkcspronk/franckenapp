import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../theme';
import AppButton from './AppButton';

export default function ProfileHeader({ user, onSignOut, onLogin }) {
  const theme = useTheme();

  if (!user) {
    return (
      <View style={{ paddingVertical: 12 }}>
        <Text style={{ marginBottom: 12, ...theme.typography.body, color: theme.colors.text }}>You are not logged in.</Text>
        <AppButton title="Log in" variant="activate" onPress={onLogin} />
      </View>
    );
  }

  return (
    <View style={{ paddingVertical: 12 }}>
      <Text style={{ ...theme.typography.h2, color: theme.colors.text, textAlign: 'center' }}>{user.displayName || user.email}</Text>
      <Text style={{ ...theme.typography.body, color: theme.colors.muted, textAlign: 'center' }}>{user.email}</Text>
      <View style={{ marginTop: 12, width: '50%', alignSelf: 'center' }}>
        <AppButton title="Sign out" variant="deactivate" onPress={onSignOut} style={{ width: '100%' }} />
      </View>
    </View>
  );
}
