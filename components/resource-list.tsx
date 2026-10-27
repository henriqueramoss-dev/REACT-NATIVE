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

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={styles.toolbar}>
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
                    { borderColor: active ? colors.gold : colors.borderStrong },
                    active && { backgroundColor: colors.gold },
                  ]}
                >
                  <Text style={[styles.chipText, { color: active ? '#242629' : colors.text }]}>{option.label}</Text>
                </Pressable>
              );
            })}
          </View>
        ) : (
          <View style={[styles.search, { backgroundColor: colors.surface, borderColor: colors.borderStrong }]}>
            <Ionicons name="search" size={18} color={colors.placeholder} />
            <TextInput
              value={draft}
              onChangeText={setDraft}
              placeholder={resource.search.label}
              placeholderTextColor={colors.placeholder}
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

        {!loading && !error && (
          <Text style={[styles.count, { color: colors.textMuted }]}>
            {total === 1 ? '1 registro' : `${total} registros`}
          </Text>
        )}
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 100 }]}
        keyboardShouldPersistTaps="handled"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(0, 'refresh')} />}
        onEndReachedThreshold={0.4}
        onEndReached={() => {
          if (!loading && !loadingMore && page < totalPages - 1) load(page + 1, 'more');
        }}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator style={styles.loader} color={colors.gold} />
          ) : error ? (
            <View style={[styles.errorBox, { backgroundColor: colors.dangerSoft }]}>
              <Ionicons name="alert-circle-outline" size={22} color={colors.danger} />
              <Text style={[styles.errorText, { color: colors.danger }]}>{error}</Text>
              <Pressable onPress={() => load(0, 'reset')} style={styles.retry}>
                <Text style={[styles.retryText, { color: colors.danger }]}>Tentar novamente</Text>
              </Pressable>
            </View>
          ) : (
            <Text style={[styles.empty, { color: colors.textMuted }]}>
              {term ? 'Nenhum resultado para a busca.' : resource.emptyLabel}
            </Text>
          )
        }
        ListFooterComponent={loadingMore ? <ActivityIndicator style={styles.loader} color={colors.gold} /> : null}
        renderItem={({ item }) => {
          const badge = resource.badge?.(item);
          return (
            <Pressable
              onPress={() => openItem(item)}
              style={({ pressed }) => [
                styles.card,
                { backgroundColor: colors.surface, borderColor: colors.border },
                pressed && { opacity: 0.85 },
              ]}
            >
              <View style={styles.cardBody}>
                <View style={styles.cardTitleRow}>
                  <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={2}>
                    {resource.title(item)}
                  </Text>
                  {badge && <StatusBadge text={badge.text} tone={badge.tone} />}
                </View>
                <Text style={[styles.cardSubtitle, { color: colors.textMuted }]} numberOfLines={1}>
                  {resource.subtitle(item)}
                </Text>
                {resource.details(item).map((detail) => (
                  <Text key={detail.label} style={[styles.cardDetail, { color: colors.textMuted }]}>
                    <Text style={{ fontWeight: 'bold' }}>{detail.label}: </Text>
                    {detail.value}
                  </Text>
                ))}
              </View>

              <Pressable
                onPress={() => deleteItem(item)}
                hitSlop={10}
                style={styles.deleteButton}
                accessibilityLabel={`Excluir ${resource.title(item)}`}
              >
                <Ionicons name="trash-outline" size={20} color={colors.danger} />
              </Pressable>
            </Pressable>
          );
        }}
      />

      <Pressable
        onPress={() => router.push({ pathname: '/formulario', params: { recurso: resource.key } })}
        style={[styles.fab, { bottom: insets.bottom + 24 }]}
        accessibilityLabel={resource.newLabel}
      >
        <Ionicons name="add" size={22} color="#242629" />
        <Text style={styles.fabText}>{resource.newLabel}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  toolbar: { paddingHorizontal: 20, paddingTop: 12, gap: 10 },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 48,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
  },
  searchInput: { flex: 1, fontSize: 15 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, borderWidth: 1 },
  chipText: { fontSize: 13, fontWeight: 'bold' },
  count: { fontSize: 13 },
  listContent: { padding: 20, paddingTop: 10, gap: 12 },
  card: { flexDirection: 'row', alignItems: 'flex-start', borderWidth: 1, borderRadius: 12, padding: 16, gap: 12 },
  cardBody: { flex: 1, gap: 4 },
  cardTitleRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 },
  cardTitle: { flex: 1, fontSize: 17, fontWeight: 'bold' },
  cardSubtitle: { fontSize: 14 },
  cardDetail: { fontSize: 13 },
  deleteButton: { padding: 4 },
  loader: { marginTop: 40 },
  empty: { marginTop: 40, textAlign: 'center', fontSize: 14 },
  errorBox: { marginTop: 20, padding: 16, borderRadius: 12, alignItems: 'center', gap: 8 },
  errorText: { fontSize: 14, textAlign: 'center' },
  retry: { paddingVertical: 6, paddingHorizontal: 12 },
  retryText: { fontSize: 14, fontWeight: 'bold' },
  fab: {
    position: 'absolute',
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 52,
    paddingHorizontal: 20,
    borderRadius: 26,
    backgroundColor: '#C49A3A',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  fabText: { color: '#242629', fontSize: 15, fontWeight: 'bold' },
});
