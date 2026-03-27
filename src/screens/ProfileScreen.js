import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../theme';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import ProfileHeader from '../components/ProfileHeader';
import WalletCard from '../components/WalletCard';
import MemberQRCode from '../components/MemberQRCode';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const navigation = useNavigation();
  const theme = useTheme();

  const tiles = [
    // Row 1
    { key: 'personal', label: 'Personal Details', route: 'PersonalDetails' },
    { key: 'signups', label: 'Signups', route: 'Signups' },
    { key: 'committees', label: 'My Committees', route: 'Committees' },

    // Row 2
    { key: 'wallet', label: 'Wallet', route: 'Wallet' },
    { key: 'photos', label: 'Photos', route: 'Photos' },
    { key: 'board', label: 'Board', route: 'Board' },

    // Row 3
    { key: 'vrij', label: 'Francken Vrij', route: 'FranckenVrij' },
    { key: 'privacy', label: 'Privacy', route: 'Privacy' },
    { key: 'placeholder', label: 'Placeholder', route: 'Placeholder' },
  ];

  const cols = 3;
  const screenWidth = Dimensions.get('window').width;
  const padding = 0 * 2; // container horizontal padding
  const gap = theme.spacing.xl;
  const tileSize = Math.floor((screenWidth - padding - gap * (cols - 1)) / cols);

  return (
    <View style={{ flex: 1, padding: theme.spacing.lg, backgroundColor: theme.colors.background }}>
      <ProfileHeader user={user} onSignOut={signOut} onLogin={() => navigation.navigate('Login')} />
      {user ? (
        <View style={{ marginTop: theme.spacing.xl }}>
          <View>
            {(() => {
              // chunk tiles into rows of `cols`
              const rows = [];
              for (let i = 0; i < tiles.length; i += cols) rows.push(tiles.slice(i, i + cols));
              return rows.map((row, rowIndex) => (
                <View key={`row-${rowIndex}`} style={[styles.gridRow, { marginBottom: theme.spacing.md }]}> 
                  {row.map((t, colIndex) => {
                    // checkerboard: alternate per column, flip each row
                    const bg = (rowIndex + colIndex) % 2 === 0 ? theme.colors.surfaceAlt1 : theme.colors.surfaceAlt1;
                    return (
                      <TouchableOpacity
                        key={t.key}
                        style={[styles.tile, { width: tileSize, height: tileSize, backgroundColor: bg, padding: theme.spacing.sm }]}
                        onPress={() => {
                          const rootNav = navigation.getParent?.()?.getParent?.() || navigation.getParent?.() || navigation;
                          rootNav.navigate(t.route);
                        }}
                      >
                        <Text style={{ ...theme.typography.h2, color: theme.colors.textLight, textAlign: 'center' }}>{t.label}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ));
            })()}
          </View>
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
