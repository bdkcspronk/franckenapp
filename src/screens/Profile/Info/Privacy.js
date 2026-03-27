// Purpose: Explain data storage and privacy practices to members.
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useTheme } from '../../../theme';

export default function PrivacyScreen() {
	const theme = useTheme();
	return (
		<ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: theme.spacing.xxl, paddingTop: theme.spacing.lg, paddingBottom: theme.spacing.xxl }}>
			
			<Text style={{ ...theme.typography.body, marginTop: theme.spacing.md }}>
				Your data at T.F.V. 'Professor Francken'
			</Text>

			<Text style={{ ...theme.typography.body, marginTop: theme.spacing.sm }}>
				When you become a member of our association by filling in the registration form (either a physical form or on
				our website), you give us permission to store and process your personal information. We will keep this data
				until you resign as a member unless specified otherwise in this document.
			</Text>

			<Text style={{ ...theme.typography.h3, marginTop: theme.spacing.lg }}>What data we store and why</Text>
			<View style={{ height: 1, backgroundColor: theme.colors.muted, marginTop: theme.spacing.sm, marginBottom: theme.spacing.md }} />

			<Text style={{ ...theme.typography.body, marginTop: theme.spacing.md }}>
				This section describes the personal information of our members that we store. Only board members and members of
				the compucie (the committee responsible for maintaining our digital facilities) have direct access to this data.
				Sometimes a committee will request the names and email addresses of participants for an activity; in such cases
				the board decides whether the data may be shared.
			</Text>

			<Text style={{ ...theme.typography.h3, marginTop: theme.spacing.lg }}>Personal information</Text>
			<View style={{ height: 1, backgroundColor: theme.colors.muted, marginTop: theme.spacing.sm, marginBottom: theme.spacing.md }} />

			<Text style={{ ...theme.typography.body, marginTop: theme.spacing.md }}>
				We store first and family names, birthdate, gender and nationality. Gender and nationality are used only for
				anonymised statistics (for example male/female or national/international ratios). We will not share personal
				information with third parties without your explicit consent. Aggregated statistics may be shared with the
				University of Groningen and partner organisations.
			</Text>

			<Text style={{ ...theme.typography.h3, marginTop: theme.spacing.lg }}>Contact information</Text>
			<View style={{ height: 1, backgroundColor: theme.colors.muted, marginTop: theme.spacing.sm, marginBottom: theme.spacing.md }} />

			<Text style={{ ...theme.typography.body, marginTop: theme.spacing.md }}>
				To contact members we keep the following contact details. You may opt in to share some of these when registering.
			</Text>

			<View style={{ marginTop: theme.spacing.sm, paddingLeft: theme.spacing.md }}>
				<Text style={{ ...theme.typography.body }}>• <Text style={{ fontWeight: '700' }}>Email address:</Text> Used for newsletters, invitations and activity communication. Participant emails may be shared with organising committees when required for an activity.</Text>
				<Text style={{ ...theme.typography.body, marginTop: theme.spacing.xs }}>• <Text style={{ fontWeight: '700' }}>Home address:</Text> Used to send a physical copy of our magazine (Francken Vrij) or promotional material if you opted in.</Text>
				<Text style={{ ...theme.typography.body, marginTop: theme.spacing.xs }}>• <Text style={{ fontWeight: '700' }}>Phone number:</Text> Occasionally used to contact you about sign-ups or attendance at events.</Text>
			</View>

			<Text style={{ ...theme.typography.h3, marginTop: theme.spacing.lg }}>Study information</Text>
			<View style={{ height: 1, backgroundColor: theme.colors.muted, marginTop: theme.spacing.sm, marginBottom: theme.spacing.md }} />

			<Text style={{ ...theme.typography.body, marginTop: theme.spacing.md }}>
				We store your student number and study information. These are used for administration and anonymised statistics
				that may be shared with partners.
			</Text>

			<Text style={{ ...theme.typography.h3, marginTop: theme.spacing.lg }}>Photos</Text>
			<View style={{ height: 1, backgroundColor: theme.colors.muted, marginTop: theme.spacing.sm, marginBottom: theme.spacing.md }} />

			<Text style={{ ...theme.typography.body, marginTop: theme.spacing.md }}>
				Photos taken at our activities are stored on our server and may be published on our website after review. Members
				can request photo removal by contacting the Fotocie or the board.
			</Text>

			<Text style={{ ...theme.typography.h3, marginTop: theme.spacing.lg }}>Circumstantial information</Text>
			<View style={{ height: 1, backgroundColor: theme.colors.muted, marginTop: theme.spacing.sm, marginBottom: theme.spacing.md }} />

			<Text style={{ ...theme.typography.body, marginTop: theme.spacing.md }}>
				For some activities we may request additional documents or information:
			</Text>

			<View style={{ marginTop: theme.spacing.sm, paddingLeft: theme.spacing.md }}>
				<Text style={{ ...theme.typography.body }}>• <Text style={{ fontWeight: '700' }}>Curriculum vitae (CV):</Text> Required for selection-based activities; CVs are deleted within four weeks after the activity unless otherwise stated.</Text>
				<Text style={{ ...theme.typography.body, marginTop: theme.spacing.xs }}>• <Text style={{ fontWeight: '700' }}>Identification documents:</Text> For excursions we may request a copy of an ID (passport, ID card or driving licence). Use KopieId where possible; digital copies are stored securely and deleted within four weeks after the excursion unless legal retention is required.</Text>
			</View>

			<Text style={{ ...theme.typography.h3, marginTop: theme.spacing.lg }}>Finances</Text>
			<View style={{ height: 1, backgroundColor: theme.colors.muted, marginTop: theme.spacing.sm, marginBottom: theme.spacing.md }} />

			<Text style={{ ...theme.typography.body, marginTop: theme.spacing.md }}>
				We store IBAN details and transaction records required for membership administration, canteen (streepsystem)
				purchases, deductions and declarations. Where required by law, financial records are retained for at least seven years.
			</Text>

			<View style={{ marginTop: theme.spacing.md, paddingLeft: theme.spacing.md }}>
				<Text style={{ ...theme.typography.body }}>• <Text style={{ fontWeight: '700' }}>Canteen (streepsystem):</Text> Optional opt-in to track purchases and deduct costs.</Text>
				<Text style={{ ...theme.typography.body, marginTop: theme.spacing.xs }}>• <Text style={{ fontWeight: '700' }}>Deductions & Declarations:</Text> Documented for accounting and tax purposes.</Text>
			</View>

			<Text style={{ ...theme.typography.h3, marginTop: theme.spacing.lg }}>Sponsorship and advertisements</Text>
			<View style={{ height: 1, backgroundColor: theme.colors.muted, marginTop: theme.spacing.sm, marginBottom: theme.spacing.md }} />

			<Text style={{ ...theme.typography.body, marginTop: theme.spacing.md }}>
				We may send sponsor-related communications. We do not share personal data with sponsors unless you have given explicit permission.
			</Text>

			<Text style={{ ...theme.typography.h3, marginTop: theme.spacing.lg }}>Third parties & services</Text>
			<View style={{ height: 1, backgroundColor: theme.colors.muted, marginTop: theme.spacing.sm, marginBottom: theme.spacing.md }} />

			<Text style={{ ...theme.typography.body, marginTop: theme.spacing.md }}>
				We only share personal data with third parties as described in this policy or with your explicit consent. When sharing data we ensure that both our and the recipient's privacy policies apply.
			</Text>

			<View style={{ marginTop: theme.spacing.md, paddingLeft: theme.spacing.md }}>
				<Text style={{ ...theme.typography.body }}>• <Text style={{ fontWeight: '700' }}>Google Analytics:</Text> Used for website traffic analysis on https://professorfrancken.nl.</Text>
				<Text style={{ ...theme.typography.body, marginTop: theme.spacing.xs }}>• <Text style={{ fontWeight: '700' }}>Mailchimp:</Text> Used for newsletters; only name and email are shared when necessary.</Text>
				<Text style={{ ...theme.typography.body, marginTop: theme.spacing.xs }}>• <Text style={{ fontWeight: '700' }}>Affiliated organisations:</Text> We collaborate with organisations (e.g., BEST, Expedition Strategy, Beta Business Days) and do not share personal data with them without permission.</Text>
			</View>

			<Text style={{ ...theme.typography.h3, marginTop: theme.spacing.lg }}>Data storage</Text>
			<View style={{ height: 1, backgroundColor: theme.colors.muted, marginTop: theme.spacing.sm, marginBottom: theme.spacing.md }} />

			<Text style={{ ...theme.typography.body, marginTop: theme.spacing.md }}>
				Digital data is stored on a server at the University of Groningen. Daily backups are made (on-site and off-site, encrypted).
				Physical registration forms are archived where required.
			</Text>

			<Text style={{ ...theme.typography.h3, marginTop: theme.spacing.lg }}>List of data we store</Text>
			<View style={{ height: 1, backgroundColor: theme.colors.muted, marginTop: theme.spacing.sm, marginBottom: theme.spacing.md }} />

			<View style={{ marginTop: theme.spacing.md, paddingLeft: theme.spacing.md }}>
				<Text style={{ ...theme.typography.body }}>• First and family names</Text>
				<Text style={{ ...theme.typography.body, marginTop: theme.spacing.xs }}>• Birthdate</Text>
				<Text style={{ ...theme.typography.body, marginTop: theme.spacing.xs }}>• Gender</Text>
				<Text style={{ ...theme.typography.body, marginTop: theme.spacing.xs }}>• Nationality</Text>
				<Text style={{ ...theme.typography.body, marginTop: theme.spacing.xs }}>• Email address</Text>
				<Text style={{ ...theme.typography.body, marginTop: theme.spacing.xs }}>• Home address (optional)</Text>
				<Text style={{ ...theme.typography.body, marginTop: theme.spacing.xs }}>• Phone number (optional)</Text>
				<Text style={{ ...theme.typography.body, marginTop: theme.spacing.xs }}>• Student number</Text>
				<Text style={{ ...theme.typography.body, marginTop: theme.spacing.xs }}>• Current study</Text>
				<Text style={{ ...theme.typography.body, marginTop: theme.spacing.xs }}>• IBAN (optional)</Text>
				<Text style={{ ...theme.typography.body, marginTop: theme.spacing.xs }}>• Canteen transactions (optional)</Text>
				<Text style={{ ...theme.typography.body, marginTop: theme.spacing.xs }}>• Financial transactions (optional)</Text>
				<Text style={{ ...theme.typography.body, marginTop: theme.spacing.xs }}>• Activity attendance (optional)</Text>
				<Text style={{ ...theme.typography.body, marginTop: theme.spacing.xs }}>• Photos (optional)</Text>
				<Text style={{ ...theme.typography.body, marginTop: theme.spacing.xs }}>• Any additional information you have allowed us to store</Text>
			</View>
		</ScrollView>
	);
}
