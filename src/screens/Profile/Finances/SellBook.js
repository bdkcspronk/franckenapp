// Purpose: Allow users to list a book for sale and submit sale details.
import React, { useState } from 'react';
import { View, Text, TextInput, Alert } from 'react-native';
import { useTheme } from '../../../theme';
import { useAuth } from '../../../contexts/AuthContext';
import AppButton from '../../../components/AppButton';
import { createBookListing } from '../../../services/api';
import { useNavigation } from '@react-navigation/native';

export default function SellBookScreen() {
	const theme = useTheme();
	const { user } = useAuth();
	const navigation = useNavigation();

	const [title, setTitle] = useState('');
	const [author, setAuthor] = useState('');
	const [description, setDescription] = useState('');
	const [price, setPrice] = useState('');

	if (!user) {
		return (
			<View style={{ flex: 1, padding: theme.spacing.lg }}>
				<Text style={theme.typography.body}>Please log in to sell a book.</Text>
			</View>
		);
	}

	async function handleSubmit() {
		const parsed = parseFloat((price || '').toString().replace(',', '.'));
		if (!title || !author || isNaN(parsed) || parsed <= 0) {
			Alert.alert('Invalid', 'Please provide title, author and a positive price (e.g. 4.50)');
			return;
		}
		const priceCents = Math.round(parsed * 100);
		try {
			const res = await createBookListing(user.uid || user.email, { title, author, description, price: priceCents });
			if (res.ok) {
				Alert.alert('Listed', 'Your book has been listed for sale');
				navigation.goBack();
			} else {
				Alert.alert('Error', res.message || 'Failed to list book');
			}
		} catch (e) {
			console.warn('Listing error', e);
			Alert.alert('Error', e.message || 'Failed to list book');
		}
	}

	return (
		<View style={{ flex: 1, padding: theme.spacing.lg }}>
			<Text style={theme.typography.h2}>Sell a book</Text>

			<TextInput placeholder="Title" value={title} onChangeText={setTitle} style={{ borderWidth: 1, borderColor: theme.colors.surface, padding: theme.spacing.sm, marginTop: theme.spacing.sm, borderRadius: 6 }} />
			<TextInput placeholder="Author" value={author} onChangeText={setAuthor} style={{ borderWidth: 1, borderColor: theme.colors.surface, padding: theme.spacing.sm, marginTop: theme.spacing.sm, borderRadius: 6 }} />
			<TextInput placeholder="Price (EUR)" value={price} onChangeText={setPrice} keyboardType="numeric" style={{ borderWidth: 1, borderColor: theme.colors.surface, padding: theme.spacing.sm, marginTop: theme.spacing.sm, borderRadius: 6 }} />
			<TextInput placeholder="Short description (optional)" value={description} onChangeText={setDescription} multiline style={{ borderWidth: 1, borderColor: theme.colors.surface, padding: theme.spacing.sm, marginTop: theme.spacing.sm, borderRadius: 6, minHeight: 80 }} />

			<View style={{ marginTop: theme.spacing.md }}>
				<AppButton title="List book" variant="activate" onPress={handleSubmit} />
			</View>
		</View>
	);
}
