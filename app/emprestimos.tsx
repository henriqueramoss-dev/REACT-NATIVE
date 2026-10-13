import { ScrollView, Text, View } from 'react-native';

import { useAppTheme } from '@/contexts/theme-context';
import { emprestimos } from '@/data/biblioteca';
import styles from '@/styles/biblioteca.styles';

export default function EmprestimosScreen() {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Meus empréstimos</Text>
        <Text style={[styles.description, { color: colors.textMuted }]}>
          Acompanhe os livros retirados e as datas de devolução.
        </Text>

        {emprestimos.map((emprestimo) => (
          <View
            key={emprestimo.id}
            style={[styles.itemCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <Text style={[styles.itemTitle, { color: colors.text }]}>{emprestimo.livro}</Text>
            <Text style={[styles.itemInfo, { color: colors.textMuted }]}>
              Retirada: {emprestimo.retirada}
            </Text>
            <Text style={[styles.itemInfo, { color: colors.textMuted }]}>
              Devolução: {emprestimo.devolucao}
            </Text>
            <Text style={[styles.status, { color: colors.goldText }]}>{emprestimo.status}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
