// Purpose: Profile hub showing user info and navigation to profile-related screens.
import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import ProfileHeader from '../../components/ProfileHeader';
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
					{ key: 'signups', label: 'My Signups', route: 'Signups' },
			],
		},
		{
			title: 'Finances',
			items: [
				{ key: 'wallet', label: 'Wallet', route: 'Wallet' },
				{ key: 'book-sale', label: 'Book Sales', route: 'Books' },
			],
		},
		{
			title: 'Association',
			items: [
				{ key: 'board', label: 'Board', route: 'Board' },
				{ key: 'committees', label: 'Committees', route: 'Committees' },
				{ key: 'vrij', label: 'Francken Vrij', route: 'FranckenVrij' },
				{ key: 'photos', label: 'Photos', route: 'Photos' },
			],
		},
		{
			title: 'Wellbeing & Inclusion',
			items: [
				{ key: 'mental-health', label: 'Mental Health', route: 'MentalHealth' },
				{ key: 'sustainability', label: 'Sustainability', route: 'Sustainability' },
				{ key: 'internationals', label: 'Internationals', route: 'Internationals' },
			],
		},
		{
			title: 'Community Guidelines',
			items: [
				{ key: 'privacy', label: 'Privacy Policy', route: 'Privacy' },
				{ key: 'conduct', label: 'Code of Conduct', route: 'Conduct' },
			],
		}
	];

	return (
		<View style={{ flex: 1, backgroundColor: theme.colors.canvas }}>
			<View style={{ padding: theme.spacing.xl, paddingBottom: 0 }}>
				<ProfileHeader user={user} onSignOut={signOut} onLogin={() => navigation.navigate('Login')} />
			</View>
			<ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: theme.spacing.xxl, paddingTop: 0 }}>
				{user ? (
					<View style={{ marginTop: 0 }}>
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
						<Text style={theme.typography.body}></Text>
					</View>
				)}
			</ScrollView>
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
