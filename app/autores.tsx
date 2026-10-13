import { ScrollView, Text, View } from 'react-native';

import { useAppTheme } from '@/contexts/theme-context';
import { autores } from '@/data/biblioteca';
import styles from '@/styles/biblioteca.styles';

export default function AutoresScreen() {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Autores</Text>
        <Text style={[styles.description, { color: colors.textMuted }]}>
          Autores cadastrados na biblioteca.
        </Text>

        {autores.map((autor) => (
          <View
            key={autor.id}
            style={[styles.itemCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <Text style={[styles.itemTitle, { color: colors.text }]}>{autor.nome}</Text>
            <Text style={[styles.itemInfo, { color: colors.textMuted }]}>
              {autor.nacionalidade}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
