// Purpose: Explain sustainability efforts and provide contact details.
import React from 'react';
import { ScrollView, View, Text, Linking } from 'react-native';
import { useTheme } from '../../../theme';

export default function Sustainability() {
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
          The use of fossil fuels and polluting materials risks making our planet less habitable and
          reducing the quality of life for future generations. Organisations across government,
          industry and academia are therefore working to enable sustainable lifestyles that meet
          present needs without compromising the ability of future generations to meet theirs.
        </Text>

        <Text style={{ ...theme.typography.h1, marginTop: theme.spacing.lg }}>University context</Text>
        <View style={{ height: 1, backgroundColor: theme.colors.muted, marginTop: theme.spacing.sm, marginBottom: theme.spacing.md }} />
        <Text style={{ ...theme.typography.body, marginTop: theme.spacing.md }}>
          The University of Groningen has adopted sustainability as a core value. The University’s Green
          Office coordinates sustainable projects across campus and has published a Sustainability Roadmap
          outlining goals and focus areas for the coming years.
        </Text>

        <Text style={{ ...theme.typography.h1, marginTop: theme.spacing.lg }}>Our role as a study association</Text>
        <View style={{ height: 1, backgroundColor: theme.colors.muted, marginTop: theme.spacing.sm, marginBottom: theme.spacing.md }} />
        <Text style={{ ...theme.typography.body, marginTop: theme.spacing.md }}>
          As a study association, we aim to make our activities and operations more sustainable while
          respecting valued traditions. We also seek to inspire and support members to learn about
          sustainability and adopt greener habits.
        </Text>

        <Text style={{ ...theme.typography.h1, marginTop: theme.spacing.lg }}>Initiatives & responsibilities</Text>
        <View style={{ height: 1, backgroundColor: theme.colors.muted, marginTop: theme.spacing.sm, marginBottom: theme.spacing.md }} />
        <Text style={{ ...theme.typography.body, marginTop: theme.spacing.md }}>
          Francken participates in the Green Label programme, which provides guidance to associations
          on improving sustainability and inclusivity. To coordinate our efforts, we appoint a
          sustainability officer from the board who is responsible for drafting a sustainability plan
          inspired by the Green Office guidelines.
        </Text>
        <View style={{ marginTop: theme.spacing.sm, paddingLeft: theme.spacing.md }}>
          <Text style={theme.typography.body}>• Participation in the Green Label programme</Text>
          <Text style={{ ...theme.typography.body, marginTop: theme.spacing.xs }}>• Appointment of a sustainability officer on the board</Text>
          <Text style={{ ...theme.typography.body, marginTop: theme.spacing.xs }}>• A sustainability plan describing concrete steps and targets</Text>
        </View>

        <Text style={{ ...theme.typography.h1, marginTop: theme.spacing.lg }}>Resources</Text>
        <View style={{ height: 1, backgroundColor: theme.colors.muted, marginTop: theme.spacing.sm, marginBottom: theme.spacing.md }} />
        <Text style={{ ...theme.typography.body, marginTop: theme.spacing.md }}>
          The University Green Office maintains a blog with regular updates on projects and practical tips
          for living and organising events more sustainably. We encourage members to follow the Green
          Office and to engage with local initiatives.
        </Text>

        <Text style={{ ...theme.typography.h1, marginTop: theme.spacing.lg }}>Contact</Text>
        <View style={{ height: 1, backgroundColor: theme.colors.muted, marginTop: theme.spacing.sm, marginBottom: theme.spacing.md }} />
        <Text style={{ ...theme.typography.body, marginTop: theme.spacing.md }}>
          If you have questions or suggestions about sustainability at Francken, please contact the board at{' '}
          <Text
            style={linkStyle}
            onPress={() => Linking.openURL('mailto:board@professorfrancken.nl')}
            accessibilityRole="link"
          >
            board@professorfrancken.nl
          </Text>
          .
        </Text>
      </View>
    </ScrollView>
  );
}
