// Purpose: Show and edit the user's personal details and contact information.
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../../../contexts/AuthContext';
import ProfileHeader from '../../../components/ProfileHeader';
import { useTheme } from '../../../theme';
import AppButton from '../../../components/AppButton';

export default function PersonalDetailsScreen() {
	const { user, updateProfile } = useAuth();
	const theme = useTheme();

	const [editingAddress, setEditingAddress] = useState(false);
	const [address, setAddress] = useState(user?.address || '');

	useEffect(() => {
		setAddress(user?.address || '');
	}, [user?.address]);

	if (!user) {
		return (
			<View style={{ flex: 1, padding: theme.spacing.lg, backgroundColor: theme.colors.background }}>
				<Text style={{ ...theme.typography.body, paddingHorizontal: theme.spacing.xxl }}>Please log in to view personal details.</Text>
			</View>
		);
	}

	return (
		<View style={{ flex: 1, padding: theme.spacing.lg, backgroundColor: theme.colors.background }}>
			<View style={{ marginTop: theme.spacing.lg, paddingHorizontal: theme.spacing.xxl }}>
				<Text style={theme.typography.h2}>Account</Text>
				<Text style={{ ...theme.typography.body, marginTop: theme.spacing.sm }}>Name: {user.displayName || '—'}</Text>
				<Text style={{ ...theme.typography.body, marginTop: theme.spacing.xs }}>Email: {user.email || user.uid}</Text>

				<Text style={{ ...theme.typography.h2, marginTop: theme.spacing.md }}>Contact</Text>
				<Text style={{ ...theme.typography.body, marginTop: theme.spacing.sm }}>Phone: {user.phone || '—'}</Text>

				<Text style={{ ...theme.typography.h2, marginTop: theme.spacing.md }}>Personal</Text>
				<Text style={{ ...theme.typography.body, marginTop: theme.spacing.sm }}>Birthday: {user.birthday || '—'}</Text>
				<Text style={{ ...theme.typography.body, marginTop: theme.spacing.sm }}>Study: {user.study?.name || '—'} ({user.study?.startYear || '—'})</Text>
				<Text style={{ ...theme.typography.body, marginTop: theme.spacing.sm }}>Student number: {user.studentNumber || '—'}</Text>
				<Text style={{ ...theme.typography.body, marginTop: theme.spacing.sm }}>IBAN: {user.iban || '—'}</Text>

				<Text style={{ ...theme.typography.h2, marginTop: theme.spacing.md }}>Home address</Text>
				{editingAddress ? (
					<>
						<TextInput
							value={address}
							onChangeText={setAddress}
							multiline
							style={{ borderWidth: 1, borderColor: theme.colors.muted, padding: theme.spacing.sm, marginTop: theme.spacing.sm, borderRadius: 6 }}
						/>
						<View style={{ flexDirection: 'row', marginTop: theme.spacing.sm }}>
							<AppButton color={theme.colors.activate} title="Save" variant="activate" onPress={async () => {
								try {
									const res = await updateProfile({ address });
									if (res.ok) {
										setEditingAddress(false);
										Alert.alert('Saved', 'Address updated');
									} else {
										Alert.alert('Error', res.message || 'Failed to save');
									}
								} catch (e) {
									Alert.alert('Error', e.message || 'Failed to save');
								}
							}} />
							<View style={{ width: theme.spacing.md }} />
							<AppButton title="Cancel" variant="deactivate" onPress={() => { setAddress(user.address || ''); setEditingAddress(false); }} />
						</View>
					</>
				) : (
					<>
						<Text style={{ ...theme.typography.body, marginTop: theme.spacing.sm }}>{user.address || '—'}</Text>
						<TouchableOpacity onPress={() => setEditingAddress(true)} style={{ marginTop: theme.spacing.sm }}>
							<Text style={{ color: theme.colors.activate }}>Edit address</Text>
						</TouchableOpacity>
					</>
				)}
			</View>
		</View>
	);
}
