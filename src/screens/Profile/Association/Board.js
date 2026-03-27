// Purpose: Display current board members and contact information.
import React from 'react';
import { View, Text, FlatList, Image, ImageBackground, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../theme';

const board = [
	{ id: 'b1', role: 'President\n& Commissioner of Educational Affairs', name: 'Emily Geekie', photo: require('../../../../assets/board/flux/emily.jpg') },
	{ id: 'b2', role: 'Secretary\n& Commissioner of Internal Relations', name: 'Zoltán Hermann', photo: require('../../../../assets/board/flux/zoltan.jpg') },
	{ id: 'b3', role: 'Treasurer', name: 'Emma Robertson', photo: require('../../../../assets/board/flux/emma.jpg') },
	{ id: 'b4', role: 'Commissioner of External Relations\n& Vice-President', name: 'Solène van der Schot', photo: require('../../../../assets/board/flux/solene.jpg') },
];

// Banner image used for the top banner
const bannerImg = require('../../../../assets/board/flux/banner.jpg');

export default function BoardScreen() {
	const theme = useTheme();
	const insets = useSafeAreaInsets();
	return (
		<View style={{ flex:1, padding: theme.spacing.xxl }}>
			<Text style={{ ...theme.typography.h1, color: theme.colors.textDark, marginBottom: theme.spacing.sm, textAlign: 'center' }}>2025-2026</Text>
			<ImageBackground
				source={bannerImg}
				style={{ width: '100%', aspectRatio: 16 / 9, borderRadius: 12, overflow: 'hidden', marginBottom: theme.spacing.lg }}
				imageStyle={{ borderRadius: 12 }}
				resizeMode="cover"
			>
				<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
					<Text style={{ ...theme.typography.h1, color: theme.colors.textLight, fontSize: 36 }}>'Flux'</Text>
				</View>
			</ImageBackground>

			<FlatList
				data={board}
				keyExtractor={(i) => i.id}
				contentContainerStyle={{ paddingBottom: insets.bottom + theme.spacing.xl + 12 }}
				renderItem={({ item }) => (
					<View style={{ padding: theme.spacing.md }}>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<Image source={item.photo} style={{ width: 72, height: 72, borderRadius: 36, marginRight: theme.spacing.md }} />
							<View style={{ flex: 1 }}>
								<Text style={theme.typography.h2}>{item.role}</Text>
								<Text style={theme.typography.body}>{item.name}</Text>
							</View>
						</View>
					</View>
				)}
			/>

			<TouchableOpacity
				activeOpacity={0.85}
				onPress={() => alert('Not implemented yet')}
				style={{
					position: 'absolute',
					left: theme.spacing.lg,
					right: theme.spacing.lg,
					bottom: insets.bottom + theme.spacing.md,
					backgroundColor: theme.colors.activate,
					paddingVertical: theme.spacing.md,
					borderRadius: 10,
					alignItems: 'center',
				}}
			>
				<Text style={{ color: theme.colors.textLight, ...theme.typography.label }}>Previous boards coming soon!</Text>
			</TouchableOpacity>
		</View>
	);
}

