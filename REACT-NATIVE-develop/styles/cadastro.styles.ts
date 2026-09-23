import { Platform, StyleSheet } from 'react-native';

const DISPLAY_FONT = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  web: 'Georgia, serif',
});

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F2F3F5',
  },
  container: {
    flex: 1,
    backgroundColor: '#F2F3F5',
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 36,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 34,
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
  roleBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  roleDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#C49A3A',
  },
  roleBadgeText: {
    color: '#8A6818',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  title: {
    fontFamily: DISPLAY_FONT,
    maxWidth: 340,
    color: '#242629',
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.9,
    lineHeight: 38,
  },
  description: {
    maxWidth: 350,
    marginTop: 12,
    color: '#62666B',
    fontSize: 16,
    lineHeight: 23,
  },
  form: {
    gap: 20,
    marginTop: 36,
  },
  sectionCard: {
    gap: 20,
    borderWidth: 1,
    borderColor: '#D9DADD',
    borderRadius: 18,
    backgroundColor: '#FAFAFA',
    padding: 18,
  },
  barberFields: {
    gap: 20,
    borderWidth: 1,
    borderColor: '#D9DADD',
    borderRadius: 18,
    backgroundColor: '#FAFAFA',
    padding: 18,
  },
  sectionTitle: {
    fontFamily: DISPLAY_FONT,
    color: '#242629',
    fontSize: 18,
    fontWeight: '700',
  },
  sectionDescription: {
    maxWidth: 340,
    marginTop: 6,
    color: '#62666B',
    fontSize: 13,
    lineHeight: 19,
  },
  addressRow: {
    flexDirection: 'row',
    gap: 12,
  },
  addressNumberField: {
    width: 100,
  },
  complementField: {
    flex: 1,
  },
  cityField: {
    flex: 1,
  },
  stateField: {
    width: 76,
  },
  label: {
    marginBottom: 9,
    color: '#3B3E42',
    fontSize: 13,
    fontWeight: '700',
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderColor: '#CED0D4',
    borderRadius: 12,
    backgroundColor: '#F2F3F5',
    paddingHorizontal: 16,
    color: '#242629',
    fontSize: 16,
  },
  button: {
    height: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: 6,
    borderRadius: 12,
    backgroundColor: '#C49A3A',
  },
  buttonPressed: {
    opacity: 0.82,
  },
  buttonText: {
    color: '#242629',
    fontSize: 15,
    fontWeight: '700',
  },
  buttonArrow: {
    color: '#242629',
    fontSize: 18,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  loginText: {
    color: '#62666B',
    fontSize: 14,
  },
  loginLink: {
    color: '#8A6818',
    fontSize: 14,
    fontWeight: '700',
  },
});


export default styles;
