import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import OptionPicker from '@/components/option-picker';
import { useOptions } from '@/components/use-options';
import { useAppTheme } from '@/contexts/theme-context';
import { RESOURCES, type Field } from '@/services/resources';
import { brToIso, isoToBr, maskDate } from '@/utils/dates';

type Props = {
  field: Field;
  value: string | string[] | undefined;
  error?: string;
  onChange: (value: string | string[]) => void;
};

/** Campo de formulário montado a partir da descrição do recurso (services/resources.ts). */
export default function FormField({ field, value, error, onChange }: Props) {
  const { colors } = useAppTheme();
  const text = typeof value === 'string' ? value : '';

  const inputStyle = [
    styles.input,
    {
      backgroundColor: colors.surface,
      borderColor: error ? colors.danger : colors.borderStrong,
      color: colors.text,
    },
  ];

  let input;
  switch (field.type) {
    case 'enum':
      input = (
        <View style={styles.chips}>
          {field.options.map((option) => {
            const active = text === option.value;
            return (
              <Pressable
                key={option.value}
                onPress={() => onChange(option.value)}
                style={[
                  styles.chip,
                  { borderColor: active ? colors.gold : colors.borderStrong },
                  active && { backgroundColor: colors.gold },
                ]}
                accessibilityRole="radio"
                accessibilityState={{ checked: active }}
              >
                <Text style={[styles.chipText, { color: active ? '#242629' : colors.text }]}>{option.label}</Text>
              </Pressable>
            );
          })}
        </View>
      );
      break;

    case 'relation':
    case 'relations':
      input = (
        <RelationInput
          field={field}
          selected={Array.isArray(value) ? value : text ? [text] : []}
          hasError={!!error}
          onChange={(values) => onChange(field.type === 'relations' ? values : values[0] ?? '')}
        />
      );
      break;

    case 'date':
      input = (
        <View>
          <TextInput
            value={isoToBr(text)}
            onChangeText={(typed) => {
              const masked = maskDate(typed);
              onChange(brToIso(masked) ?? masked);
            }}
            placeholder="DD/MM/AAAA"
            placeholderTextColor={colors.placeholder}
            keyboardType="number-pad"
            maxLength={10}
            style={[inputStyle, styles.inputWithIcon]}
          />
          <Ionicons name="calendar-outline" size={18} color={colors.placeholder} style={styles.inputIcon} />
        </View>
      );
      break;

    default:
      input = (
        <TextInput
          value={text}
          onChangeText={onChange}
          placeholder={field.placeholder}
          placeholderTextColor={colors.placeholder}
          maxLength={field.maxLength}
          keyboardType={field.type === 'email' ? 'email-address' : field.type === 'number' ? 'number-pad' : 'default'}
          autoCapitalize={field.type === 'email' ? 'none' : 'sentences'}
          autoCorrect={field.type === 'text'}
          style={inputStyle}
        />
      );
  }

  return (
    <View style={styles.field}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>
        {field.label}
        {field.required && <Text style={{ color: colors.danger }}> *</Text>}
      </Text>
      {input}
      {error && <Text style={[styles.error, { color: colors.danger }]}>{error}</Text>}
    </View>
  );
}

function RelationInput({
  field,
  selected,
  hasError,
  onChange,
}: {
  field: Extract<Field, { type: 'relation' | 'relations' }>;
  selected: string[];
  hasError: boolean;
  onChange: (values: string[]) => void;
}) {
  const { colors } = useAppTheme();
  const { options, loaded, error, reload } = useOptions(field.resource);
  const [open, setOpen] = useState(false);
  const target = RESOURCES[field.resource];
  const multiple = field.type === 'relations';

  const labels = selected.map((v) => options.find((o) => o.value === v)?.label ?? `#${v}`);
  const summary = !loaded && selected.length ? 'Carregando…' : labels.join(', ');

  function openPicker() {
    reload();
    setOpen(true);
  }

  return (
    <>
      <Pressable
        onPress={openPicker}
        style={[
          styles.input,
          styles.select,
          { backgroundColor: colors.surface, borderColor: hasError ? colors.danger : colors.borderStrong },
        ]}
        accessibilityRole="button"
        accessibilityLabel={`Selecionar ${field.label}`}
      >
        <Text
          numberOfLines={1}
          style={[styles.selectText, { color: summary ? colors.text : colors.placeholder }]}
        >
          {summary || (multiple ? 'Selecione um ou mais' : 'Selecione…')}
        </Text>
        <Ionicons name="chevron-down" size={18} color={colors.textMuted} />
      </Pressable>

      <OptionPicker
        visible={open}
        title={field.label}
        options={options}
        selected={selected}
        multiple={multiple}
        error={error}
        emptyText={`Nenhum registro em ${target.label.toLowerCase()}.`}
        onCreate={() => {
          setOpen(false);
          router.push({ pathname: '/formulario', params: { recurso: target.key } });
        }}
        onChange={onChange}
        onClose={() => setOpen(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  field: { gap: 8 },
  label: { fontSize: 13, fontWeight: 'bold' },
  input: { minHeight: 50, borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, fontSize: 15 },
  inputWithIcon: { paddingRight: 42 },
  inputIcon: { position: 'absolute', right: 14, top: 16 },
  select: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  selectText: { flex: 1, fontSize: 15 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 999, borderWidth: 1 },
  chipText: { fontSize: 14, fontWeight: 'bold' },
  error: { fontSize: 12 },
});
