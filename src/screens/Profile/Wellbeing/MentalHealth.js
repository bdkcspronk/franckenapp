// Purpose: Show mental health resources and contact info.
import React from 'react';
import { ScrollView, View, Text, Linking } from 'react-native';
import { useTheme } from '../../../theme';

export default function MentalHealth() {
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
          This page contains links to university services for stress, study-delay concerns, or to
          speak with a professional. We also share tips for looking after your mental health,
          present relevant research, and describe what the association is doing to support
          members. Information about Francken's confidential contact persons is available below.
        </Text>

        <Text style={{ ...theme.typography.h1, marginTop: theme.spacing.lg }}>Ways to reach university services</Text>
        <View style={{ height: 1, backgroundColor: theme.colors.muted, marginTop: theme.spacing.sm, marginBottom: theme.spacing.md }} />
        <Text style={{ ...theme.typography.body, marginTop: theme.spacing.md }}>
          Many students encounter life or study challenges during their degree: stress, anxiety,
          identity questions or depressive feelings. The Student Service Centre (SSC) provides
          psychologists, trainers, and student counsellors who can help with:
        </Text>
        <View style={{ marginTop: theme.spacing.sm, paddingLeft: theme.spacing.md }}>
          <Text style={theme.typography.body}>• Psychological support and counselling</Text>
          <Text style={{ ...theme.typography.body, marginTop: theme.spacing.xs }}>• Courses and workshops (study skills, stress management, self-discipline)</Text>
          <Text style={{ ...theme.typography.body, marginTop: theme.spacing.xs }}>• Advice on study delay, special arrangements and (financial) support</Text>
        </View>
        <Text style={{ ...theme.typography.body, marginTop: theme.spacing.sm }}>
          More information on student wellbeing and available support at the University of Groningen
          can be found via the Student Service Centre.
        </Text>

        <Text style={{ ...theme.typography.h1, marginTop: theme.spacing.lg }}>Mental health care</Text>
        <View style={{ height: 1, backgroundColor: theme.colors.muted, marginTop: theme.spacing.sm, marginBottom: theme.spacing.md }} />
        <View style={{ marginTop: theme.spacing.md, paddingLeft: theme.spacing.md }}>
          <Text style={theme.typography.body}>• Information on mental health care in the Netherlands</Text>
          <Text style={{ ...theme.typography.body, marginTop: theme.spacing.xs }}>• How to access mental health care in the Netherlands</Text>
        </View>

        <Text style={{ ...theme.typography.h1, marginTop: theme.spacing.lg }}>Mental health at Francken</Text>
        <View style={{ height: 1, backgroundColor: theme.colors.muted, marginTop: theme.spacing.sm, marginBottom: theme.spacing.md }} />
          <Text style={{ ...theme.typography.body, marginTop: theme.spacing.md }}>
          Francken has Confidential Contact Persons (CCPs) who have received training for this
          role. They are available to talk about stress, problems within the association, or
          personal struggles. CCPs provide a listening ear and are approachable at events or by
          email.
        </Text>
        <Text style={{ ...theme.typography.body, marginTop: theme.spacing.md }}>
          General contact:{' '}
          <Text
            style={linkStyle}
            onPress={() => Linking.openURL('mailto:confidential.persons.francken@gmail.com')}
            accessibilityRole="link"
          >
            confidential.persons.francken@gmail.com
          </Text>
        </Text>
        <Text style={{ ...theme.typography.body, marginTop: theme.spacing.sm }}>
          Individual contacts (if you prefer to reach one person directly):
        </Text>
        <View style={{ marginTop: theme.spacing.md, paddingLeft: theme.spacing.md }}>
          <Text style={theme.typography.body}>• Csilla Tijssen —{' '}
            <Text
              style={linkStyle}
              onPress={() => Linking.openURL('mailto:csilla.confidential.person@gmail.com')}
              accessibilityRole="link"
            >
              csilla.confidential.person@gmail.com
            </Text>
          </Text>
          <Text style={{ ...theme.typography.body, marginTop: theme.spacing.xs }}>• Maud Smit —{' '}
            <Text
              style={linkStyle}
              onPress={() => Linking.openURL('mailto:maud.confidential.person@gmail.com')}
              accessibilityRole="link"
            >
              maud.confidential.person@gmail.com
            </Text>
          </Text>
          <Text style={{ ...theme.typography.body, marginTop: theme.spacing.xs }}>• Tim van de Vendel —{' '}
            <Text
              style={linkStyle}
              onPress={() => Linking.openURL('mailto:tim.confidential.person@gmail.com')}
              accessibilityRole="link"
            >
              tim.confidential.person@gmail.com
            </Text>
          </Text>
        </View>

        <Text style={{ ...theme.typography.h1, marginTop: theme.spacing.lg }}>Meet the confidential contact persons</Text>
        <Text style={{ ...theme.typography.body, marginTop: theme.spacing.md }}>
          Feel free to approach the CCPs in person at events or in the Francken room. Below are short
          introductions and placeholders for their photos.
        </Text>

        {/* Person cards with image placeholders */}
        <View style={{ marginTop: theme.spacing.lg }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.md }}>
            <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: theme.colors.surface, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={theme.typography.body}>Photo</Text>
            </View>
            <View style={{ marginLeft: theme.spacing.md, flex: 1 }}>
              <Text style={{ ...theme.typography.h3 }}>Csilla Tijssen</Text>
              <View style={{ height: 1, backgroundColor: theme.colors.muted, marginTop: theme.spacing.xs, marginBottom: theme.spacing.sm }} />
              <Text style={{ ...theme.typography.body, marginTop: theme.spacing.xs }}>Fifth-year Astronomy student. Active in multiple committees. Happy to listen and help — Contact: csilla.confidential.person@gmail.com.</Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.md }}>
            <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: theme.colors.surface, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={theme.typography.body}>Photo</Text>
            </View>
            <View style={{ marginLeft: theme.spacing.md, flex: 1 }}>
              <Text style={{ ...theme.typography.h3 }}>Maud Smit</Text>
              <View style={{ height: 1, backgroundColor: theme.colors.muted, marginTop: theme.spacing.xs, marginBottom: theme.spacing.sm }} />
              <Text style={{ ...theme.typography.body, marginTop: theme.spacing.xs }}>Second-year Astronomy student. Enjoys sports and creative activities. Reachable: maud.confidential.person@gmail.com.</Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: theme.colors.surface, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={theme.typography.body}>Photo</Text>
            </View>
            <View style={{ marginLeft: theme.spacing.md, flex: 1 }}>
              <Text style={{ ...theme.typography.h3 }}>Tim van de Vendel</Text>
              <View style={{ height: 1, backgroundColor: theme.colors.muted, marginTop: theme.spacing.xs, marginBottom: theme.spacing.sm }} />
              <Text style={{ ...theme.typography.body, marginTop: theme.spacing.xs }}>Physics student and long-time Francken member. Available for conversation and support — Contact: tim.confidential.person@gmail.com.</Text>
            </View>
          </View>
        </View>

        <Text style={{ ...theme.typography.h1, marginTop: theme.spacing.lg }}>External partner — Wake Up Student</Text>
        <View style={{ height: 1, backgroundColor: theme.colors.muted, marginTop: theme.spacing.sm, marginBottom: theme.spacing.md }} />
        <Text style={{ ...theme.typography.body, marginTop: theme.spacing.md }}>
          Wake Up Student offers psychological guidance and coaching for students, covering common
          challenges such as psychological complaints, study choice, study skills, and balancing
          student life. Members are entitled to a free first consultation. Make an appointment via{' '}
          <Text
            style={linkStyle}
            onPress={() => Linking.openURL('https://www.wakeupstudent.nl')}
            accessibilityRole="link"
          >
            wakeupstudent.nl
          </Text>
          {' '}or email{' '}
          <Text
            style={linkStyle}
            onPress={() => Linking.openURL('mailto:info@wakeupstudent.nl')}
            accessibilityRole="link"
          >
            info@wakeupstudent.nl
          </Text>
          .
        </Text>

      </View>
    </ScrollView>
  );
}
