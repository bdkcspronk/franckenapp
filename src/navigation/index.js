// Purpose: Configure app navigation (tabs and stacks) and route mappings.
import React from 'react';
import { Text } from 'react-native';
import { useTheme } from '../theme';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FeedScreen from '../screens/Feed/Screen';
import EventDetailScreen from '../screens/Feed/EventDetail';
import ProfileScreen from '../screens/Profile/Screen';
import MyCommitteesScreen from '../screens/MyCommittees/Screen';
import WalletScreen from '../screens/Profile/Finances/Wallet';
import CommitteeHomeScreen from '../screens/MyCommittees/CommitteeHome';
import LoginScreen from '../screens/Profile/Me/Login';
import PersonalDetailsScreen from '../screens/Profile/Me/PersonalDetails';
import SignupsScreen from '../screens/Profile/Me/Signups';
import FranckenVrijScreen from '../screens/Profile/Association/FranckenVrij';
import CommitteesScreen from '../screens/Profile/Association/committees/Overview';
import CommitteeScreen from '../screens/Profile/Association/committees/CommitteeScreen';
import PhotosScreen from '../screens/Profile/Association/Photos';
import BoardScreen from '../screens/Profile/Association/Board';
import PrivacyScreen from '../screens/Profile/Info/Privacy';
import ConductScreen from '../screens/Profile/Info/Conduct';
import MentalHealthScreen from '../screens/Profile/Wellbeing/MentalHealth';
import SustainabilityScreen from '../screens/Profile/Wellbeing/Sustainability';
import InternationalsScreen from '../screens/Profile/Wellbeing/Internationals';
import BookSalesScreen from '../screens/Profile/Finances/BookSales';
import SellBookScreen from '../screens/Profile/Finances/SellBook';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../contexts/AuthContext';
import { MaterialIcons } from '@expo/vector-icons';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function PublicTabs() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const baseVertical = theme.spacing.sm;
  return (
    <Tab.Navigator initialRouteName="Profile"
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.card },
        headerTintColor: theme.colors.textLight,
        headerTitleAlign: 'center',
        contentStyle: { backgroundColor: theme.colors.canvas },
        tabBarStyle: {
          backgroundColor: theme.colors.card,
          paddingTop: baseVertical,
          paddingBottom: baseVertical + (insets.bottom || 0),
          height: 80 + (insets.bottom || 0),
        },
        tabBarActiveTintColor: theme.colors.textLight,
        tabBarInactiveTintColor: theme.colors.muted,
        tabBarLabelStyle: {
          fontFamily: theme.typography.label.fontFamily,
          fontSize: theme.typography.label.fontSize,
          fontWeight: theme.typography.label.fontWeight,
          paddingBottom: 5,
        }
      }}
    >
      <Tab.Screen
        name="Feed"
        component={FeedScreen}
        options={{
          tabBarIcon: ({ color, size }) => <MaterialIcons name="article" size={size} color={color} />,
          tabBarLabel: ({ color }) => <Text style={{ color, ...theme.typography.label }}>Feed</Text>,
          headerTitle: 'News & Events',
          headerTitleStyle: {
            fontFamily: theme.typography.h1.fontFamily,
            fontSize: theme.typography.h1.fontSize,
            fontWeight: theme.typography.h1.fontWeight,
            color: theme.colors.textLight,
          },
        }}
      />
      <Tab.Screen
        name="MyCommittees"
        component={MyCommitteesScreen}
        options={{
          tabBarIcon: ({ color, size }) => <MaterialIcons name="groups" size={size} color={color} />,
          tabBarLabel: ({ color }) => <Text style={{ color, ...theme.typography.label }}>My Committees</Text>,
          headerTitle: 'My Committees',
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
        headerTitleAlign: 'center',
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
      <Stack.Screen name="PersonalDetails" component={PersonalDetailsScreen} options={{ title: 'My Details' }} />
      <Stack.Screen name="Signups" component={SignupsScreen} options={{ title: 'My Signups' }} />
      <Stack.Screen name="FranckenVrij" component={FranckenVrijScreen} options={{ title: 'Francken Vrij' }} />
      <Stack.Screen name="Committees" component={CommitteesScreen} options={{ title: 'Committees' }} />
      <Stack.Screen name="Committee" component={CommitteeScreen} options={({ route }) => ({ title: route.params?.name || 'Committee' })} />
      <Stack.Screen name="CommitteeHome" component={CommitteeHomeScreen} options={({ route }) => ({ title: route.params?.name || 'Committee' })} />
      <Stack.Screen name="Photos" component={PhotosScreen} options={{ title: 'Photos' }} />
      <Stack.Screen name="Board" component={BoardScreen} options={{ title: 'Board' }} />
      <Stack.Screen name="MentalHealth" component={MentalHealthScreen} options={{ title: 'Mental Health' }} />
      <Stack.Screen name="Sustainability" component={SustainabilityScreen} options={{ title: 'Sustainability' }} />
      <Stack.Screen name="Internationals" component={InternationalsScreen} options={{ title: 'Internationals' }} />
      <Stack.Screen name="Privacy" component={PrivacyScreen} options={{ title: 'Privacy Policy' }} />
      <Stack.Screen name="Conduct" component={ConductScreen} options={{ title: 'Code of Conduct' }} />
      <Stack.Screen name="Books" component={BookSalesScreen} options={{ title: 'Book Sales' }} />
      <Stack.Screen name="SellBook" component={SellBookScreen} options={{ title: 'Sell a Book' }} />
      {user && <Stack.Screen name="Wallet" component={WalletScreen} />}
    </Stack.Navigator>
  );
} 
