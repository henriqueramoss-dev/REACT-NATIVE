import { Platform, StyleSheet } from 'react-native';

const DISPLAY_FONT = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  web: 'Georgia, serif',
});

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 28, paddingBottom: 44 },
  eyebrow: { fontSize: 11, fontWeight: '800', letterSpacing: 1.5 },
  title: { marginTop: 12, fontFamily: DISPLAY_FONT, fontSize: 30, fontWeight: '800' },
  description: { marginTop: 10, fontSize: 15, lineHeight: 22 },
  tabs: { flexDirection: 'row', marginTop: 28, borderRadius: 14, padding: 4 },
  tab: { flex: 1, alignItems: 'center', borderRadius: 11, paddingVertical: 11 },
  tabText: { fontSize: 12, fontWeight: '800' },
  metrics: { flexDirection: 'row', gap: 9, marginTop: 22 },
  metric: { flex: 1, borderWidth: 1, borderRadius: 14, padding: 13 },
  metricValue: { fontFamily: DISPLAY_FONT, fontSize: 23, fontWeight: '900' },
  metricLabel: { marginTop: 5, fontSize: 10 },
  list: { gap: 12, marginTop: 16 },
  appointmentCard: { borderWidth: 1, borderRadius: 18, padding: 18 },
  appointmentHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  appointmentTime: { fontSize: 16, fontWeight: '900' },
  statusBadge: { borderRadius: 18, backgroundColor: '#E9D8A5', paddingHorizontal: 10, paddingVertical: 6 },
  statusBadgeMuted: { backgroundColor: '#D9DADD' },
  statusBadgeText: { color: '#242629', fontSize: 10, fontWeight: '800' },
  customerName: { marginTop: 16, fontFamily: DISPLAY_FONT, fontSize: 19, fontWeight: '800' },
  service: { marginTop: 6, fontSize: 13 },
  price: { marginTop: 10, fontSize: 14, fontWeight: '900' },
  actions: { flexDirection: 'row', gap: 9, marginTop: 18 },
  completeButton: { flex: 1, alignItems: 'center', borderRadius: 11, backgroundColor: '#C49A3A', paddingVertical: 12 },
  completeButtonText: { color: '#242629', fontSize: 12, fontWeight: '900' },
  outlineButton: { flex: 1, alignItems: 'center', borderWidth: 1, borderRadius: 11, paddingVertical: 12 },
  outlineButtonText: { fontSize: 11, fontWeight: '800' },
  hoursContent: { gap: 11, marginTop: 22 },
  dayCard: { borderWidth: 1, borderRadius: 16, padding: 16 },
  dayHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dayName: { fontFamily: DISPLAY_FONT, fontSize: 16, fontWeight: '800' },
  timeRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, marginTop: 15 },
  timeField: { flex: 1 },
  timeLabel: { marginBottom: 7, fontSize: 10, fontWeight: '700' },
  timeInput: { height: 46, borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, fontSize: 14, textAlign: 'center' },
  timeSeparator: { paddingBottom: 14, fontSize: 11 },
  closedText: { marginTop: 10, fontSize: 12 },
  saveButton: { height: 54, alignItems: 'center', justifyContent: 'center', marginTop: 8, borderRadius: 12, backgroundColor: '#C49A3A' },
  saveButtonText: { color: '#242629', fontSize: 14, fontWeight: '900' },
});


export default styles;
