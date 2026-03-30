// Purpose: Month grid date picker for meeting poll.
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { dateKey, getDaysGrid, startOfDay, weekdayLabels } from './useMeetingPollState';
import { useTheme } from '../../../../theme';

export default function CalendarPicker({ viewMonth, selectedDays = {}, onToggleDay, onNextMonth, onPrevMonth }) {
  const theme = useTheme();
  const weeks = getDaysGrid(viewMonth);
  const today = startOfDay(new Date());

  const renderDay = (d, i) => {
    if (!d) return <View key={i} style={{ height: 40 }} />;
    const key = dateKey(d);
    const selectable = startOfDay(d) >= today;
    const selected = !!selectedDays[key];

    return (
      <TouchableOpacity
        key={i}
        disabled={!selectable}
        onPress={() => onToggleDay && onToggleDay(d)}
        style={{
          borderRadius: 6,
          padding: 8,
          backgroundColor: selected ? theme.colors.primary : selectable ? theme.colors.canvas : theme.colors.card,
        }}
      >
        <Text style={{ textAlign: 'center', color: selected ? theme.colors.onPrimary : undefined }}>{d.getDate()}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <Text style={{ ...theme.typography.label, marginBottom: theme.spacing.xs }}>{viewMonth.toLocaleString(undefined, { month: 'long', year: 'numeric' })}</Text>

      <View style={{ flexDirection: 'row', marginHorizontal: theme.spacing.md, justifyContent: 'space-between', marginBottom: theme.spacing.xs }}>
        {weekdayLabels.map((w) => (
          <Text key={w} style={{ width: 30, textAlign: 'center', color: theme.colors.muted }}>{w}</Text>
        ))}
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {weeks.map((d, i) => (
          <View key={i} style={{ width: `${100 / 7}%`, padding: 4 }}>
            {renderDay(d, i)}
          </View>
        ))}
      </View>

      {/* Month navigation is handled by MeetingPollActions to preserve layout */}
    </View>
  );
}
