// Purpose: Hook managing state and helpers for meeting polls.
import { useMemo, useState } from 'react';

/* Helpers (centralized) */
export const pad = (n) => String(n).padStart(2, '0');

export const dateKey = (d) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const startOfDay = (d) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate());

export const isoFromParts = (date, hhmm = '17:00') => {
  const valid = /^\d{1,2}:\d{1,2}$/.test(hhmm);
  const [h, m] = (valid ? hhmm : '17:00').split(':').map(Number);
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate(), h || 0, m || 0);
  return `${dateKey(d)}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const getDaysGrid = (month) => {
  const first = new Date(month.getFullYear(), month.getMonth(), 1).getDay();
  const total = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();

  return [
    ...Array(first).fill(null),
    ...Array.from({ length: total }, (_, i) => new Date(month.getFullYear(), month.getMonth(), i + 1)),
  ];
};

export const cleanNum = (v) => String(v || '').replace(/\D/g, '').slice(0, 2);

/* Hook */
export default function useMeetingPollState(initial = {}) {
  const [title, setTitle] = useState(initial.title || '');
  const [step, setStep] = useState('select');

  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);

  const [viewMonth, setViewMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const [selectedDays, setSelectedDays] = useState(() => {
    const map = {};
    (initial.slots || []).forEach((s) => {
      const start = typeof s === 'string' ? s : s?.start;
      if (!start) return;
      const d = new Date(start);
      if (isNaN(d)) return;
      map[dateKey(d)] = startOfDay(d);
    });
    return map;
  });

  const [timesMap, setTimesMap] = useState(() => {
    const map = {};
    (initial.slots || []).forEach((s) => {
      const start = typeof s === 'string' ? s : s?.start;
      const end = typeof s === 'object' ? s?.end : null;
      if (!start) return;

      const d = new Date(start);
      const key = dateKey(d);

      map[key] = map[key] || [];
      map[key].push({
        start: `${pad(d.getHours())}:${pad(d.getMinutes())}`,
        end: end ? new Date(end).toTimeString().slice(0, 5) : '',
      });
    });
    return map;
  });

  /* Actions */
  const toggleDay = (d) => {
    const key = dateKey(d);
    setSelectedDays((prev) => {
      const next = { ...prev };
      if (next[key]) delete next[key];
      else next[key] = startOfDay(d);
      return next;
    });

    setTimesMap((prev) => ({ ...prev, [key]: prev[key] || [{ start: '17:00', end: '' }] }));
  };

  const ensureTimes = () => {
    setTimesMap((prev) => {
      const next = { ...prev };
      Object.keys(selectedDays).forEach((k) => {
        if (!next[k]?.length) next[k] = [{ start: '17:00', end: '' }];
      });
      return next;
    });
    setStep('times');
  };

  const updateSlot = (key, idx, updater) => {
    setTimesMap((prev) => {
      const arr = [...(prev[key] || [])];
      arr[idx] = updater(arr[idx] || { start: '', end: '' });
      return { ...prev, [key]: arr };
    });
  };

  const setTimePart = (key, idx, part, val) => {
    updateSlot(key, idx, (slot) => {
      let [sh, sm] = (slot.start || '').split(':');
      let [eh, em] = (slot.end || '').split(':');

      if (part === 'startHour') sh = cleanNum(val);
      if (part === 'startMin') sm = cleanNum(val);
      if (part === 'endHour') eh = cleanNum(val);
      if (part === 'endMin') em = cleanNum(val);

      return {
        start: sh || sm ? `${sh}:${sm}` : '',
        end: eh || em ? `${eh}:${em}` : '',
      };
    });
  };

  const addTime = (key) => {
    setTimesMap((prev) => {
      const arr = prev[key] || [{ start: '17:00', end: '' }];
      const last = arr[arr.length - 1] || { start: '17:00' };
      const [hRaw, mRaw] = (last.start || '17:00').split(':');
      const h = parseInt(hRaw, 10);
      const m = parseInt(mRaw, 10) || 0;
      const nextH = Number.isFinite(h) ? (h + 2) % 24 : 17;
      return { ...prev, [key]: [...arr, { start: `${pad(nextH)}:${pad(m)}`, end: '' }] };
    });
  };

  const removeTime = (key, idx) => {
    setTimesMap((prev) => ({ ...prev, [key]: (prev[key] || []).filter((_, i) => i !== idx) }));
  };

  const copyFirst = () => {
    const keys = Object.keys(selectedDays);
    if (!keys.length) return;
    const base = timesMap[keys[0]] || [{ start: '17:00', end: '' }];
    const next = {};
    keys.forEach((k) => {
      next[k] = base.map((s) => ({ ...s }));
    });
    setTimesMap(next);
  };

  const nextMonth = () => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1));
  const prevMonth = () => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1));

  const publish = () => {
    const slots = Object.keys(selectedDays)
      .sort()
      .flatMap((k) => {
        const d = selectedDays[k];
        return (timesMap[k] || []).map((s) => ({ start: isoFromParts(d, s.start), end: s.end ? isoFromParts(d, s.end) : null }));
      });

    return {
      id: initial.id || Date.now().toString(),
      title: title || 'Meeting poll',
      slots,
      createdAt: initial.createdAt || Date.now(),
      published: true,
      responses: initial.responses || {},
    };
  };

  return {
    title,
    setTitle,
    step,
    setStep,
    today,
    viewMonth,
    setViewMonth,
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
  };
}
