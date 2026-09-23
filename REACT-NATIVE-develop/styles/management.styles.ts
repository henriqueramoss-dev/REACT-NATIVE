import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 44,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.4,
  },
  title: {
    marginTop: 10,
    fontSize: 28,
    fontWeight: '800',
  },
  description: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 21,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  summaryCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: '900',
  },
  summaryLabel: {
    marginTop: 5,
    fontSize: 11,
  },
  formCard: {
    gap: 12,
    marginTop: 20,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  inputLarge: {
    minHeight: 78,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingTop: 12,
    fontSize: 14,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  flex: {
    flex: 1,
  },
  primaryButton: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#C49A3A',
    paddingHorizontal: 16,
  },
  primaryButtonText: {
    color: '#242629',
    fontSize: 13,
    fontWeight: '900',
  },
  list: {
    gap: 11,
    marginTop: 20,
  },
  card: {
    borderWidth: 1,
    borderRadius: 15,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  cardTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '800',
  },
  cardSubtitle: {
    marginTop: 6,
    fontSize: 12,
    lineHeight: 18,
  },
  cardValue: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: '900',
  },
  badge: {
    borderRadius: 14,
    backgroundColor: '#E9D8A5',
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  badgeMuted: {
    backgroundColor: '#D9DADD',
  },
  badgeText: {
    color: '#242629',
    fontSize: 10,
    fontWeight: '800',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
  },
  smallButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 38,
    borderWidth: 1,
    borderRadius: 9,
    paddingHorizontal: 10,
  },
  smallButtonText: {
    fontSize: 11,
    fontWeight: '800',
  },
  dangerText: {
    color: '#B94A48',
  },
  searchInput: {
    height: 48,
    marginTop: 20,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  empty: {
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderRadius: 14,
    padding: 24,
  },
  emptyText: {
    fontSize: 13,
    textAlign: 'center',
  },
  transactionIncome: {
    color: '#27835A',
  },
  transactionExpense: {
    color: '#B94A48',
  },
  progressTrack: {
    height: 8,
    overflow: 'hidden',
    marginTop: 10,
    borderRadius: 5,
    backgroundColor: '#D9DADD',
  },
  progressFill: {
    height: 8,
    borderRadius: 5,
    backgroundColor: '#C49A3A',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  notificationUnread: {
    borderLeftWidth: 4,
    borderLeftColor: '#C49A3A',
  },
  notice: {
    marginTop: 24,
    fontSize: 11,
    lineHeight: 17,
    textAlign: 'center',
  },
});

export default styles;
