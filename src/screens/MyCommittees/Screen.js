// Purpose: Show committees the current logged-in user is a member of (mock data).
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme';
import { useAuth } from '../../contexts/AuthContext';


export default function MyCommitteesScreen() {
	const theme = useTheme();
	const navigation = useNavigation();
	const { user } = useAuth();
	const [committees, setCommittees] = useState(null);

	useEffect(() => {
		let mounted = true;
		async function load() {
			try {
				// load mock data synchronously via require
				const data = require('../../mocks/committees.json');
				if (!mounted) return;
				const memberId = user?.uid || user?.email || null;
				if (!memberId) {
					setCommittees([]);
					return;
				}
				// filter committees that include this member id
				const filtered = (data || []).filter((c) => (c.members || []).includes(String(memberId)));
				setCommittees(filtered);
			} catch (e) {
				console.warn('Failed to load committees mock', e);
				if (mounted) setCommittees([]);
			}
		}
		load();
		return () => (mounted = false);
	}, [user]);

	if (committees === null) return (
		<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.canvas }}>
			<ActivityIndicator color={theme.colors.activate} />
		</View>
	);

	if (!user) return (
		<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: theme.spacing.xl, backgroundColor: theme.colors.canvas }}>
			<Text style={{ ...theme.typography.body, color: theme.colors.muted }}>Please log in to see your committees.</Text>
		</View>
	);

	if (committees.length === 0) return (
		<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: theme.spacing.xl, backgroundColor: theme.colors.canvas }}>
			<Text style={{ ...theme.typography.body, color: theme.colors.muted }}>You are not a member of any committees (mock data).</Text>
		</View>
	);

	return (
		<View style={{ flex: 1, backgroundColor: theme.colors.canvas }}>
			<FlatList
				data={committees}
				keyExtractor={(c) => c.id}
				contentContainerStyle={{ padding: theme.spacing.xl }}
				renderItem={({ item, index }) => (
					<TouchableOpacity
						activeOpacity={0.8}
						onPress={() => navigation.navigate('CommitteeHome', { id: item.id, name: item.name })}
						style={{ padding: theme.spacing.md, paddingVertical: theme.spacing.xl, marginVertical: theme.spacing.sm, backgroundColor: theme.colors.card, borderRadius: 8 }}
					>
						<Text style={{ ...theme.typography.h2, color: theme.colors.textLight }}>{item.name}</Text>
					</TouchableOpacity>
				)}
			/>
		</View>
	);
}

