import React, { useState, useCallback } from 'react';
import { View, Text } from 'react-native';
import { useAuth } from '../../../contexts/AuthContext';
import { useFocusEffect } from '@react-navigation/native';
import { getMemberSignups, cancelSignUp } from '../../../services/api';
import ProfileSignups from '../../../components/ProfileSignups';
import { useTheme } from '../../../theme';

export default function SignupsScreen() {
	const { user } = useAuth();
	const theme = useTheme();
	const [signups, setSignups] = useState([]);
	const [loading, setLoading] = useState(false);

	useFocusEffect(
		useCallback(() => {
			let mounted = true;
			async function load() {
				if (!user) return;
				setLoading(true);
				try {
					const s = await getMemberSignups(user.uid || user.email);
					if (mounted) setSignups(s || []);
				} catch (e) {
					console.warn('Failed to load signups', e);
				} finally {
					if (mounted) setLoading(false);
				}
			}
			load();
			return () => { mounted = false; };
		}, [user])
	);

	async function handleCancel(signup) {
		if (!user || !signup) return;
		try {
			const res = await cancelSignUp(signup.event.id, user.uid || user.email);
			if (res.ok) setSignups((cur) => cur.filter((s) => s.id !== signup.id));
		} catch (e) {
			console.warn('Cancel error', e);
		}
	}

	if (!user) return (
		<View style={{ flex:1, padding: theme.spacing.lg }}>
			<Text style={{ ...theme.typography.body, paddingHorizontal: theme.spacing.xxl }}>Please log in to view signups.</Text>
		</View>
	);

	return (
		<View style={{ flex:1, padding: theme.spacing.lg }}>
			<View style={{ paddingHorizontal: theme.spacing.xxl }}>
				<ProfileSignups signups={signups} loading={loading} onCancel={handleCancel} />
			</View>
		</View>
	);
}
