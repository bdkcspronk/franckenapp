// Purpose: Poll title input header.
import React from 'react';
import { TextInput, View } from 'react-native';
import { useTheme } from '../../../../theme';

export default function MeetingPollHeader({ title, setTitle }) {
  const theme = useTheme();
  return (
    <View>
      <TextInput
        placeholder="Poll title"
        value={title}
        onChangeText={setTitle}
        style={{
          backgroundColor: theme.colors.canvas,
          padding: theme.spacing.sm,
          borderRadius: 6,
          marginBottom: theme.spacing.xs,
          borderWidth: 1,
          borderColor: theme.colors.muted,
        }}
      />
    </View>
  );
}
