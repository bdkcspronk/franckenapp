import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../theme';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import ProfileHeader from '../components/ProfileHeader';
import { MaterialIcons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const navigation = useNavigation();
  const theme = useTheme();

  const sections = [
    {
      title: 'Me',
      items: [
        { key: 'personal', label: 'Personal Details', route: 'PersonalDetails' },
        { key: 'committees', label: 'My Committees', route: 'Committees' },
        { key: 'signups', label: 'My Signups', route: 'Signups' },
      ],
    },
    {
      title: 'Finances',
      items: [
        { key: 'wallet', label: 'Wallet', route: 'Wallet' },
      ],
    },
    {
      title: 'Association',
      items: [
        { key: 'board', label: 'Board', route: 'Board' },
        { key: 'vrij', label: 'Francken Vrij', route: 'FranckenVrij' },
        { key: 'privacy', label: 'Privacy', route: 'Privacy' },
        { key: 'photos', label: 'Photos', route: 'Photos' },
      ],
    },
  ];

  return (
    <View style={{ flex: 1, padding: theme.spacing.lg, backgroundColor: theme.colors.background }}>
      <ProfileHeader user={user} onSignOut={signOut} onLogin={() => navigation.navigate('Login')} />
      {user ? (
        <View style={{ marginTop: theme.spacing.xl }}>
          {sections.map((section) => (
            <View key={section.title} style={{ marginBottom: theme.spacing.lg }}>
              <Text style={{ ...theme.typography.h2, marginBottom: theme.spacing.sm }}>{section.title}</Text>
              <View style={{ backgroundColor: theme.colors.card, borderRadius: 8, overflow: 'hidden' }}>
                {section.items.map((item, idx) => (
                  <TouchableOpacity
                    key={item.key}
                    style={{ padding: theme.spacing.md, borderBottomWidth: idx < section.items.length - 1 ? 1 : 0, borderBottomColor: theme.colors.surface }}
                    onPress={() => {
                      const rootNav = navigation.getParent?.()?.getParent?.() || navigation.getParent?.() || navigation;
                      rootNav.navigate(item.route);
                    }}
                  >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text style={{ ...theme.typography.body, color: theme.colors.textLight }}>{item.label}</Text>
                      <MaterialIcons name="chevron-right" size={22} color={theme.colors.textLight} />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View style={{ marginTop: theme.spacing.xl }}>
          <Text style={theme.typography.body}>Please log in to view your profile.</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tile: {
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
