import { Platform, StyleSheet } from 'react-native';

const DISPLAY_FONT = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  web: 'Georgia, serif',
});

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F2F3F5',
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 60,
    paddingBottom: 28,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
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
    fontFamily: DISPLAY_FONT,
    color: '#242629',
    fontSize: 17,
    fontWeight: '800',
  },
  header: {
    marginTop: 48,
  },
  kicker: {
    color: '#8A6818',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.6,
  },
  title: {
    fontFamily: DISPLAY_FONT,
    maxWidth: 350,
    marginTop: 12,
    color: '#242629',
    fontSize: 32,
    fontWeight: '800',
    lineHeight: 39,
  },
  subtitle: {
    marginTop: 12,
    color: '#62666B',
    fontSize: 16,
    lineHeight: 23,
  },
  options: {
    gap: 12,
    marginTop: 36,
  },
  option: {
    minHeight: 92,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D9DADD',
    borderRadius: 18,
    backgroundColor: '#FAFAFA',
    padding: 18,
  },
  optionPressed: {
    backgroundColor: '#E7E8EA',
    transform: [{ scale: 0.99 }],
  },
  optionText: {
    flex: 1,
    paddingRight: 14,
  },
  optionTitle: {
    fontFamily: DISPLAY_FONT,
    color: '#242629',
    fontSize: 17,
    fontWeight: '800',
  },
  optionDescription: {
    marginTop: 5,
    color: '#62666B',
    fontSize: 14,
    lineHeight: 20,
  },
  arrow: {
    color: '#C49A3A',
    fontSize: 32,
    fontWeight: '300',
    lineHeight: 34,
  },
  footer: {
    marginTop: 'auto',
    paddingTop: 32,
    color: '#8A8E93',
    fontSize: 12,
    textAlign: 'center',
  },
});


export default styles;
