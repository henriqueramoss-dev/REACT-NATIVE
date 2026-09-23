import { Platform, StyleSheet } from 'react-native';

const DISPLAY_FONT = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  web: 'Georgia, serif',
});

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 22, paddingVertical: 36 },
  eyebrow: { fontSize: 11, fontWeight: '800', letterSpacing: 1.5 },
  title: {
    maxWidth: 430,
    marginTop: 12,
    fontFamily: DISPLAY_FONT,
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 37,
  },
  description: { marginTop: 10, fontSize: 15, lineHeight: 22 },
  card: { gap: 18, marginTop: 30, borderWidth: 1, borderRadius: 18, padding: 18 },
  label: { marginBottom: 8, fontSize: 13, fontWeight: '800' },
  input: { height: 56, borderWidth: 1, borderRadius: 12, paddingHorizontal: 15, fontSize: 15 },
  button: {
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#C49A3A',
  },
  buttonPressed: { transform: [{ scale: 0.99 }] },
  buttonText: { color: '#242629', fontSize: 14, fontWeight: '900' },
});


export default styles;
