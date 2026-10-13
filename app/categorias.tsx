import { ScrollView, Text, View } from 'react-native';

import { useAppTheme } from '@/contexts/theme-context';
import { categorias } from '@/data/biblioteca';
import styles from '@/styles/biblioteca.styles';

export default function CategoriasScreen() {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Categorias</Text>
        <Text style={[styles.description, { color: colors.textMuted }]}>
          Explore as categorias do acervo.
        </Text>

        {categorias.map((categoria) => (
          <View
            key={categoria.id}
            style={[styles.itemCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <Text style={[styles.itemTitle, { color: colors.text }]}>{categoria.nome}</Text>
            <Text style={[styles.itemInfo, { color: colors.textMuted }]}>
              {categoria.quantidade} livros
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
