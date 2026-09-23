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
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 28,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 42,
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
    marginBottom: 22,
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
    letterSpacing: 1.4,
  },
  title: {
    fontFamily: DISPLAY_FONT,
    maxWidth: 320,
    color: '#242629',
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: -1,
    lineHeight: 40,
  },
  description: {
    maxWidth: 340,
    marginTop: 12,
    color: '#62666B',
    fontSize: 16,
    lineHeight: 23,
  },
  form: {
    gap: 20,
    marginTop: 38,
    borderWidth: 1,
    borderColor: '#D9DADD',
    borderRadius: 18,
    backgroundColor: '#FAFAFA',
    padding: 18,
  },
  label: {
    marginBottom: 9,
    color: '#3B3E42',
    fontSize: 13,
    fontWeight: '700',
  },
  passwordLabelRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  forgotPassword: {
    color: '#8A6818',
    fontSize: 13,
    fontWeight: '600',
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
    marginTop: 4,
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
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 28,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#D9DADD',
  },
  dividerText: {
    color: '#8A8E93',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.3,
  },
  secondaryButton: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#CED0D4',
    borderRadius: 12,
  },
  secondaryButtonText: {
    color: '#3B3E42',
    fontSize: 15,
    fontWeight: '700',
  },
  notice: {
    maxWidth: 310,
    alignSelf: 'center',
    marginTop: 24,
    color: '#8A8E93',
    fontSize: 11,
    lineHeight: 17,
    textAlign: 'center',
  },
});


export default styles;
