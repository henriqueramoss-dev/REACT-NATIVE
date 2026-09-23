import { Platform, StyleSheet } from 'react-native';

const DISPLAY_FONT = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  web: 'Georgia, serif',
});

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F2F3F5' },
  content: { paddingHorizontal: 22, paddingTop: 24, paddingBottom: 40 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 48,
  },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  brandSymbol: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#C49A3A',
    color: '#242629',
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 38,
    textAlign: 'center',
  },
  brandName: {
    color: '#242629',
    fontFamily: DISPLAY_FONT,
    fontSize: 16,
    fontWeight: '800',
  },
  exit: { color: '#8A6818', fontSize: 14, fontWeight: '700' },
  eyebrow: {
    color: '#8A6818',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  title: {
    fontFamily: DISPLAY_FONT,
    maxWidth: 620,
    marginTop: 12,
    color: '#242629',
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 37,
  },
  description: { marginTop: 10, color: '#62666B', fontSize: 16, lineHeight: 23 },
  grid: { gap: 12, marginTop: 32 },
  card: {
    borderWidth: 1,
    borderColor: '#D9DADD',
    borderRadius: 18,
    backgroundColor: '#FAFAFA',
    padding: 18,
    overflow: 'hidden',
  },
  cardPressed: { backgroundColor: '#E7E8EA' },
  cardAccent: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 4,
    backgroundColor: '#C49A3A',
  },
  cardTitle: {
    color: '#242629',
    fontFamily: DISPLAY_FONT,
    fontSize: 17,
    fontWeight: '800',
  },
  cardDescription: { marginTop: 6, color: '#62666B', fontSize: 14, lineHeight: 20 },
  cardLink: { marginTop: 14, color: '#8A6818', fontSize: 13, fontWeight: '700' },
  prototypeNotice: {
    marginTop: 28,
    color: '#8A8E93',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
});


export default styles;
