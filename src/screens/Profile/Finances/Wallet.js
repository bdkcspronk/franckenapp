import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useTheme } from '../../../theme';
import { useAuth } from '../../../contexts/AuthContext';
import MemberQRCode from '../../../components/MemberQRCode';
import AppButton from '../../../components/AppButton';
import { makeQrPayload, decodeQrPayload } from '../../../utils/qrPayload';

export default function WalletScreen() {
	const { user } = useAuth();
	const theme = useTheme();

	if (!user) return null;

	// numeric balance in cents (use `user.balance` if provided, otherwise fallback to 9099 cents = €90.99)
	const balanceCents = typeof user.balance === 'number' ? user.balance : 9099;

	const formatBalance = (cents) => {
		const v = cents / 100;
		try {
			return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(v);
		} catch (e) {
			return `€${v.toFixed(2)}`;
		}
	};

	// use hue interpolation (HSL) to keep saturation/lightness constant for vivid colors
	const hslToHex = (h, s, l) => {
		h = ((h % 360) + 360) % 360; // normalize
		s = Math.max(0, Math.min(1, s));
		l = Math.max(0, Math.min(1, l));
		const hueToRgb = (p, q, t) => {
			if (t < 0) t += 1;
			if (t > 1) t -= 1;
			if (t < 1 / 6) return p + (q - p) * 6 * t;
			if (t < 1 / 2) return q;
			if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
			return p;
		};
		let r, g, b;
		if (s === 0) {
			r = g = b = l; // achromatic
		} else {
			const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
			const p = 2 * l - q;
			const hk = h / 360;
			r = hueToRgb(p, q, hk + 1 / 3);
			g = hueToRgb(p, q, hk);
			b = hueToRgb(p, q, hk - 1 / 3);
		}
		const toHex = (n) => Math.round(n * 255).toString(16).padStart(2, '0');
		return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
	};

	// mapping: <= €2 => red (hue 0), >= €10 => green (hue 120)
	// amounts are in cents now: thresholds 200 and 1000 cents
	const redHue = 0;
	const greenHue = 120;
	const redCents = 200;
	const greenCents = 1000;
	const t = balanceCents <= redCents ? 0 : balanceCents >= greenCents ? 1 : (balanceCents - redCents) / (greenCents - redCents);
	const hue = redHue + (greenHue - redHue) * t;
	const saturation = 0.92; // high saturation for vivid colors
	const lightness = 0.5; // mid lightness for contrast
	const amountColor = hslToHex(hue, saturation, lightness);

	// Member card QR state and payload
	const [now, setNow] = useState(null);
	const TEST_SECRET = 'FRANCKEN1984';
	const payload = makeQrPayload(user.uid || user.email, TEST_SECRET, now);
	const decoded = decodeQrPayload(payload, TEST_SECRET);

	// sample/fake purchases for UI preview (amounts in cents)
	const samplePurchases = [
		{ id: 'p1', date: '2026-03-20', title: 'Pepsi Max', amount: -88 },
		{ id: 'p2', date: '2026-03-15', title: 'Noodles', amount: -40 },
		{ id: 'p3', date: '2026-02-28', title: 'Membership Fee 2026', amount: -500 },
		{ id: 'p4', date: '2026-01-10', title: 'Declaration Fraccie: Cups', amount: 212 },
	];

	return (
		<FlatList
			data={samplePurchases}
			keyExtractor={(i) => i.id}
			contentContainerStyle={{ padding: theme.spacing.xl }}
			ListHeaderComponent={() => (
				<>
					<View style={{ alignItems: 'center', marginBottom: theme.spacing.xl }}>
						<Text style={{ ...theme.typography.h2, marginBottom: theme.spacing.md }}>Member Card:</Text>
						<MemberQRCode memberId={user.uid || user.email} size={350} now={now} />
						<TouchableOpacity style={{ backgroundColor: theme.colors.activate, marginTop: theme.spacing.md, paddingVertical: theme.spacing.md, paddingHorizontal: theme.spacing.md, borderRadius: 6 }} onPress={() => setNow(new Date().toISOString())}>
								<Text style={{ color: theme.colors.textLight, ...theme.typography.label }}>Refresh QR</Text>
							</TouchableOpacity>
					</View>
					<View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: theme.spacing.xl }}>
						<Text style={{ ...theme.typography.h2 }}>Balance:</Text>
						<Text style={{ fontSize: 50, lineHeight: 80, color: amountColor, textAlign: 'center', fontWeight: '700' }}>{formatBalance(balanceCents)}</Text>
						<View>
							<AppButton title="Top up" variant="activate" onPress={() => alert('Top-up flow not implemented')} />
						</View>
					</View>

					<View style={{ marginBottom: theme.spacing.md }}>
						<Text style={{ ...theme.typography.h2, marginBottom: 0 }}>Recent Transactions</Text>
					</View>
				</>
			)}
			renderItem={({ item }) => (
				<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: theme.spacing.sm, borderBottomWidth: 1, borderBottomColor: theme.colors.surface }}>
					<View>
						<Text style={{ ...theme.typography.body, color: theme.colors.text }}>{item.title}</Text>
						<Text style={{ ...theme.typography.label, color: theme.colors.muted }}>{new Date(item.date).toLocaleDateString()}</Text>
					</View>
					<Text style={{ ...theme.typography.body, color: item.amount < 0 ? theme.colors.danger : theme.colors.activate }}>{formatBalance(item.amount)}</Text>
				</View>
			)}
			ListFooterComponent={() => (
				<View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: theme.spacing.md }}>
						<View style={{ marginTop: theme.spacing.xl }}>
						<AppButton title="All transactions" variant="activate" onPress={() => alert('Transaction details not implemented')} />
					</View>
				</View>
			)}
		/>
	);
}
