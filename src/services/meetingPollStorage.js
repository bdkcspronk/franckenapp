import AsyncStorage from '@react-native-async-storage/async-storage';

const storageKey = (committeeId) => `committee:${committeeId}:polls`;

export async function getPolls(committeeId) {
  try {
    const raw = await AsyncStorage.getItem(storageKey(committeeId));
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn('meetingPollStorage.getPolls failed', e);
    return [];
  }
}

export async function savePolls(committeeId, polls) {
  try {
    await AsyncStorage.setItem(storageKey(committeeId), JSON.stringify(polls));
    return polls;
  } catch (e) {
    console.warn('meetingPollStorage.savePolls failed', e);
    return polls;
  }
}

export async function addPoll(committeeId, poll) {
  const ps = await getPolls(committeeId);
  const next = [poll, ...ps];
  await savePolls(committeeId, next);
  return next;
}

export async function updatePoll(committeeId, poll) {
  const ps = await getPolls(committeeId);
  const next = ps.map((p) => (p.id === poll.id ? { ...p, ...poll } : p));
  await savePolls(committeeId, next);
  return next;
}

export async function deletePoll(committeeId, id) {
  const ps = await getPolls(committeeId);
  const next = ps.filter((p) => p.id !== id);
  await savePolls(committeeId, next);
  return next;
}

export default {
  getPolls,
  savePolls,
  addPoll,
  updatePoll,
  deletePoll,
};
