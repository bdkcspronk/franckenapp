import React from 'react';
import { Text } from 'react-native';
import { useTheme } from '../theme';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EventsScreen from '../screens/EventsScreen';
import EventDetailScreen from '../screens/subscreens/EventDetailScreen';
import NewsScreen from '../screens/NewsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import WalletScreen from '../screens/subscreens/WalletScreen';
import LoginScreen from '../screens/subscreens/LoginScreen';
import PersonalDetailsScreen from '../screens/subscreens/PersonalDetailsScreen';
import SignupsScreen from '../screens/subscreens/SignupsScreen';
import FranckenVrijScreen from '../screens/subscreens/FranckenVrijScreen';
import CommitteesScreen from '../screens/subscreens/CommitteesScreen';
import PhotosScreen from '../screens/subscreens/PhotosScreen';
import BoardScreen from '../screens/subscreens/BoardScreen';
import PrivacyScreen from '../screens/subscreens/PrivacyScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../contexts/AuthContext';
import { MaterialIcons } from '@expo/vector-icons';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function PublicTabs() {
  const theme = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.card },
        headerTintColor: theme.colors.textLight,
        contentStyle: { backgroundColor: theme.colors.canvas },
        tabBarStyle: { backgroundColor: theme.colors.card },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.muted,
        tabBarLabelStyle: {
          fontFamily: theme.typography.label.fontFamily,
          fontSize: theme.typography.label.fontSize,
          fontWeight: theme.typography.label.fontWeight,
        }
      }}
    >
      <Tab.Screen
        name="Events"
        component={EventsScreen}
        options={{
          tabBarIcon: ({ color, size }) => <MaterialIcons name="event" size={size} color={color} />,
          tabBarLabel: ({ color }) => <Text style={{ color, ...theme.typography.label }}>Events</Text>,
          headerTitle: 'Upcoming Events',
          headerTitleStyle: {
            fontFamily: theme.typography.h1.fontFamily,
            fontSize: theme.typography.h1.fontSize,
            fontWeight: theme.typography.h1.fontWeight,
            color: theme.colors.textLight,
          },
        }}
      />
      <Tab.Screen
        name="News"
        component={NewsScreen}
        options={{
          tabBarIcon: ({ color, size }) => <MaterialIcons name="article" size={size} color={color} />,
          tabBarLabel: ({ color }) => <Text style={{ color, ...theme.typography.label }}>News</Text>,
          headerTitle: 'Latest News',
          headerTitleStyle: {
            fontFamily: theme.typography.h1.fontFamily,
            fontSize: theme.typography.h1.fontSize,
            fontWeight: theme.typography.h1.fontWeight,
            color: theme.colors.textLight,
          },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => <MaterialIcons name="person" size={size} color={color} />,
          tabBarLabel: ({ color }) => <Text style={{ color, ...theme.typography.label }}>Profile</Text>,
          headerTitle: 'My Profile',
          headerTitleStyle: {
            fontFamily: theme.typography.h1.fontFamily,
            fontSize: theme.typography.h1.fontSize,
            fontWeight: theme.typography.h1.fontWeight,
            color: theme.colors.textLight,
          },
        }}
      />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  const { user } = useAuth();
  const theme = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.card },
        headerTintColor: theme.colors.textLight,
        headerTitleStyle: {
          color: theme.colors.textLight,
          fontFamily: theme.typography.h1.fontFamily,
          fontSize: theme.typography.h1.fontSize,
          fontWeight: theme.typography.h1.fontWeight,
        },
        contentStyle: { backgroundColor: theme.colors.canvas },
      }}
    >
      <Stack.Screen name="Home" component={PublicTabs} options={{ headerShown: false }} />
      <Stack.Screen name="Event Details" component={EventDetailScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="PersonalDetails" component={PersonalDetailsScreen} options={{ title: 'Personal Details' }} />
      <Stack.Screen name="Signups" component={SignupsScreen} options={{ title: 'My Signups' }} />
      
      <Stack.Screen name="FranckenVrij" component={FranckenVrijScreen} options={{ title: 'Francken Vrij' }} />
      <Stack.Screen name="Committees" component={CommitteesScreen} options={{ title: 'Committees' }} />
      <Stack.Screen name="Photos" component={PhotosScreen} options={{ title: 'Photos' }} />
      <Stack.Screen name="Board" component={BoardScreen} options={{ title: 'Board' }} />
      <Stack.Screen name="Privacy" component={PrivacyScreen} options={{ title: 'Privacy' }} />
      {user && <Stack.Screen name="Wallet" component={WalletScreen} />}
    </Stack.Navigator>
  );
}
