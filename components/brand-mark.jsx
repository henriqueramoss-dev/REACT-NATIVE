import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { useAppTheme } from '@/contexts/theme-context';

/** (JavaScript) Símbolo da Biblioteca: o mesmo ícone de livro do menu do site. */
export default function BrandMark() {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.mark, { backgroundColor: colors.header }]}>
      <Ionicons name="book-outline" size={22} color={colors.headerText} />
    </View>
  );
}

const styles = StyleSheet.create({
  mark: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
});
