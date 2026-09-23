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
  description: { maxWidth: 470, marginTop: 10, fontSize: 15, lineHeight: 22 },
  card: { gap: 18, marginTop: 30, borderWidth: 1, borderRadius: 18, padding: 18 },
  label: { fontSize: 13, fontWeight: '800' },
  input: { height: 56, borderWidth: 1, borderRadius: 12, paddingHorizontal: 15, fontSize: 15 },
  codeInput: {
    height: 64,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 9,
    textAlign: 'center',
  },
  button: {
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#C49A3A',
  },
  buttonPressed: { transform: [{ scale: 0.99 }] },
  buttonText: { color: '#242629', fontSize: 14, fontWeight: '900' },
  codeActions: { flexDirection: 'row', justifyContent: 'space-between' },
  link: { fontSize: 12, fontWeight: '800' },
  notice: { maxWidth: 350, alignSelf: 'center', marginTop: 24, fontSize: 11, lineHeight: 17, textAlign: 'center' },
});


export default styles;
