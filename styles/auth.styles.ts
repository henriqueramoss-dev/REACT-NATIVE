import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { flexGrow: 1, padding: 22, paddingTop: 32, paddingBottom: 40 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 30 },
  brandName: { fontSize: 19, fontWeight: 'bold' },
  title: { fontSize: 30, fontWeight: 'bold' },
  description: { marginTop: 8, fontSize: 15, lineHeight: 22 },
  form: { marginTop: 25, gap: 14 },
  row: { flexDirection: 'row', gap: 10 },
  uf: { width: 72 },
  grow: { flex: 1 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 999, borderWidth: 1 },
  chipText: { fontSize: 14, fontWeight: '500' },
  label: { marginBottom: 6, fontSize: 13, fontWeight: 'bold' },
  input: {
    height: 44,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 15,
  },
  button: {
    height: 46,
    marginTop: 6,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: { fontSize: 15, fontWeight: '600' },
  secondaryText: { marginTop: 20, textAlign: 'center', fontSize: 13 },
  link: { fontWeight: 'bold' },
  notice: { marginTop: 20, fontSize: 11, lineHeight: 17, textAlign: 'center' },
});

export default styles;
