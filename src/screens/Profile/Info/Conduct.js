// Purpose: Display the Code of Conduct and related procedures.
import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import { useTheme } from '../../../theme';

export default function ConductScreen() {
	const theme = useTheme();

	return (
		<ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: theme.spacing.xxl, paddingTop: theme.spacing.lg, paddingBottom: theme.spacing.xxl }}>
			<View>
				<Text style={{ ...theme.typography.h1 }}>1. Introduction</Text>
				<View style={{ height: 1, backgroundColor: theme.colors.muted, marginTop: theme.spacing.sm, marginBottom: theme.spacing.md }} />
				<Text style={{ ...theme.typography.h3, marginTop: theme.spacing.sm }}>
					This is the Code of Conduct of Study Association T.F.V. ‘Professor Francken’. As a social
					organisation we aim to ensure that all members feel safe and comfortable. This document
					sets out behaviour expectations for board members, members and participants at
					activities held in the Francken room and at external locations.
				</Text>

				<Text style={{ ...theme.typography.body, marginTop: theme.spacing.sm }}>
					If you see or experience any issues at the Francken room or at a Francken event (on or off
					campus), please inform the board so that action can be taken. Email the board at
					professorfrancken@gmail.com, or speak to them at the event. If you prefer not to speak to a
					board member, contact the confidential persons at confidential.persons.francken@gmail.com,
					or the advisory board at franckenadvisoryboard@gmail.com.
				</Text>

				<Text style={{ ...theme.typography.h2, marginTop: theme.spacing.md }}>Who this applies to</Text>
				<View style={{ height: 1, backgroundColor: theme.colors.muted, marginTop: theme.spacing.xs, marginBottom: theme.spacing.md }} />
				<Text style={{ ...theme.typography.body, marginTop: theme.spacing.sm }}>
					This Code applies to:
				</Text>
				<View style={{ marginTop: theme.spacing.sm, paddingLeft: theme.spacing.md }}>
					<Text style={theme.typography.body}>• Active board members of T.F.V. ‘Professor Francken’</Text>
					<Text style={{ ...theme.typography.body, marginTop: theme.spacing.xs }}>• Members of T.F.V. ‘Professor Francken’</Text>
					<Text style={{ ...theme.typography.body, marginTop: theme.spacing.xs }}>• Participants in activities organised by the association</Text>
				</View>

				<Text style={{ ...theme.typography.h1, marginTop: theme.spacing.lg }}>2. Principles</Text>
				<View style={{ height: 1, backgroundColor: theme.colors.muted, marginTop: theme.spacing.sm, marginBottom: theme.spacing.md }} />
				<View style={{ marginTop: theme.spacing.sm, paddingLeft: theme.spacing.md }}>
					<Text style={theme.typography.body}>• <Text style={{ fontWeight: '700' }}>Respect:</Text> Treat others and their belongings with consideration.</Text>
					<Text style={{ ...theme.typography.body, marginTop: theme.spacing.xs }}>• <Text style={{ fontWeight: '700' }}>Moral behaviour:</Text> Act with integrity, fairness and honesty.</Text>
					<Text style={{ ...theme.typography.body, marginTop: theme.spacing.xs }}>• <Text style={{ fontWeight: '700' }}>Inclusivity:</Text> Help create an environment where everyone feels welcome (e.g. prefer English in the common room and events).</Text>
					<Text style={{ ...theme.typography.body, marginTop: theme.spacing.xs }}>• <Text style={{ fontWeight: '700' }}>Responsibility:</Text> Be accountable for your actions and consume alcohol responsibly.</Text>
				</View>

				<Text style={{ ...theme.typography.h1, marginTop: theme.spacing.lg }}>3. Sanctions</Text>
				<View style={{ height: 1, backgroundColor: theme.colors.muted, marginTop: theme.spacing.sm, marginBottom: theme.spacing.md }} />
				<Text style={{ ...theme.typography.body, marginTop: theme.spacing.sm }}>
					Sanctions depend on the severity of the incident and may include:
				</Text>
				<View style={{ marginTop: theme.spacing.sm, paddingLeft: theme.spacing.md }}>
					<Text style={theme.typography.body}>• An official warning</Text>
					<Text style={{ ...theme.typography.body, marginTop: theme.spacing.xs }}>• Temporary suspension from alcohol at events</Text>
					<Text style={{ ...theme.typography.body, marginTop: theme.spacing.xs }}>• Suspension from activities or the Francken room</Text>
					<Text style={{ ...theme.typography.body, marginTop: theme.spacing.xs }}>• In extreme cases: discharge from T.F.V. ‘Professor Francken’</Text>
				</View>

				<Text style={{ ...theme.typography.h1, marginTop: theme.spacing.lg }}>4. Social conduct</Text>
				<View style={{ height: 1, backgroundColor: theme.colors.muted, marginTop: theme.spacing.sm, marginBottom: theme.spacing.md }} />
				<Text style={{ ...theme.typography.body, marginTop: theme.spacing.sm }}>
					Unacceptable behaviour will not be tolerated. Examples include (but are not limited to):
				</Text>
				<View style={{ marginTop: theme.spacing.sm, paddingLeft: theme.spacing.md }}>
					<Text style={theme.typography.body}>• Insulting or derogatory comments, harassment</Text>
					<Text style={{ ...theme.typography.body, marginTop: theme.spacing.xs }}>• Intimidating, discriminatory or demeaning conduct</Text>
					<Text style={{ ...theme.typography.body, marginTop: theme.spacing.xs }}>• Offensive comments about gender, orientation, race, religion, disability, etc.</Text>
					<Text style={{ ...theme.typography.body, marginTop: theme.spacing.xs }}>• Disrupting talks or disrespecting organisers</Text>
					<Text style={{ ...theme.typography.body, marginTop: theme.spacing.xs }}>• Publishing others’ private information without permission</Text>
					<Text style={{ ...theme.typography.body, marginTop: theme.spacing.xs }}>• Promotion of drugs or alcohol on campus</Text>
				</View>

				<Text style={{ ...theme.typography.h1, marginTop: theme.spacing.lg }}>5. Use of alcohol</Text>
				<View style={{ height: 1, backgroundColor: theme.colors.muted, marginTop: theme.spacing.sm, marginBottom: theme.spacing.md }} />
				<View style={{ marginTop: theme.spacing.sm, paddingLeft: theme.spacing.md }}>
					<Text style={theme.typography.body}>• No alcohol served to persons under 18</Text>
					<Text style={{ ...theme.typography.body, marginTop: theme.spacing.xs }}>• No self-brought alcoholic beverages in the Francken room</Text>
					<Text style={{ ...theme.typography.body, marginTop: theme.spacing.xs }}>• Bought alcoholic beverages may not be consumed on campus outside the Francken room (exceptions for off-site activities)</Text>
					<Text style={{ ...theme.typography.body, marginTop: theme.spacing.xs }}>• Only low-alcohol beverages (&lt;15%) are permitted</Text>
					<Text style={{ ...theme.typography.body, marginTop: theme.spacing.xs }}>• No alcohol before 16:00</Text>
				</View>

				<Text style={{ ...theme.typography.h1, marginTop: theme.spacing.lg }}>6. Smoking & vaping</Text>
				<View style={{ height: 1, backgroundColor: theme.colors.muted, marginTop: theme.spacing.sm, marginBottom: theme.spacing.md }} />
				<Text style={{ ...theme.typography.body, marginTop: theme.spacing.sm }}>
					Smoking or vaping is not allowed on university premises. Members found smoking or vaping on campus will be asked to stop.
				</Text>

				<Text style={{ ...theme.typography.h1, marginTop: theme.spacing.lg }}>7. Use of drugs</Text>
				<View style={{ height: 1, backgroundColor: theme.colors.muted, marginTop: theme.spacing.sm, marginBottom: theme.spacing.md }} />
				<Text style={{ ...theme.typography.body, marginTop: theme.spacing.sm }}>
					Possession or use of substances that are illegal in the Netherlands is strictly prohibited at the Francken room and at activities. Medical use with documentation is an exception. Violations may lead to suspension and other sanctions; legal and financial consequences are the responsibility of the participant.
				</Text>

				<Text style={{ ...theme.typography.h1, marginTop: theme.spacing.lg }}>8. Property</Text>
				<View style={{ height: 1, backgroundColor: theme.colors.muted, marginTop: theme.spacing.sm, marginBottom: theme.spacing.md }} />
				<Text style={{ ...theme.typography.body, marginTop: theme.spacing.sm }}>
					Respect shared property. Deliberate damage should be compensated after discussion with the board. For accidental damage, discuss with the board to agree on suitable actions. Breaking a mug incurs a €5 fine.
				</Text>

				<Text style={{ ...theme.typography.h1, marginTop: theme.spacing.lg }}>9. Collection</Text>
				<View style={{ height: 1, backgroundColor: theme.colors.muted, marginTop: theme.spacing.sm, marginBottom: theme.spacing.md }} />
				<Text style={{ ...theme.typography.body, marginTop: theme.spacing.md }}>
					If collection attempts are declined repeatedly, fines may be imposed and certain privileges suspended until outstanding debts are settled. For questions about collections contact the treasurer at treasurer@professorfrancken.nl.
				</Text>
			</View>
		</ScrollView>
	);
}
