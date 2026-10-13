import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { flexGrow: 1, padding: 22, paddingTop: 32, paddingBottom: 40 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 30 },
  brandSymbol: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#C49A3A',
    color: '#242629',
    textAlign: 'center',
    lineHeight: 40,
    fontSize: 20,
    fontWeight: 'bold',
  },
  brandName: { fontSize: 19, fontWeight: 'bold' },
  title: { fontSize: 30, fontWeight: 'bold' },
  description: { marginTop: 8, fontSize: 15, lineHeight: 22 },
  form: { marginTop: 25, gap: 14 },
  label: { marginBottom: 6, fontSize: 13, fontWeight: 'bold' },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    fontSize: 15,
  },
  button: {
    height: 52,
    marginTop: 6,
    backgroundColor: '#C49A3A',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: { fontSize: 15, fontWeight: 'bold', color: '#242629' },
  secondaryText: { marginTop: 20, textAlign: 'center', fontSize: 13 },
  link: { color: '#8A6818', fontWeight: 'bold' },
  notice: { marginTop: 20, fontSize: 11, lineHeight: 17, textAlign: 'center', color: '#8A8E93' },
});

export default styles;
