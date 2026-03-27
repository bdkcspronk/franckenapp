// Purpose: Display event photo albums and image placeholders.
import React from 'react';
import { View, Text, ScrollView, Image, Dimensions } from 'react-native';
import { useTheme } from '../../../theme';

const placeholder = [
	'https://via.placeholder.com/300x200.png?text=Photo+1',
	'https://via.placeholder.com/300x200.png?text=Photo+2',
	'https://via.placeholder.com/300x200.png?text=Photo+3',
	'https://via.placeholder.com/300x200.png?text=Photo+4',
	'https://via.placeholder.com/300x200.png?text=Photo+5',
	'https://via.placeholder.com/300x200.png?text=Photo+6',
];

export default function PhotosScreen() {
	const theme = useTheme();
	const width = Dimensions.get('window').width / 2 - 24;

	return (
		<ScrollView style={{ flex:1, padding: theme.spacing.lg }}>
			<Text style={theme.typography.h2}>Photos</Text>
			<Text style={{ ...theme.typography.body, marginTop: theme.spacing.sm }}>Albums from past events (placeholder).</Text>

			<View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: theme.spacing.sm, justifyContent: 'space-between' }}>
				{placeholder.map((uri, idx) => (
					<Image key={idx} source={{ uri }} style={{ width, height: 120, marginBottom: theme.spacing.sm, borderRadius: 8 }} />
				))}
			</View>
		</ScrollView>
	);
}
