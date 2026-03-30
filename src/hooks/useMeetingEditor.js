import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Dimensions, Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { expandShortCommands } from '../utils/shortCommands';
import meetingStorage from '../services/meetingStorage';
import meetingUtils from '../utils/meetingUtils';

const committeesMock = require('../mocks/committees.json');
const membersMock = require('../mocks/members.json');

export default function useMeetingEditor({ committeeId } = {}) {
  const { user } = useAuth();
  const windowWidth = Dimensions.get('window').width;
  const previewHeight = Math.round(windowWidth * (297 / 210));

  const [items, setItems] = useState([]);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [dateText, setDateText] = useState(new Date().toISOString().slice(0, 10));
  const [location, setLocation] = useState('');
  const [membersList, setMembersList] = useState([]);
  const [presentMap, setPresentMap] = useState({});
  const [katexInput, setKatexInput] = useState('');
  const [previewHtml, setPreviewHtml] = useState('');
  const [previewVisible, setPreviewVisible] = useState(false);
  const webviewRef = useRef(null);
  const [editingId, setEditingId] = useState(null);
  const [chairName, setChairName] = useState('');

  // Load saved meetings
  useEffect(() => {
    let mounted = true;
    meetingStorage.getMeetings(committeeId).then((v) => {
      if (!mounted) return;
      setItems(v || []);
    }).catch(() => {});
    return () => { mounted = false; };
  }, [committeeId]);

  // Load members and determine chair
  useEffect(() => {
    try {
      const committee = (committeesMock || []).find((c) => c.id === committeeId) || {};
      const memberIds = (committee.members || []).map(String);
      // build a reverse map memberId -> [roleKeys] from committee.roles
      const memberRolesMap = {};
      if (committee.roles) {
        Object.entries(committee.roles).forEach(([roleKey, memId]) => {
          const id = String(memId);
          if (!memberRolesMap[id]) memberRolesMap[id] = [];
          memberRolesMap[id].push(roleKey);
        });
      }
      const members = (membersMock || []).filter((m) => memberIds.includes(String(m.id))).map((m) => {
        const id = String(m.id);
        const roles = memberRolesMap[id] ? [...memberRolesMap[id]] : [];
        // sort roles with a sensible priority so abbreviations appear in a predictable order
        const roleOrder = ['chair', 'treasurer', 'secretary'];
        roles.sort((a, b) => {
          const ia = roleOrder.indexOf(a);
          const ib = roleOrder.indexOf(b);
          if (ia === -1 && ib === -1) return a.localeCompare(b);
          if (ia === -1) return 1;
          if (ib === -1) return -1;
          return ia - ib;
        });
        return { id, name: m.displayName || m.name || m.email || id, roles };
      });
      setMembersList(members);
      const pm = {};
      members.forEach((m) => { pm[m.id] = true; });
      setPresentMap(pm);
      // determine chair from committee roles if available, otherwise fall back to logged-in user
      const chairId = committee && committee.roles && committee.roles.chair;
      let resolvedChair = '';
      if (chairId) {
        const chairMember = (membersMock || []).find((m) => String(m.id) === String(chairId));
        if (chairMember) resolvedChair = chairMember.displayName || chairMember.name || chairMember.email || String(chairMember.id);
      }
      if (!resolvedChair && user) resolvedChair = user.displayName || user.email || user.uid || '';
      setChairName(resolvedChair);
    } catch (e) {
      console.warn('useMeetingEditor: failed to load members', e);
    }
  }, [committeeId, user]);

  // sensible default title
  useEffect(() => {
    try {
      if (title && title.trim()) return;
      const committee = (committeesMock || []).find((c) => c.id === committeeId) || {};
      const committeeName = committee.name || 'Committee';
      const meetingNumber = (items && items.length) ? items.length + 1 : 1;
      const defaultTitle = `${committeeName} - Agenda Meeting #${meetingNumber}`;
      setTitle(defaultTitle);
    } catch (e) {
      // ignore
    }
  }, [committeeId, items]);

  // sensible default points for new agendas; include last meeting date when available
  useEffect(() => {
    try {
      if (editingId) return; // don't override when editing an existing item
      if (desc && desc.trim()) return; // user already entered points
      const last = (items && items.length) ? items[0] : null;
      const lastDateStr = last ? (last.date ? new Date(last.date).toLocaleDateString() : (last.createdAt ? new Date(last.createdAt).toLocaleDateString() : '')) : '';
      const defaultLines = [
        'Opening',
        'Establish Agenda',
        ...(lastDateStr ? [`Approve Minutes and APs (${lastDateStr})`] : []),
        'Budget',
        'Activities',
        'Committee Clothing',
        'Question Round',
        'Next Meeting',
        'Closing',
      ];
      setDesc(defaultLines.join('\n'));
    } catch (e) {
      // ignore
    }
  }, [items, editingId, desc]);

  const saveItem = useCallback(async () => {
    if (!title || !title.trim()) return;
    const processedTitle = expandShortCommands(title.trim());
    const processedDesc = expandShortCommands(desc.trim());
    // ensure numbering is saved when user didn't supply explicit labels
    const numberedDesc = meetingUtils.ensureNumberedPoints(processedDesc || '');
    const present = Object.keys(presentMap).filter((k) => presentMap[k]);

    if (editingId) {
      const updated = { id: editingId, title: processedTitle, description: numberedDesc, date: dateText, location, present };
      const next = await meetingStorage.updateMeeting(committeeId, updated);
      setItems(next);
      setTitle(''); setDesc(''); setEditingId(null);
      return;
    }

    const newItem = { id: Date.now().toString(), title: processedTitle, description: numberedDesc, createdAt: new Date().toISOString(), date: dateText, location, present };
    const next = await meetingStorage.addMeeting(committeeId, newItem);
    setItems(next);
    setTitle(''); setDesc('');
  }, [title, desc, dateText, location, presentMap, editingId, committeeId]);

  const beginEdit = useCallback((item) => {
    setTitle(item.title || '');
    setDesc(item.description || '');
    setEditingId(item.id);
    setDateText(item.date || new Date().toISOString().slice(0, 10));
    setLocation(item.location || '');
    const pm = {};
    membersList.forEach((m) => { pm[m.id] = (item.present || []).includes(m.id); });
    setPresentMap(pm);
  }, [membersList]);

  const deleteItem = useCallback((id) => {
    Alert.alert('Delete meeting', 'Are you sure you want to delete this meeting?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        const next = await meetingStorage.deleteMeeting(committeeId, id);
        setItems(next);
        if (editingId === id) { setEditingId(null); setTitle(''); setDesc(''); }
      } }
    ]);
  }, [committeeId, editingId]);

  // live preview generation (debounced)
  useEffect(() => {
    let mounted = true;
    if (!previewVisible) return;
    const update = async () => {
      try {
        const attendeesIncluded = membersList.filter((m) => !!presentMap[m.id]).map((m) => {
          if (!m.roles || !m.roles.length) return m.name;
          const roleAbbrev = { chair: 'ch.', treasurer: 'tr.', secretary: 'sec.' };
          const abbrs = m.roles.map((r) => roleAbbrev[r] || (r.length <= 4 ? r + '.' : r.slice(0, 3) + '.'));
          return `${m.name} (${abbrs.join(', ')})`;
        });
        const mmToPx = 3.779527559; // CSS px per mm (approx, 96dpi)
        const contentPx = 210 * mmToPx;
        const previewScale = Math.min(1, windowWidth / contentPx);

        const committee = (committeesMock || []).find((c) => c.id === committeeId) || {};
        const committeeName = committee.name || '';
        const rawData = { title, pointsText: desc, chairName: chairName || '', attendees: attendeesIncluded, date: dateText, location, katexInput, committeeName };
        const html = await meetingUtils.buildAgendaHtml(rawData, { preview: true, previewScale });
        if (mounted) setPreviewHtml(html);
      } catch (e) {
        console.warn('useMeetingEditor preview update failed', e);
      }
    };

    const id = setTimeout(update, 220);
    return () => { mounted = false; clearTimeout(id); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewVisible, title, desc, dateText, location, katexInput, membersList, JSON.stringify(presentMap), windowWidth, chairName]);

  const exportPdf = useCallback(async () => {
    try {
      const attendeesIncluded = membersList.filter((m) => !!presentMap[m.id]).map((m) => {
        if (!m.roles || !m.roles.length) return m.name;
        const roleAbbrev = { chair: 'ch.', treasurer: 'tr.', secretary: 'sec.' };
        const abbrs = m.roles.map((r) => roleAbbrev[r] || (r.length <= 4 ? r + '.' : r.slice(0, 3) + '.'));
        return `${m.name} (${abbrs.join(', ')})`;
      });
      const committee = (committeesMock || []).find((c) => c.id === committeeId) || {};
      const committeeNameRaw = committee.name || '';
      const data = { title, pointsText: desc, chairName: chairName || '', attendees: attendeesIncluded, date: dateText, location, katexInput, committeeName: committeeNameRaw };
      // build filename: Agenda_<committeeName>_<date>.pdf
      const sanitize = (s) => String(s || '').replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_\-\.]/g, '');
      const committeeSafe = sanitize(committeeNameRaw || 'committee');
      const datePart = sanitize(dateText || new Date().toISOString().slice(0, 10));
      const base = `Agenda_${committeeSafe}_${datePart}`;
      await meetingUtils.exportAgendaPdf(data, base);
    } catch (e) {
      Alert.alert('Export failed', String(e));
    }
  }, [membersList, presentMap, title, desc, dateText, location, katexInput, chairName]);
  const exportTex = useCallback(async () => {
    try {
      const attendeesIncluded = membersList.filter((m) => !!presentMap[m.id]).map((m) => {
        if (!m.roles || !m.roles.length) return m.name;
        const roleAbbrev = { chair: 'ch.', treasurer: 'tr.', secretary: 'sec.' };
        const abbrs = m.roles.map((r) => roleAbbrev[r] || (r.length <= 4 ? r + '.' : r.slice(0, 3) + '.'));
        return `${m.name} (${abbrs.join(', ')})`;
      });
      const committee = (committeesMock || []).find((c) => c.id === committeeId) || {};
      const committeeNameRaw = committee.name || '';
      const data = { title, pointsText: desc, chairName: chairName || '', attendees: attendeesIncluded, date: dateText, location, katexInput, committeeName: committeeNameRaw };
      const sanitize = (s) => String(s || '').replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_\-\.]/g, '');
      const committeeSafe = sanitize(committeeNameRaw || 'committee');
      const datePart = sanitize(dateText || new Date().toISOString().slice(0, 10));
      const base = `Agenda_${committeeSafe}_${datePart}.tex`;
      await meetingUtils.exportAgendaTex(data, base);
    } catch (e) {
      Alert.alert('Export failed', String(e));
    }
  }, [membersList, presentMap, title, desc, dateText, location, katexInput, chairName]);
  const controller = useMemo(() => ({
    items,
    title, setTitle,
    desc, setDesc,
    dateText, setDateText,
    location, setLocation,
    membersList,
    presentMap, setPresentMap,
    katexInput, setKatexInput,
    previewHtml,
    previewVisible, setPreviewVisible,
    previewHeight,
    webviewRef,
    editingId, setEditingId,
    chairName,
    saveItem,
    beginEdit,
    deleteItem,
    exportPdf,
    exportTex,
    setItems,
  }), [items, title, desc, dateText, location, membersList, presentMap, katexInput, previewHtml, previewVisible, previewHeight, editingId, chairName, saveItem, beginEdit, deleteItem, exportPdf]);

  return controller;
}
