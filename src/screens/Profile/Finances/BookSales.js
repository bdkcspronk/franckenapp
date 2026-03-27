import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Alert } from 'react-native';
import { useTheme } from '../../../theme';
import { useAuth } from '../../../contexts/AuthContext';
import AppButton from '../../../components/AppButton';
import { getAvailableBooks, buyBook } from '../../../services/api';
import { useNavigation } from '@react-navigation/native';

export default function BookSalesScreen() {
	const theme = useTheme();
	const { user } = useAuth();
	const navigation = useNavigation();
	const [books, setBooks] = useState([]);
	const [loading, setLoading] = useState(false);

	const formatPrice = (cents) => {
		const v = cents / 100;
		try {
			return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(v);
		} catch (e) {
			return `€${v.toFixed(2)}`;
		}
	};

	async function load() {
		setLoading(true);
		try {
			const b = await getAvailableBooks();
			setBooks(b || []);
		} catch (e) {
			console.warn('Failed to load books', e);
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => { load(); }, []);

	async function handleBuy(book) {
		if (!user) {
			navigation.navigate('Login');
			return;
		}
		try {
			const res = await buyBook(book.id, user.uid || user.email);
			if (!res.ok) {
				Alert.alert('Purchase failed', res.message || 'Could not complete purchase');
				return;
			}
			Alert.alert('Purchased', `You bought "${book.title}" for ${formatPrice(book.price)}`);
			load();
		} catch (e) {
			console.warn('Buy error', e);
			Alert.alert('Error', e.message || 'Failed to buy book');
		}
	}

	return (
		<View style={{ flex: 1, backgroundColor: theme.colors.canvas }}>
			<FlatList
				data={books}
				keyExtractor={(i) => i.id}
				contentContainerStyle={{ padding: theme.spacing.lg }}
				refreshing={loading}
				onRefresh={load}
				renderItem={({ item }) => (
					<View style={{ padding: theme.spacing.md, backgroundColor: theme.colors.card, borderRadius: 8, marginBottom: theme.spacing.md }}>
						<Text style={{ ...theme.typography.h3 }}>{item.title}</Text>
						<Text style={{ ...theme.typography.body, marginTop: theme.spacing.xs }}>{item.author}</Text>
						{item.description ? <Text style={{ ...theme.typography.body, marginTop: theme.spacing.xs, color: theme.colors.muted }}>{item.description}</Text> : null}
						<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: theme.spacing.md }}>
							<Text style={{ ...theme.typography.h2 }}>{formatPrice(item.price)}</Text>
							<AppButton title={`Buy`} variant="activate" onPress={() => handleBuy(item)} />
						</View>
					</View>
				)}
				ListFooterComponent={() => (
					<View style={{ padding: theme.spacing.lg }}>
						<AppButton title="Sell a book" variant="activate" onPress={() => navigation.navigate('SellBook')} />
					</View>
				)}
			/>
		</View>
	);
}
