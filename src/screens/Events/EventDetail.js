import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Alert, Linking, Platform, ScrollView } from 'react-native';
import { useTheme } from '../../theme';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import { signUpForEvent, cancelSignUp, getMemberSignups } from '../../services/api';
import { Asset } from 'expo-asset';
import * as FileSystemLegacy from 'expo-file-system/legacy';
import getPromosForEventId from '../../utils/promoAssets';
import AppButton from '../../components/AppButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function EventDetailScreen() {
	const route = useRoute();
	const navigation = useNavigation();
	const { user } = useAuth();
	const { event } = route.params || {};
	const [loading, setLoading] = useState(false);
	const [signedUp, setSignedUp] = useState(false);
	const theme = useTheme();
	const [opening, setOpening] = useState(false);
	const insets = useSafeAreaInsets();

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
	const promoModules = getPromosForEventId(String(event.id));
	const footerHeight = 72 + (insets.bottom || 0);

	async function openPromo(module) {
		setOpening(true);
		try {
			const asset = Asset.fromModule(module);
			await asset.downloadAsync();
			const localUri = asset.localUri || asset.uri;
			if (!localUri) throw new Error('No local URI for asset');

			if (Platform.OS === 'android') {
				// Use the legacy FileSystem API to get a content:// URI that can be opened by other apps.
				try {
					const contentUri = await FileSystemLegacy.getContentUriAsync(localUri);
					await Linking.openURL(contentUri);
				} catch (e) {
					console.warn('getContentUriAsync/open failed', e);
					Alert.alert('Cannot open promo', 'Expo Go cannot open this PDF directly on Android. Try installing a dev client or opening the app as a standalone build.');
				}
			} else {
				try {
					await Linking.openURL(localUri);
				} catch (e) {
					console.warn('openURL failed', e);
					Alert.alert('Cannot open promo', 'Unable to open the promo PDF on this device.');
				}
			}
		} catch (e) {
			console.warn('Failed to open promo', e);
			Alert.alert('Cannot open promo', 'Unable to open the promo PDF on this device.');
		} finally {
			setOpening(false);
		}
	}

	return (
		<View style={{ flex: 1, backgroundColor: theme.colors.canvas }}>
			<ScrollView contentContainerStyle={{ padding: theme.spacing.xxl, paddingBottom: footerHeight + theme.spacing.md }}>
				<Text style={{ ...theme.typography.h1, color: theme.colors.text }}>{event.title}</Text>
				<Text style={{ ...theme.typography.body, color: theme.colors.muted, marginBottom: theme.spacing.sm }}>{event.date}</Text>

				{event.description ? (
					<Text style={{ ...theme.typography.body, color: theme.colors.text, marginTop: theme.spacing.md }}>{event.description}</Text>
				) : (
					<Text style={{ ...theme.typography.body, color: theme.colors.muted, marginTop: theme.spacing.md }}>No description available.</Text>
				)}

				{promoModules && promoModules.length > 0 && (
					<View style={{ marginTop: theme.spacing.md, marginBottom: theme.spacing.md }}>
						<Text style={{ ...theme.typography.h2, color: theme.colors.textLight, marginBottom: theme.spacing.sm }}>Promotional material</Text>
						{promoModules.map((m, i) => (
							<View key={i} style={{ marginBottom: theme.spacing.sm }}>
								<AppButton
									title={promoModules.length > 1 ? `Open promo ${i + 1}` : 'Open promo'}
									variant="secondary"
									color={theme.colors.surfaceAlt1}
									onPress={() => openPromo(m)}
								/>
							</View>
						))}
						{opening && <ActivityIndicator color={theme.colors.activate} />}
					</View>
				)}
			</ScrollView>

			<View style={{ padding: theme.spacing.xl, borderTopWidth: 1, borderTopColor: theme.colors.surface, backgroundColor: theme.colors.card }}>
				{loading ? (
					<ActivityIndicator color={signedUp ? theme.colors.deactivate : theme.colors.activate} />
				) : (
					<AppButton
						variant={!user ? 'activate' : signedUp ? 'deactivate' : 'activate'}
						title={!user ? 'Log in to sign up' : signedUp ? 'Cancel signup' : 'Sign up'}
						onPress={handleSignupToggle}
						style={{ width: '100%' }}
					/>
				)}
			</View>
		</View>
	);
}
