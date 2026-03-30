// Purpose: Two-step meeting poll editor (select dates → edit times).
import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import useMeetingPollState from './useMeetingPollState';
import CalendarPicker from './CalendarPicker';
import TimeSlotsEditor from './TimeSlotsEditor';
import MeetingPollHeader from './MeetingPollHeader';
import MeetingPollActions from './MeetingPollActions';
import { useTheme } from '../../../../theme';

export default function MeetingPollEditor({ initial = {}, onSave, onCancel }) {
  const theme = useTheme();
  const state = useMeetingPollState(initial);

  const {
    title,
    setTitle,
    step,
    setStep,
    viewMonth,
    selectedDays,
    timesMap,
    toggleDay,
    ensureTimes,
    addTime,
    removeTime,
    setTimePart,
    copyFirst,
    publish,
    nextMonth,
    prevMonth,
  } = state;

  const handlePublish = () => {
    const poll = publish();
    onSave?.(poll);
  };

  return (
    <View style={{ marginBottom: theme.spacing.md, marginHorizontal: theme.spacing.sm }}>
      <MeetingPollHeader title={title} setTitle={setTitle} />

      {step === 'select' ? (
        <>
          <CalendarPicker viewMonth={viewMonth} selectedDays={selectedDays} onToggleDay={toggleDay} onNextMonth={nextMonth} onPrevMonth={prevMonth} />
          <MeetingPollActions step="select" onPrevMonth={prevMonth} onNextMonth={nextMonth} onNext={ensureTimes} onCancel={onCancel} />
        </>
      ) : (
        <ScrollView>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.sm }}>
            <Text style={{ ...theme.typography.h3 }}>Selected dates</Text>
          </View>

          <TimeSlotsEditor selectedDays={selectedDays} timesMap={timesMap} addTime={addTime} removeTime={removeTime} setTimePart={setTimePart} copyFirstToAll={copyFirst} />

          <MeetingPollActions step="times" onBack={() => setStep('select')} onPublish={handlePublish} onCancel={onCancel} />
        </ScrollView>
      )}
    </View>
  );
}
