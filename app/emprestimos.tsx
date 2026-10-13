import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { useAppTheme } from '@/contexts/theme-context';
import { emprestimos as mockEmprestimos } from '@/data/biblioteca';
import { listarEmprestimos, type EmprestimoApi } from '@/services/biblioteca-api';
import styles from '@/styles/biblioteca.styles';

export default function EmprestimosScreen() {
  const { colors } = useAppTheme();
  const [emprestimos, setEmprestimos] = useState<EmprestimoApi[]>([]);

  useEffect(() => {
    listarEmprestimos()
      .then(setEmprestimos)
      .catch(() =>
        setEmprestimos(
          mockEmprestimos.map((item) => ({
            id: Number(item.id),
            dataEmprestimo: item.retirada,
            dataPrevistaDevolucao: item.devolucao,
            status: item.status,
            usuario: { id: 0, nome: 'Usuário', email: '' },
            livro: {
              id: 0,
              titulo: item.livro,
              isbn: '',
              anoPublicacao: 0,
              categoria: { id: 0, nome: '' },
              autores: [],
            },
          })),
        ),
      );
  }, []);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Empréstimos</Text>
        <Text style={[styles.description, { color: colors.textMuted }]}>
          Empréstimos cadastrados na API.
        </Text>

        {emprestimos.map((emprestimo) => (
          <View key={emprestimo.id} style={[styles.itemCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.itemTitle, { color: colors.text }]}>{emprestimo.livro?.titulo || 'Livro'}</Text>
            <Text style={[styles.itemInfo, { color: colors.textMuted }]}>Retirada: {emprestimo.dataEmprestimo}</Text>
            <Text style={[styles.itemInfo, { color: colors.textMuted }]}>Devolução: {emprestimo.dataPrevistaDevolucao}</Text>
            <Text style={[styles.status, { color: colors.goldText }]}>{emprestimo.status}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
