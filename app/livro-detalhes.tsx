import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';

import StatusBadge from '@/components/status-badge';
import { useAppTheme } from '@/contexts/theme-context';
import { get, list, remove } from '@/services/biblioteca-api';
import { formatDate, RESOURCES, type Emprestimo, type Livro } from '@/services/resources';
import styles from '@/styles/biblioteca.styles';
import { avisar, confirmar } from '@/utils/dialogs';

export default function LivroDetalhesScreen() {
  const { colors } = useAppTheme();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [livro, setLivro] = useState<Livro>();
  const [emprestimoAtual, setEmprestimoAtual] = useState<Emprestimo>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [situacaoErro, setSituacaoErro] = useState(false);

  // Recarrega ao voltar da edição do livro ou do cadastro de empréstimo.
  useFocusEffect(
    useCallback(() => {
      if (!id) return;

      get<Livro>('livros', Number(id))
        .then(async (data) => {
          setLivro(data);
          setError(undefined);

          // A API não filtra empréstimos por livro; buscamos os mais recentes e filtramos aqui.
          try {
            const emprestimos = await list<Emprestimo>('emprestimos', RESOURCES.emprestimos.embeddedKey, {
              size: 200,
              sort: 'id,desc',
            });
            setEmprestimoAtual(
              emprestimos.items.find((e) => e.livro?.id === data.id && e.status !== 'DEVOLVIDO'),
            );
            setSituacaoErro(false);
          } catch {
            setSituacaoErro(true);
          }
        })
        .catch((e: Error) => setError(e.message))
        .finally(() => setLoading(false));
    }, [id]),
  );

  async function excluir() {
    if (!livro) return;
    const ok = await confirmar('Excluir livro', `Deseja excluir "${livro.titulo}"?`);
    if (!ok) return;

    try {
      await remove('livros', livro.id);
      if (router.canGoBack()) router.back();
      else router.replace('/livros');
    } catch (e) {
      avisar('Não foi possível excluir', (e as Error).message);
    }
  }

  if (loading) {
    return (
      <View style={[styles.screen, { backgroundColor: colors.background }]}>
        <ActivityIndicator style={{ marginTop: 40 }} color={colors.gold} />
      </View>
    );
  }

  if (!livro) {
    return (
      <View style={[styles.screen, { backgroundColor: colors.background }]}>
        <Text style={[styles.empty, { color: colors.text }]}>{error ?? 'Livro não encontrado.'}</Text>
      </View>
    );
  }

  const disponivel = !emprestimoAtual;
  const badge = emprestimoAtual ? RESOURCES.emprestimos.badge?.(emprestimoAtual) : undefined;

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.eyebrow, { color: colors.goldText }]}>{livro.categoria?.nome?.toUpperCase()}</Text>
        <Text style={[styles.title, { color: colors.text }]}>{livro.titulo}</Text>
        <Text style={[styles.description, { color: colors.textMuted }]}>
          {livro.autores.map((autor) => autor.nome).join(', ') || 'Autor não informado'}
        </Text>

        <Text style={[styles.detailLabel, { color: colors.textMuted }]}>Ano de publicação</Text>
        <Text style={[styles.detailValue, { color: colors.text }]}>{livro.anoPublicacao}</Text>

        <Text style={[styles.detailLabel, { color: colors.textMuted }]}>ISBN</Text>
        <Text style={[styles.detailValue, { color: colors.text }]}>{livro.isbn}</Text>

        <Text style={[styles.detailLabel, { color: colors.textMuted }]}>Situação</Text>
        <View style={[styles.itemCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {situacaoErro ? (
            <Text style={[styles.itemInfo, { color: colors.textMuted }]}>
              Não foi possível consultar os empréstimos deste livro.
            </Text>
          ) : disponivel ? (
            <Text style={[styles.itemTitle, { color: colors.success }]}>Disponível para empréstimo</Text>
          ) : (
            <>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={[styles.itemTitle, { color: colors.text }]}>Emprestado</Text>
                {badge && <StatusBadge text={badge.text} tone={badge.tone} />}
              </View>
              <Text style={[styles.itemInfo, { color: colors.textMuted }]}>
                Com {emprestimoAtual?.usuario?.nome} · devolução prevista em{' '}
                {formatDate(emprestimoAtual?.dataPrevistaDevolucao)}
              </Text>
            </>
          )}
        </View>

        {disponivel ? (
          <Pressable
            style={styles.primaryButton}
            onPress={() =>
              router.push({ pathname: '/formulario', params: { recurso: 'emprestimos', livroId: String(livro.id) } })
            }
          >
            <Text style={styles.primaryButtonText}>Registrar empréstimo</Text>
          </Pressable>
        ) : (
          <Pressable
            style={styles.primaryButton}
            onPress={() =>
              router.push({
                pathname: '/formulario',
                params: { recurso: 'emprestimos', id: String(emprestimoAtual?.id) },
              })
            }
          >
            <Text style={styles.primaryButtonText}>Ver empréstimo</Text>
          </Pressable>
        )}

        <Pressable
          style={[styles.secondaryButton, { borderColor: colors.borderStrong }]}
          onPress={() => router.push({ pathname: '/formulario', params: { recurso: 'livros', id: String(livro.id) } })}
        >
          <Text style={[styles.secondaryButtonText, { color: colors.text }]}>Editar livro</Text>
        </Pressable>

        <Pressable onPress={excluir}>
          <Text style={[styles.demoLink, { color: colors.danger }]}>Excluir livro</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
