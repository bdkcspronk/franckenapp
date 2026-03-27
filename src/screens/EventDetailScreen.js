import React, { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator, Alert } from 'react-native';
import { useTheme } from '../theme';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { signUpForEvent, cancelSignUp, getMemberSignups } from '../services/api';

export default function EventDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { user } = useAuth();
  const { event } = route.params || {};
  const [loading, setLoading] = useState(false);
  const [signedUp, setSignedUp] = useState(false);
  const theme = useTheme();

  async function handleSignupToggle() {
    if (!user) {
      navigation.navigate('Login');
      return;
    }
    setLoading(true);
    try {
      const memberId = user.uid || user.email;
      if (signedUp) {
        const res = await cancelSignUp(event.id, memberId);
        if (res.ok) {
          setSignedUp(false);
          Alert.alert('Canceled', 'Your signup was canceled');
        } else {
          Alert.alert('Error', res.message || 'Could not cancel');
        }
      } else {
        const res = await signUpForEvent(event.id, memberId);
        if (res.ok) {
          setSignedUp(true);
          Alert.alert('Signed up', 'You have been signed up for this event');
        } else {
          Alert.alert('Error', res.message || 'Could not sign up');
        }
      }
    } catch (e) {
      console.warn('Signup error', e);
      Alert.alert('Error', 'Unexpected error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let mounted = true;
    async function check() {
      if (!user) return;
      try {
        const memberId = user.uid || user.email;
        const list = await getMemberSignups(memberId);
        if (!mounted) return;
        const found = list.some((s) => s.eventId === event.id);
        setSignedUp(found);
      } catch (e) {
        console.warn('Failed to check signup', e);
      }
    }
    check();
    return () => (mounted = false);
  }, [user, event]);

  if (!event) return null;

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ ...theme.typography.h1, color: theme.colors.text }}>{event.title}</Text>
      <Text style={{ ...theme.typography.body, color: theme.colors.muted, marginBottom: 12 }}>{event.date}</Text>
      <Text style={{ ...theme.typography.body, color: theme.colors.text }}>Event details and description would be shown here.</Text>
      {loading ? (
        <ActivityIndicator color={theme.colors.primary} />
      ) : (
        <Button color={theme.colors.primary} title={!user ? 'Log in to sign up' : signedUp ? 'Cancel signup' : 'Sign up'} onPress={handleSignupToggle} />
      )}
    </View>
  );
}
