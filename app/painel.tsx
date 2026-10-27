import { Ionicons } from '@expo/vector-icons';
import { router, Stack, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { RESOURCE_ICONS } from '@/components/resource-icons';
import StatusBadge from '@/components/status-badge';
import { useAppTheme } from '@/contexts/theme-context';
import { getBaseUrl, list } from '@/services/biblioteca-api';
import { RESOURCES, STATUS_OPTIONS, type Emprestimo, type ResourceKey } from '@/services/resources';

const MODULES = Object.keys(RESOURCE_ICONS) as ResourceKey[];

export default function DashboardScreen() {
  const { colors } = useAppTheme();
  const [counts, setCounts] = useState<Partial<Record<string, number>>>({});
  const [recentes, setRecentes] = useState<Emprestimo[]>([]);
  const [error, setError] = useState<string>();

  const load = useCallback(() => {
    const emp = RESOURCES.emprestimos;
    const totals = MODULES.map((key) =>
      list(key, RESOURCES[key].embeddedKey, { size: 1 }).then((p) => [key, p.totalElements] as const),
    );
    const byStatus = STATUS_OPTIONS.map((o) =>
      list(emp.key, emp.embeddedKey, { size: 1, search: { status: o.value } }).then(
        (p) => [o.value, p.totalElements] as const,
      ),
    );

    // allSettled: se uma contagem falhar, as outras continuam aparecendo.
    Promise.allSettled([...totals, ...byStatus]).then((results) => {
      const ok = results.flatMap((r) => (r.status === 'fulfilled' ? [r.value] : []));
      const failed = results.find((r): r is PromiseRejectedResult => r.status === 'rejected');

      setCounts((current) => ({ ...current, ...Object.fromEntries(ok) }));
      setError(failed ? (failed.reason as Error).message : undefined);
    });

    list<Emprestimo>(emp.key, emp.embeddedKey, { size: 5, sort: 'id,desc' })
      .then((p) => setRecentes(p.items))
      .catch(() => {});
  }, []);

  // Atualiza os números sempre que o painel volta a ficar visível.
  useFocusEffect(load);

  const statusTone: Record<string, string> = {
    ATIVO: colors.success,
    DEVOLVIDO: colors.textMuted,
    ATRASADO: colors.danger,
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          headerTitle: () => (
            <View style={styles.brand}>
              <Ionicons name="book-outline" size={20} color={colors.headerText} />
              <Text style={[styles.brandText, { color: colors.headerText }]}>Biblioteca</Text>
            </View>
          ),
          headerBackVisible: false,
          headerRight: () => (
            <Pressable onPress={() => router.replace('/')} hitSlop={10}>
              <Text style={[styles.exit, { color: colors.headerText }]}>Sair</Text>
            </Pressable>
          ),
        }}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.pageHeader}>
          <View style={styles.pageHeaderText}>
            <Text style={[styles.title, { color: colors.text }]}>Início</Text>
            <Text style={[styles.subtitle, { color: colors.textMuted }]}>Visão geral do acervo e dos empréstimos.</Text>
          </View>
          <Pressable
            onPress={() => router.push({ pathname: '/formulario', params: { recurso: 'emprestimos' } })}
            style={({ pressed }) => [styles.primaryButton, { backgroundColor: colors.primary }, pressed && styles.pressed]}
          >
            <Ionicons name="add" size={18} color={colors.onPrimary} />
            <Text style={[styles.primaryButtonText, { color: colors.onPrimary }]}>Novo empréstimo</Text>
          </Pressable>
        </View>

        {error && (
          <Pressable onPress={load} style={[styles.alert, { backgroundColor: colors.dangerSoft }]}>
            <Text style={[styles.alertText, { color: colors.danger }]}>{error}</Text>
            <Text style={[styles.alertAction, { color: colors.danger }]}>Toque para tentar novamente</Text>
          </Pressable>
        )}

        <View style={styles.stats}>
          {STATUS_OPTIONS.map((option) => (
            <Pressable
              key={option.value}
              onPress={() => router.push({ pathname: '/emprestimos', params: { status: option.value } })}
              style={[
                styles.stat,
                { backgroundColor: colors.surface, borderColor: colors.border, borderLeftColor: statusTone[option.value] },
              ]}
            >
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>
                Empréstimos {option.label.toLowerCase()}s
              </Text>
              <Text style={[styles.statValue, { color: colors.text }]}>{counts[option.value] ?? '–'}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.tiles}>
          {MODULES.map((key) => (
            <Pressable
              key={key}
              onPress={() => router.push(`/${key}` as const)}
              style={({ pressed }) => [
                styles.tile,
                { backgroundColor: colors.surface, borderColor: pressed ? colors.primary : colors.border },
              ]}
            >
              <View style={[styles.tileIcon, { backgroundColor: colors.primarySoft }]}>
                <Ionicons name={RESOURCE_ICONS[key]} size={22} color={colors.primary} />
              </View>
              <View>
                <Text style={[styles.tileValue, { color: colors.text }]}>{counts[key] ?? '–'}</Text>
                <Text style={[styles.tileLabel, { color: colors.textMuted }]}>{RESOURCES[key].label}</Text>
              </View>
            </Pressable>
          ))}
        </View>

        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={[styles.cardHeader, { borderBottomColor: colors.border }]}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Empréstimos recentes</Text>
            <Pressable onPress={() => router.push('/emprestimos')} hitSlop={8}>
              <Text style={[styles.link, { color: colors.primary }]}>Ver todos</Text>
            </Pressable>
          </View>

          {recentes.length === 0 ? (
            <Text style={[styles.empty, { color: colors.textMuted }]}>Nenhum empréstimo registrado ainda.</Text>
          ) : (
            recentes.map((e, index) => {
              const badge = RESOURCES.emprestimos.badge?.(e);
              return (
                <Pressable
                  key={e.id}
                  onPress={() =>
                    router.push({ pathname: '/formulario', params: { recurso: 'emprestimos', id: String(e.id) } })
                  }
                  style={({ pressed }) => [
                    styles.recent,
                    index > 0 && { borderTopWidth: 1, borderTopColor: colors.border },
                    pressed && { backgroundColor: colors.surfaceMuted },
                  ]}
                >
                  <Text style={[styles.recentText, { color: colors.textMuted }]} numberOfLines={1}>
                    <Text style={[styles.recentTitle, { color: colors.text }]}>{e.livro?.titulo}</Text> ·{' '}
                    {e.usuario?.nome}
                  </Text>
                  {badge && <StatusBadge text={badge.text} tone={badge.tone} />}
                </Pressable>
              );
            })
          )}
        </View>

        <Text style={[styles.apiInfo, { color: colors.placeholder }]}>API: {getBaseUrl()}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: 16, paddingTop: 22, paddingBottom: 40 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  brandText: { fontSize: 17, fontWeight: 'bold' },
  exit: { fontSize: 15, fontWeight: '600', paddingHorizontal: 12 },
  pageHeader: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 14, marginBottom: 18 },
  pageHeaderText: { flexGrow: 1, flexShrink: 1, minWidth: 180 },
  title: { fontSize: 24, fontWeight: 'bold' },
  subtitle: { marginTop: 4, fontSize: 14 },
  primaryButton: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, height: 42, borderRadius: 8 },
  primaryButtonText: { fontSize: 15, fontWeight: '600' },
  pressed: { opacity: 0.85 },
  alert: { borderRadius: 8, padding: 12, marginBottom: 14, gap: 4 },
  alertText: { fontSize: 14, fontWeight: '500' },
  alertAction: { fontSize: 13, fontWeight: 'bold' },
  stats: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  stat: { flex: 1, borderWidth: 1, borderLeftWidth: 4, borderRadius: 10, paddingVertical: 12, paddingHorizontal: 12, gap: 4 },
  statLabel: { fontSize: 12 },
  statValue: { fontSize: 26, fontWeight: 'bold' },
  tiles: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  tile: { flexBasis: '47%', flexGrow: 1, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderRadius: 10, padding: 14 },
  tileIcon: { width: 42, height: 42, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  tileValue: { fontSize: 20, fontWeight: 'bold' },
  tileLabel: { fontSize: 13 },
  card: {
    borderWidth: 1,
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#141E32',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1 },
  cardTitle: { fontSize: 16, fontWeight: 'bold' },
  link: { fontSize: 14, fontWeight: '500' },
  empty: { paddingVertical: 28, paddingHorizontal: 16, textAlign: 'center', fontSize: 14 },
  recent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, paddingHorizontal: 16, paddingVertical: 12 },
  recentText: { flex: 1, fontSize: 14 },
  recentTitle: { fontWeight: 'bold' },
  apiInfo: { marginTop: 24, textAlign: 'center', fontSize: 11 },
});
