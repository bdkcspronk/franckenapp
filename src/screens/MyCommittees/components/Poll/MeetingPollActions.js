// Purpose: Action buttons for poll editor (navigation/publish).
import React from 'react';
import { View } from 'react-native';
import AppButton from '../../../../components/AppButton';
import { useTheme } from '../../../../theme';

export default function MeetingPollActions({
  step,
  onPrevMonth,
  onNextMonth,
  onNext,
  onBack,
  onPublish,
  onCancel,
}) {
  const theme = useTheme();

  if (step === 'select') {
    return (
      <>
        <View style={{ flexDirection: 'row', marginTop: theme.spacing.md }}>
          <AppButton title="Prev month" onPress={onPrevMonth} style={{ flex: 1, marginRight: 8 }} />
          <AppButton title="Next month" onPress={onNextMonth} style={{ flex: 1, marginRight: 8 }} />
          <AppButton title="Next" onPress={onNext} style={{ flex: 1 }} />
        </View>
        <View style={{ height: theme.spacing.sm }} />
        <View style={{ marginTop: theme.spacing.sm, alignItems: 'center' }}>
          <AppButton title="Cancel" variant="ghost" onPress={onCancel} />
        </View>
      </>
    );
  }

  return (
    <>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: theme.spacing.md }}>
        <AppButton title="Back" variant="tertiary" onPress={onBack} style={{ flex: 1, marginRight: 8 }} />
        <AppButton title="Confirm & Publish" onPress={onPublish} style={{ flex: 1 }} />
      </View>
      <View style={{ height: theme.spacing.sm }} />
      <View style={{ marginTop: theme.spacing.sm, alignItems: 'center' }}>
        <AppButton title="Cancel" variant="ghost" onPress={onCancel} />
      </View>
    </>
  );
}
