import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppTheme } from '@/contexts/theme-context';
import type { Option } from '@/services/resources';

type Props = {
  visible: boolean;
  title: string;
  options: Option[];
  selected: string[];
  multiple?: boolean;
  emptyText: string;
  error?: string;
  onCreate?: () => void;
  onChange: (values: string[]) => void;
  onClose: () => void;
};

/** Lista de opções em um modal, com busca. Usada nos campos de relacionamento. */
export default function OptionPicker({
  visible,
  title,
  options,
  selected,
  multiple,
  emptyText,
  error,
  onCreate,
  onChange,
  onClose,
}: Props) {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');

  const term = search.trim().toLowerCase();
  const filtered = term ? options.filter((o) => o.label.toLowerCase().includes(term)) : options;

  function toggle(value: string) {
    if (!multiple) {
      onChange([value]);
      close();
      return;
    }

    onChange(selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value]);
  }

  function close() {
    setSearch('');
    onClose();
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={close}>
      <Pressable style={[styles.overlay, { backgroundColor: colors.overlay }]} onPress={close} />

      <View
        style={[
          styles.sheet,
          { backgroundColor: colors.surface, borderColor: colors.border, paddingBottom: insets.bottom + 16 },
        ]}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          <Pressable onPress={close} hitSlop={12} accessibilityLabel="Fechar">
            <Ionicons name="close" size={24} color={colors.textMuted} />
          </Pressable>
        </View>

        {options.length > 6 && (
          <View style={[styles.search, { borderColor: colors.border, backgroundColor: colors.surface }]}>
            <Ionicons name="search" size={18} color={colors.placeholder} />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Pesquisar"
              placeholderTextColor={colors.placeholder}
              style={[styles.searchInput, { color: colors.text }]}
            />
          </View>
        )}

        {error && <Text style={[styles.message, { color: colors.danger }]}>{error}</Text>}

        <FlatList
          data={filtered}
          keyExtractor={(item) => item.value}
          keyboardShouldPersistTaps="handled"
          style={styles.list}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={[styles.message, { color: colors.textMuted }]}>
                {term ? 'Nenhum resultado para a pesquisa.' : emptyText}
              </Text>
              {!term && onCreate && (
                <Pressable onPress={onCreate} style={[styles.createButton, { backgroundColor: colors.primary }]}>
                  <Text style={[styles.createButtonText, { color: colors.onPrimary }]}>Cadastrar agora</Text>
                </Pressable>
              )}
            </View>
          }
          renderItem={({ item }) => {
            const isSelected = selected.includes(item.value);
            return (
              <Pressable
                onPress={() => toggle(item.value)}
                style={[styles.option, { borderColor: colors.border }]}
                accessibilityRole={multiple ? 'checkbox' : 'radio'}
                accessibilityState={{ checked: isSelected }}
              >
                <Text style={[styles.optionText, { color: colors.text }]}>{item.label}</Text>
                <Ionicons
                  name={isSelected ? 'checkmark-circle' : 'ellipse-outline'}
                  size={22}
                  color={isSelected ? colors.primary : colors.borderStrong}
                />
              </Pressable>
            );
          }}
        />

        {multiple && (
          <Pressable onPress={close} style={[styles.doneButton, { backgroundColor: colors.primary }]}>
            <Text style={[styles.doneButtonText, { color: colors.onPrimary }]}>
              Concluir{selected.length ? ` (${selected.length})` : ''}
            </Text>
          </Pressable>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1 },
  sheet: {
    maxHeight: '75%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  title: { fontSize: 18, fontWeight: 'bold' },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 44,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  searchInput: { flex: 1, fontSize: 15 },
  list: { flexGrow: 0 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  optionText: { flex: 1, fontSize: 15 },
  empty: { paddingVertical: 24, alignItems: 'center', gap: 14 },
  message: { fontSize: 14, textAlign: 'center' },
  createButton: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 8 },
  createButtonText: { fontWeight: '600' },
  doneButton: {
    marginTop: 14,
    height: 46,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneButtonText: { fontSize: 15, fontWeight: '600' },
});
