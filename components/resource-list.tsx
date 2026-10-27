import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import StatusBadge from '@/components/status-badge';
import { useAppTheme } from '@/contexts/theme-context';
import { list, remove } from '@/services/biblioteca-api';
import { RESOURCES, type ResourceKey } from '@/services/resources';
import { avisar, confirmar } from '@/utils/dialogs';

const PAGE_SIZE = 15;

/** Tela de listagem genérica: busca, paginação infinita, atualização e exclusão. */
export default function ResourceList({ resourceKey }: { resourceKey: ResourceKey }) {
  const resource = RESOURCES[resourceKey];
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<Record<string, string>>();

  const initialTerm = typeof params[resource.search.param] === 'string' ? params[resource.search.param] : '';
  const [draft, setDraft] = useState(initialTerm);
  const [term, setTerm] = useState(initialTerm);
  const [items, setItems] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string>();
  const requestId = useRef(0);

  const load = useCallback(
    async (nextPage: number, mode: 'reset' | 'more' | 'refresh') => {
      const id = ++requestId.current;
      if (mode === 'reset') setLoading(true);
      if (mode === 'more') setLoadingMore(true);
      if (mode === 'refresh') setRefreshing(true);

      try {
        const data = await list<any>(resource.key, resource.embeddedKey, {
          page: nextPage,
          size: PAGE_SIZE,
          search: { [resource.search.param]: term },
        });
        if (id !== requestId.current) return; // resposta antiga (o usuário já mudou a busca)

        setItems((current) => (mode === 'more' ? [...current, ...data.items] : data.items));
        setPage(data.number);
        setTotalPages(data.totalPages);
        setTotal(data.totalElements);
        setError(undefined);
      } catch (e) {
        if (id === requestId.current) setError((e as Error).message);
      } finally {
        if (id === requestId.current) {
          setLoading(false);
          setLoadingMore(false);
          setRefreshing(false);
        }
      }
    },
    [resource, term],
  );

  // Recarrega ao abrir a tela, ao voltar do formulário e quando a busca muda.
  useFocusEffect(
    useCallback(() => {
      load(0, 'reset');
    }, [load]),
  );

  // Espera o usuário parar de digitar antes de buscar.
  useEffect(() => {
    if (resource.search.options) return;
    const timer = setTimeout(() => setTerm(draft.trim()), 400);
    return () => clearTimeout(timer);
  }, [draft, resource.search.options]);

  function openItem(item: any) {
    if (resource.key === 'livros') {
      router.push({ pathname: '/livro-detalhes', params: { id: String(item.id) } });
    } else {
      router.push({ pathname: '/formulario', params: { recurso: resource.key, id: String(item.id) } });
    }
  }

  async function deleteItem(item: any) {
    const ok = await confirmar(
      `Excluir ${resource.singular.toLowerCase()}`,
      `Deseja excluir "${resource.title(item)}"?`,
    );
    if (!ok) return;

    try {
      await remove(resource.key, item.id);
      load(0, 'refresh');
    } catch (e) {
      avisar('Não foi possível excluir', (e as Error).message);
    }
  }

  function editItem(item: any) {
    router.push({ pathname: '/formulario', params: { recurso: resource.key, id: String(item.id) } });
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={styles.toolbar}>
        <View style={styles.pageHeader}>
          <Text style={[styles.count, { color: colors.textMuted }]}>
            {loading || error ? ' ' : total === 1 ? '1 registro' : `${total} registros`}
          </Text>
          <Pressable
            onPress={() => router.push({ pathname: '/formulario', params: { recurso: resource.key } })}
            style={({ pressed }) => [styles.primaryButton, { backgroundColor: colors.primary }, pressed && { opacity: 0.85 }]}
          >
            <Ionicons name="add" size={18} color={colors.onPrimary} />
            <Text style={[styles.primaryButtonText, { color: colors.onPrimary }]}>{resource.newLabel}</Text>
          </Pressable>
        </View>

        {resource.search.options ? (
          <View style={styles.chips}>
            {[{ value: '', label: 'Todos' }, ...resource.search.options].map((option) => {
              const active = term === option.value;
              return (
                <Pressable
                  key={option.value || 'todos'}
                  onPress={() => setTerm(option.value)}
                  style={[
                    styles.chip,
                    { backgroundColor: active ? colors.primary : colors.surface },
                    { borderColor: active ? colors.primary : colors.border },
                  ]}
                >
                  <Text style={[styles.chipText, { color: active ? colors.onPrimary : colors.text }]}>{option.label}</Text>
                </Pressable>
              );
            })}
          </View>
        ) : (
          <View style={[styles.search, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Ionicons name="search" size={17} color={colors.textMuted} />
            <TextInput
              value={draft}
              onChangeText={setDraft}
              placeholder={resource.search.label}
              placeholderTextColor={colors.textMuted}
              returnKeyType="search"
              onSubmitEditing={() => setTerm(draft.trim())}
              style={[styles.searchInput, { color: colors.text }]}
            />
            {draft !== '' && (
              <Pressable onPress={() => setDraft('')} hitSlop={10} accessibilityLabel="Limpar busca">
                <Ionicons name="close" size={18} color={colors.textMuted} />
              </Pressable>
            )}
          </View>
        )}
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        style={styles.list}
        contentContainerStyle={[
          styles.listContent,
          items.length > 0 && [styles.table, { backgroundColor: colors.surface, borderColor: colors.border }],
          { marginBottom: insets.bottom + 24 },
        ]}
        keyboardShouldPersistTaps="handled"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(0, 'refresh')} />}
        onEndReachedThreshold={0.4}
        onEndReached={() => {
          if (!loading && !loadingMore && page < totalPages - 1) load(page + 1, 'more');
        }}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator style={styles.loader} color={colors.primary} />
          ) : error ? (
            <View style={[styles.errorBox, { backgroundColor: colors.dangerSoft }]}>
              <Ionicons name="alert-circle-outline" size={22} color={colors.danger} />
              <Text style={[styles.errorText, { color: colors.danger }]}>{error}</Text>
              <Pressable onPress={() => load(0, 'reset')} style={styles.retry}>
                <Text style={[styles.retryText, { color: colors.danger }]}>Tentar novamente</Text>
              </Pressable>
            </View>
          ) : (
            <View style={[styles.table, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.empty, { color: colors.textMuted }]}>
                {term ? 'Nenhum resultado para a busca.' : resource.emptyLabel}
              </Text>
            </View>
          )
        }
        ListFooterComponent={loadingMore ? <ActivityIndicator style={styles.loader} color={colors.primary} /> : null}
        renderItem={({ item, index }) => {
          const badge = resource.badge?.(item);
          return (
            <Pressable
              onPress={() => openItem(item)}
              style={({ pressed }) => [
                styles.row,
                index > 0 && { borderTopWidth: 1, borderTopColor: colors.border },
                pressed && { backgroundColor: colors.surfaceMuted },
              ]}
            >
              <View style={styles.rowBody}>
                <Text style={[styles.rowTitle, { color: colors.text }]} numberOfLines={2}>
                  {resource.title(item)}
                </Text>
                {resource.subtitle(item) !== '' && (
                  <Text style={[styles.rowSubtitle, { color: colors.textMuted }]} numberOfLines={1}>
                    {resource.subtitle(item)}
                  </Text>
                )}
                {resource.details(item).map((detail) => (
                  <Text key={detail.label} style={[styles.rowDetail, { color: colors.text }]}>
                    <Text style={{ color: colors.textMuted }}>{detail.label}: </Text>
                    {detail.value}
                  </Text>
                ))}
                {badge && (
                  <View style={styles.badgeRow}>
                    <StatusBadge text={badge.text} tone={badge.tone} />
                  </View>
                )}
              </View>

              <View style={styles.actions}>
                <Pressable
                  onPress={() => editItem(item)}
                  hitSlop={6}
                  style={({ pressed }) => [styles.iconButton, pressed && { backgroundColor: colors.surfaceMuted }]}
                  accessibilityLabel={`Editar ${resource.title(item)}`}
                >
                  <Ionicons name="pencil-outline" size={18} color={colors.textMuted} />
                </Pressable>
                <Pressable
                  onPress={() => deleteItem(item)}
                  hitSlop={6}
                  style={({ pressed }) => [styles.iconButton, pressed && { backgroundColor: colors.dangerSoft }]}
                  accessibilityLabel={`Excluir ${resource.title(item)}`}
                >
                  <Ionicons name="trash-outline" size={18} color={colors.textMuted} />
                </Pressable>
              </View>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  toolbar: { paddingHorizontal: 16, paddingTop: 16, gap: 12 },
  pageHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  count: { fontSize: 14 },
  primaryButton: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, height: 42, borderRadius: 8 },
  primaryButtonText: { fontSize: 15, fontWeight: '600' },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 44,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchInput: { flex: 1, fontSize: 15 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 999, borderWidth: 1 },
  chipText: { fontSize: 14, fontWeight: '500' },
  list: { marginTop: 16 },
  listContent: { marginHorizontal: 16, flexGrow: 0 },
  table: {
    borderWidth: 1,
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#141E32',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, paddingVertical: 12, paddingLeft: 16, paddingRight: 8 },
  rowBody: { flex: 1, gap: 3 },
  rowTitle: { fontSize: 15, fontWeight: '600' },
  rowSubtitle: { fontSize: 13 },
  rowDetail: { fontSize: 14 },
  badgeRow: { flexDirection: 'row', marginTop: 4 },
  actions: { flexDirection: 'row' },
  iconButton: { width: 36, height: 36, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  loader: { marginVertical: 30 },
  empty: { paddingVertical: 36, paddingHorizontal: 20, textAlign: 'center', fontSize: 14 },
  errorBox: { padding: 16, borderRadius: 10, alignItems: 'center', gap: 8 },
  errorText: { fontSize: 14, textAlign: 'center' },
  retry: { paddingVertical: 6, paddingHorizontal: 12 },
  retryText: { fontSize: 14, fontWeight: 'bold' },
});
