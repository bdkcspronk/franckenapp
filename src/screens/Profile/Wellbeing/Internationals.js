// Purpose: Provide practical information and tips for international students.
import React from 'react';
import { ScrollView, View, Text, Linking } from 'react-native';
import { useTheme } from '../../../theme';

export default function Internationals() {
  const theme = useTheme();
  const linkStyle = {
    ...theme.typography.body,
    color: theme.colors.primary,
    textDecorationLine: 'underline',
    marginTop: theme.spacing.sm,
  };

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: theme.spacing.xxl, paddingTop: theme.spacing.lg, paddingBottom: theme.spacing.xxl }}>
      <View>
        <Text style={{ ...theme.typography.body, marginTop: theme.spacing.md }}>
          The following tips and practical information were collected by the Intercie committee
          to help students starting their studies in Groningen. If you have further questions,
          contact the committee at{' '}
          <Text
            style={linkStyle}
            onPress={() => Linking.openURL('mailto:interciefrancken@gmail.com')}
            accessibilityRole="link"
          >
            interciefrancken@gmail.com
          </Text>
          .
        </Text>

        <Text style={{ ...theme.typography.h1, marginTop: theme.spacing.lg }}>Bank account</Text>
        <View style={{ height: 1, backgroundColor: theme.colors.muted, marginTop: theme.spacing.sm, marginBottom: theme.spacing.md }} />
        <Text style={{ ...theme.typography.body, marginTop: theme.spacing.md }}>
          To open a bank account choose a bank and make an appointment. Bring your BSN, a valid
          ID or passport, and if you are under 18, parental consent. Bank staff will guide you
          through the process.
        </Text>

        <Text style={{ ...theme.typography.h1, marginTop: theme.spacing.lg }}>BSN number</Text>
        <View style={{ height: 1, backgroundColor: theme.colors.muted, marginTop: theme.spacing.sm, marginBottom: theme.spacing.md }} />
        <Text style={{ ...theme.typography.body, marginTop: theme.spacing.md }}>
          Register at the gemeente to obtain a BSN. You should register within five days of
          moving to the Netherlands. Typical documents required: passport/ID, rental agreement
          (with landlord identity proof) and an English birth certificate. Non-EU students must
          show a residence permit or IND application letter before registering. You will receive
          your BSN a few weeks after applying.
        </Text>
        <Text style={{ ...theme.typography.body, marginTop: theme.spacing.md }}>
          Make an appointment here:{' '}
          <Text
            style={linkStyle}
            onPress={() => Linking.openURL('https://gemeente.groningen.nl/en/moving-netherlands')}
            accessibilityRole="link"
          >
            gemeente.groningen.nl
          </Text>
        </Text>

        <Text style={{ ...theme.typography.h1, marginTop: theme.spacing.lg }}>Housing information</Text>
        <View style={{ height: 1, backgroundColor: theme.colors.muted, marginTop: theme.spacing.sm, marginBottom: theme.spacing.md }} />
        <Text style={{ ...theme.typography.body, marginTop: theme.spacing.md }}>
          Finding long-term housing in Groningen can be challenging. Check the University housing
          pages for recommended resources, and consider signing up with Lefier for affordable
          student rooms (note waiting lists). The best period to search is around December–January.
        </Text>
        <Text style={{ ...theme.typography.body, marginTop: theme.spacing.md }}>
          Check for overcharging with the Groningen Studentenbond rent checker:{' '}
          <Text
            style={linkStyle}
            onPress={() => Linking.openURL('https://groningerstudentenbond.nl/huurcheck/')}
            accessibilityRole="link"
          >
            groningerstudentenbond.nl/huurcheck
          </Text>
        </Text>

        <Text style={{ ...theme.typography.h1, marginTop: theme.spacing.lg }}>Dutch lessons</Text>
        <View style={{ height: 1, backgroundColor: theme.colors.muted, marginTop: theme.spacing.sm, marginBottom: theme.spacing.md }} />
        <Text style={{ ...theme.typography.body, marginTop: theme.spacing.md }}>
          Dutch courses are available through the University and are free up to B1 level (you pay
          for course material). Classes are offered at multiple times; attendance requirements and
          language diplomas apply. For first-time enrolment visit the language centre in town.
        </Text>

        <Text style={{ ...theme.typography.h1, marginTop: theme.spacing.lg }}>Introduction camps & weeks</Text>
        <View style={{ height: 1, backgroundColor: theme.colors.muted, marginTop: theme.spacing.sm, marginBottom: theme.spacing.md }} />
        <Text style={{ ...theme.typography.body, marginTop: theme.spacing.md }}>
          Introduction events are a great way to meet fellow students: Pienterkamp (study intro),
          ESN introduction week for internationals, and KEI week for all new students. These events
          are social, team-based and a good way to familiarise yourself with the city and student life.
        </Text>

        <Text style={{ ...theme.typography.h1, marginTop: theme.spacing.lg }}>Health insurance</Text>
        <View style={{ height: 1, backgroundColor: theme.colors.muted, marginTop: theme.spacing.sm, marginBottom: theme.spacing.md }} />
        <Text style={{ ...theme.typography.body, marginTop: theme.spacing.md }}>
          EU students can use their national insurance. Non-EU students often use AON student
          insurance which offers different plans; prices start around €40/month depending on cover.
          The student doctor accepts EU and AON insurance and is conveniently located on campus.
          If you work and earn above certain thresholds you will need to take out Basic Health Insurance.
        </Text>

        <Text style={{ ...theme.typography.h1, marginTop: theme.spacing.lg }}>Job advice</Text>
        <View style={{ height: 1, backgroundColor: theme.colors.muted, marginTop: theme.spacing.sm, marginBottom: theme.spacing.md }} />
        <Text style={{ ...theme.typography.body, marginTop: theme.spacing.md }}>
          Working while studying is possible but rules differ for EU and non-EU students. Non-EU
          students usually have limited hours and additional visa requirements. Speak with the
          university career services or Intercie for up-to-date advice on work permits and benefits.
        </Text>

        <Text style={{ ...theme.typography.h1, marginTop: theme.spacing.lg }}>Sports membership (ACLO)</Text>
        <View style={{ height: 1, backgroundColor: theme.colors.muted, marginTop: theme.spacing.sm, marginBottom: theme.spacing.md }} />
        <Text style={{ ...theme.typography.body, marginTop: theme.spacing.md }}>
          ACLO offers sport memberships and courses; fees and booking are handled via your RUG account.
          Courses require a deposit refunded after sufficient attendance. See{' '}
          <Text
            style={linkStyle}
            onPress={() => Linking.openURL('http://www.aclosport.nl/en/')}
            accessibilityRole="link"
          >
            aclosport.nl/en
          </Text>
          .
        </Text>

        <Text style={{ ...theme.typography.h1, marginTop: theme.spacing.lg }}>Bikes</Text>
        <View style={{ height: 1, backgroundColor: theme.colors.muted, marginTop: theme.spacing.sm, marginBottom: theme.spacing.md }} />
        <Text style={{ ...theme.typography.body, marginTop: theme.spacing.md }}>
          Buy a bike from a shop, Marktplaats, Facebook groups, or use Swapfiets for a monthly plan.
          Avoid very cheap offers in the city (possibly stolen). Always keep lights for night cycling.
        </Text>

        <Text style={{ ...theme.typography.h1, marginTop: theme.spacing.lg }}>Dutch SIM</Text>
        <View style={{ height: 1, backgroundColor: theme.colors.muted, marginTop: theme.spacing.sm, marginBottom: theme.spacing.md }} />
        <Text style={{ ...theme.typography.body, marginTop: theme.spacing.md }}>
          Choose a provider (Vodafone, KPN, Tele2, etc.) for a prepaid or subscription SIM. Subscriptions
          typically require a Dutch bank account; prepaid is easiest to start with.
        </Text>

        <Text style={{ ...theme.typography.h1, marginTop: theme.spacing.lg }}>Transportation</Text>
        <View style={{ height: 1, backgroundColor: theme.colors.muted, marginTop: theme.spacing.sm, marginBottom: theme.spacing.md }} />
        <Text style={{ ...theme.typography.body, marginTop: theme.spacing.md }}>
          An OV-chipkaart is a cost-effective way to travel across the Netherlands. For cheap advance
          train tickets check{' '}
          <Text
            style={linkStyle}
            onPress={() => Linking.openURL('https://www.vakantieveilingen.nl/')}
            accessibilityRole="link"
          >
            vakantieveilingen.nl
          </Text>
          . A personal OV-chipkaart may require a BSN.
        </Text>

        <Text style={{ ...theme.typography.h1, marginTop: theme.spacing.lg }}>Contact</Text>
        <View style={{ height: 1, backgroundColor: theme.colors.muted, marginTop: theme.spacing.sm, marginBottom: theme.spacing.md }} />
        <Text style={{ ...theme.typography.body, marginTop: theme.spacing.md }}>
          For further questions contact the Intercie at{' '}
          <Text
            style={linkStyle}
            onPress={() => Linking.openURL('mailto:interciefrancken@gmail.com')}
            accessibilityRole="link"
          >
            interciefrancken@gmail.com
          </Text>
          . For urgent housing help or temporary accommodation reach out via the contact details
          provided by the committee.
        </Text>
      </View>
    </ScrollView>
  );
}
