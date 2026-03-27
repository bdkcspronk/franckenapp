import React from 'react';
import { View, Text, Button } from 'react-native';
import { useTheme } from '../theme';

export default function ProfileHeader({ user, onSignOut, onLogin }) {
  const theme = useTheme();

  if (!user) {
    return (
      <View style={{ paddingVertical: 12 }}>
        <Text style={{ marginBottom: 12, ...theme.typography.body, color: theme.colors.text }}>You are not logged in.</Text>
        <Button color={theme.colors.primary} title="Log in" onPress={onLogin} />
      </View>
    );
  }

  return (
    <View style={{ paddingVertical: 12 }}>
      <Text style={{ ...theme.typography.h2, color: theme.colors.text }}>{user.displayName || user.email}</Text>
      <Text style={{ ...theme.typography.body, color: theme.colors.muted }}>{user.email}</Text>
      <View style={{ marginTop: 8 }}>
        <Button color={theme.colors.danger} title="Sign out" onPress={onSignOut} />
      </View>
    </View>
  );
}
