import { router, useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { useAppTheme } from '@/contexts/theme-context';
import { getBaseUrl, list } from '@/services/biblioteca-api';
import { RESOURCES, STATUS_OPTIONS, type ResourceKey } from '@/services/resources';
import styles from '@/styles/biblioteca.styles';

const modules: { key: ResourceKey; description: string; icon: string }[] = [
  { key: 'emprestimos', description: 'Registre retiradas e devoluções.', icon: '🔄' },
  { key: 'livros', description: 'Consulte e cadastre o acervo.', icon: '📚' },
  { key: 'autores', description: 'Autores das obras cadastradas.', icon: '✍️' },
  { key: 'categorias', description: 'Organize os livros por categoria.', icon: '🏷️' },
  { key: 'usuarios', description: 'Leitores cadastrados na biblioteca.', icon: '👥' },
  { key: 'perfis', description: 'Telefone, endereço e nascimento.', icon: '🪪' },
];

export default function DashboardScreen() {
  const { colors, resolvedMode } = useAppTheme();
  const [counts, setCounts] = useState<Partial<Record<string, number>>>({});
  const [error, setError] = useState<string>();

  const load = useCallback(() => {
    const totals = modules.map((m) =>
      list(m.key, RESOURCES[m.key].embeddedKey, { size: 1 }).then((p) => [m.key, p.totalElements] as const),
    );
    const byStatus = STATUS_OPTIONS.map((o) =>
      list('emprestimos', RESOURCES.emprestimos.embeddedKey, { size: 1, search: { status: o.value } }).then(
        (p) => [o.value, p.totalElements] as const,
      ),
    );

    Promise.all([...totals, ...byStatus])
      .then((entries) => {
        setCounts(Object.fromEntries(entries));
        setError(undefined);
      })
      .catch((e: Error) => setError(e.message));
  }, []);

  // Atualiza os números sempre que o painel volta a ficar visível.
  useFocusEffect(load);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <StatusBar style={resolvedMode === 'dark' ? 'light' : 'dark'} />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.topBar}>
          <View style={[styles.brand, { marginBottom: 0 }]}>
            <Text style={styles.brandSymbol}>B</Text>
            <Text style={[styles.brandName, { color: colors.text }]}>Biblioteca</Text>
          </View>

          <Pressable onPress={() => router.replace('/')}>
            <Text style={[styles.exit, { color: colors.goldText }]}>Sair</Text>
          </Pressable>
        </View>

        <Text style={[styles.eyebrow, { color: colors.goldText }]}>PAINEL</Text>
        <Text style={[styles.title, { color: colors.text }]}>O que você deseja fazer?</Text>

        {error ? (
          <Pressable
            onPress={load}
            style={[styles.itemCard, { backgroundColor: colors.dangerSoft, borderColor: colors.dangerSoft }]}
          >
            <Text style={[styles.itemTitle, { color: colors.danger }]}>API indisponível</Text>
            <Text style={[styles.itemInfo, { color: colors.danger }]}>{error}</Text>
            <Text style={[styles.status, { color: colors.danger }]}>Toque para tentar novamente</Text>
          </Pressable>
        ) : (
          <View style={styles.statusRow}>
            {STATUS_OPTIONS.map((option) => {
              const tone =
                option.value === 'ATIVO' ? colors.success : option.value === 'ATRASADO' ? colors.danger : colors.textMuted;
              return (
                <Pressable
                  key={option.value}
                  style={[styles.statusCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                  onPress={() => router.push({ pathname: '/emprestimos', params: { status: option.value } })}
                >
                  <Text style={[styles.statusValue, { color: tone }]}>{counts[option.value] ?? '–'}</Text>
                  <Text style={[styles.statusLabel, { color: colors.textMuted }]}>{option.label}s</Text>
                </Pressable>
              );
            })}
          </View>
        )}

        <Pressable
          style={[styles.primaryButton, { marginTop: 20 }]}
          onPress={() => router.push({ pathname: '/formulario', params: { recurso: 'emprestimos' } })}
        >
          <Text style={styles.primaryButtonText}>Registrar empréstimo</Text>
        </Pressable>

        <View style={styles.list}>
          {modules.map((module) => (
            <Pressable
              key={module.key}
              style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={() => router.push(`/${module.key}` as const)}
            >
              <Text style={styles.cardIcon}>{module.icon}</Text>

              <View style={styles.cardText}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>{RESOURCES[module.key].label}</Text>
                <Text style={[styles.cardDescription, { color: colors.textMuted }]}>{module.description}</Text>
              </View>

              <Text style={[styles.cardCount, { color: colors.textMuted }]}>{counts[module.key] ?? ''}</Text>
              <Text style={[styles.arrow, { color: colors.goldText }]}>›</Text>
            </Pressable>
          ))}
        </View>

        <Text style={[styles.apiInfo, { color: colors.placeholder }]}>API: {getBaseUrl()}</Text>
      </ScrollView>
    </View>
  );
}
