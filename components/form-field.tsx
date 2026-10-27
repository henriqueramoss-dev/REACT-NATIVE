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
      borderColor: error ? colors.danger : colors.border,
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
                  { backgroundColor: active ? colors.primary : colors.surface },
                  { borderColor: active ? colors.primary : colors.border },
                ]}
                accessibilityRole="radio"
                accessibilityState={{ checked: active }}
              >
                <Text style={[styles.chipText, { color: active ? colors.onPrimary : colors.text }]}>{option.label}</Text>
              </Pressable>
            );
          })}
        </View>
      );
      break;

    case 'relations':
      // Igual ao site: uma caixa de seleção para cada opção.
      input = (
        <CheckList
          field={field}
          selected={Array.isArray(value) ? value : []}
          onChange={onChange}
        />
      );
      break;

    case 'relation':
      input = (
        <RelationInput
          field={field}
          selected={Array.isArray(value) ? value : text ? [text] : []}
          hasError={!!error}
          onChange={(values) => onChange(values[0] ?? '')}
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
      <Text style={[styles.label, { color: colors.text }]}>
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
  field: Extract<Field, { type: 'relation' }>;
  selected: string[];
  hasError: boolean;
  onChange: (values: string[]) => void;
}) {
  const { colors } = useAppTheme();
  const { options, loaded, error, reload } = useOptions(field.resource);
  const [open, setOpen] = useState(false);
  const target = RESOURCES[field.resource];

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
          { backgroundColor: colors.surface, borderColor: hasError ? colors.danger : colors.border },
        ]}
        accessibilityRole="button"
        accessibilityLabel={`Selecionar ${field.label}`}
      >
        <Text
          numberOfLines={1}
          style={[styles.selectText, { color: summary ? colors.text : colors.placeholder }]}
        >
          {summary || 'Selecione…'}
        </Text>
        <Ionicons name="chevron-down" size={18} color={colors.textMuted} />
      </Pressable>

      <OptionPicker
        visible={open}
        title={field.label}
        options={options}
        selected={selected}
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

function CheckList({
  field,
  selected,
  onChange,
}: {
  field: Extract<Field, { type: 'relations' }>;
  selected: string[];
  onChange: (values: string[]) => void;
}) {
  const { colors } = useAppTheme();
  const { options, loaded, error } = useOptions(field.resource);
  const target = RESOURCES[field.resource];

  if (error) return <Text style={[styles.error, { color: colors.danger }]}>{error}</Text>;
  if (!loaded) return <Text style={[styles.hint, { color: colors.textMuted }]}>Carregando…</Text>;
  if (options.length === 0) {
    return (
      <Pressable onPress={() => router.push({ pathname: '/formulario', params: { recurso: target.key } })}>
        <Text style={[styles.hint, { color: colors.textMuted }]}>
          Nenhum registro em {target.label.toLowerCase()}.{' '}
          <Text style={{ color: colors.primary, fontWeight: '600' }}>Cadastrar agora</Text>
        </Text>
      </Pressable>
    );
  }

  return (
    <View style={styles.chips}>
      {options.map((option) => {
        const on = selected.includes(option.value);
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(on ? selected.filter((v) => v !== option.value) : [...selected, option.value])}
            style={[
              styles.check,
              { borderColor: on ? colors.primary : colors.border },
              { backgroundColor: on ? colors.primarySoft : colors.surface },
            ]}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: on }}
          >
            <Ionicons
              name={on ? 'checkbox' : 'square-outline'}
              size={18}
              color={on ? colors.primary : colors.textMuted}
            />
            <Text style={[styles.checkText, { color: colors.text }]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { gap: 6 },
  label: { fontSize: 14, fontWeight: '600' },
  input: { minHeight: 44, borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, fontSize: 15 },
  inputWithIcon: { paddingRight: 40 },
  inputIcon: { position: 'absolute', right: 12, top: 13 },
  select: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  selectText: { flex: 1, fontSize: 15 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 999, borderWidth: 1 },
  chipText: { fontSize: 14, fontWeight: '500' },
  check: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderRadius: 8 },
  checkText: { fontSize: 14, fontWeight: '500' },
  hint: { fontSize: 14 },
  error: { fontSize: 13 },
});
