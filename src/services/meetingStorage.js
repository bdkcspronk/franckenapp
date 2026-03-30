import AsyncStorage from '@react-native-async-storage/async-storage';

const storageKey = (committeeId) => `committee:${committeeId}:agenda`;

export async function getMeetings(committeeId) {
  try {
    const raw = await AsyncStorage.getItem(storageKey(committeeId));
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn('meetingStorage.getMeetings failed', e);
    return [];
  }
}

export async function saveMeetings(committeeId, meetings) {
  try {
    await AsyncStorage.setItem(storageKey(committeeId), JSON.stringify(meetings));
    return meetings;
  } catch (e) {
    console.warn('meetingStorage.saveMeetings failed', e);
    return meetings;
  }
}

export async function addMeeting(committeeId, meeting) {
  const ms = await getMeetings(committeeId);
  const next = [meeting, ...ms];
  await saveMeetings(committeeId, next);
  return next;
}

export async function updateMeeting(committeeId, meeting) {
  const ms = await getMeetings(committeeId);
  const next = ms.map((m) => (m.id === meeting.id ? { ...m, ...meeting } : m));
  await saveMeetings(committeeId, next);
  return next;
}

export async function deleteMeeting(committeeId, id) {
  const ms = await getMeetings(committeeId);
  const next = ms.filter((m) => m.id !== id);
  await saveMeetings(committeeId, next);
  return next;
}

export default {
  getMeetings,
  saveMeetings,
  addMeeting,
  updateMeeting,
  deleteMeeting,
};
