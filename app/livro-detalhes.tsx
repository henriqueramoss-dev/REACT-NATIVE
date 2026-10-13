import { useLocalSearchParams } from 'expo-router';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';

import { useAppTheme } from '@/contexts/theme-context';
import { livros } from '@/data/biblioteca';
import styles from '@/styles/biblioteca.styles';

export default function LivroDetalhesScreen() {
  const { colors } = useAppTheme();
  const { id } = useLocalSearchParams<{ id?: string }>();

  const livro = livros.find((item) => item.id === id);

  if (!livro) {
    return (
      <View style={[styles.screen, { backgroundColor: colors.background }]}>
        <Text style={[styles.empty, { color: colors.text }]}>Livro não encontrado.</Text>
      </View>
    );
  }

  function solicitarEmprestimo() {
    Alert.alert(
      'Empréstimo',
      livro?.disponivel
        ? 'Solicitação de empréstimo registrada nesta demonstração.'
        : 'Este livro não está disponível no momento.',
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>{livro.titulo}</Text>
        <Text style={[styles.description, { color: colors.textMuted }]}>{livro.autor}</Text>

        <Text style={[styles.detailLabel, { color: colors.textMuted }]}>Categoria</Text>
        <Text style={[styles.detailValue, { color: colors.text }]}>{livro.categoria}</Text>

        <Text style={[styles.detailLabel, { color: colors.textMuted }]}>Ano</Text>
        <Text style={[styles.detailValue, { color: colors.text }]}>{livro.ano}</Text>

        <Text style={[styles.detailLabel, { color: colors.textMuted }]}>ISBN</Text>
        <Text style={[styles.detailValue, { color: colors.text }]}>{livro.isbn}</Text>

        <Text style={[styles.detailLabel, { color: colors.textMuted }]}>Descrição</Text>
        <Text style={[styles.detailValue, { color: colors.text }]}>{livro.descricao}</Text>

        <Text
          style={[
            styles.status,
            { color: livro.disponivel ? '#2E7D32' : '#B3261E' },
          ]}
        >
          {livro.disponivel ? 'Disponível para empréstimo' : 'Livro emprestado'}
        </Text>

        <Pressable style={styles.primaryButton} onPress={solicitarEmprestimo}>
          <Text style={styles.primaryButtonText}>Solicitar empréstimo</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
