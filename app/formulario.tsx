import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import FormField from '@/components/form-field';
import { useAppTheme } from '@/contexts/theme-context';
import { ApiError, create, get, remove, update } from '@/services/biblioteca-api';
import { isResourceKey, RESOURCES, validate, type FormValues } from '@/services/resources';
import { avisar, confirmar } from '@/utils/dialogs';

// A API devolve erros de relacionamento pelo nome da entidade ("usuario");
// no formulário o campo se chama "usuarioId".
const API_FIELD_ALIASES: Record<string, string> = {
  usuario: 'usuarioId',
  livro: 'livroId',
  categoria: 'categoriaId',
};

/**
 * Formulário de cadastro/edição de qualquer recurso.
 * Parâmetros: recurso (obrigatório), id (edição) e, opcionalmente,
 * valores iniciais com o nome do campo (ex.: livroId=3).
 */
export default function FormScreen() {
  const { colors } = useAppTheme();
  const params = useLocalSearchParams<Record<string, string>>();
  const resource = isResourceKey(params.recurso) ? RESOURCES[params.recurso] : undefined;
  const id = params.id ? Number(params.id) : undefined;
  const editing = id !== undefined;

  const [values, setValues] = useState<FormValues>(() => {
    const initial = resource?.toForm() ?? {};
    resource?.fields.forEach((field) => {
      const preset = params[field.name];
      if (typeof preset === 'string' && preset !== '') {
        initial[field.name] = field.type === 'relations' ? preset.split(',') : preset;
      }
    });
    return initial;
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string>();
  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!resource || id === undefined) return;

    get(resource.key, id)
      .then((item) => setValues(resource.toForm(item)))
      .catch((e: Error) => setMessage(e.message))
      .finally(() => setLoading(false));
  }, [resource, id]);

  if (!resource) {
    return (
      <View style={[styles.screen, { backgroundColor: colors.background }]}>
        <Text style={[styles.message, { color: colors.text }]}>Recurso inválido.</Text>
      </View>
    );
  }

  const current = resource;

  // Se o formulário foi aberto direto pela URL, não há tela anterior: volta para a lista.
  function goBack() {
    if (router.canGoBack()) router.back();
    else router.replace(`/${current.key}`);
  }

  function setField(name: string, value: string | string[]) {
    setValues((v) => ({ ...v, [name]: value }));
    setErrors(({ [name]: _removed, ...rest }) => rest);
  }

  async function save() {
    const local = validate(current, values);
    setErrors(local);
    if (Object.keys(local).length) {
      setMessage('Corrija os campos destacados.');
      return;
    }

    setSaving(true);
    setMessage(undefined);
    try {
      const payload = current.toPayload(values);
      if (id !== undefined) await update(current.key, id, payload);
      else await create(current.key, payload);
      goBack();
    } catch (e) {
      const apiError = e as ApiError;
      setMessage(apiError.message);
      setErrors(
        Object.fromEntries(
          Object.entries(apiError.campos ?? {}).map(([field, text]) => [API_FIELD_ALIASES[field] ?? field, text]),
        ),
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteRecord() {
    if (id === undefined) return;
    const ok = await confirmar(
      `Excluir ${current.singular.toLowerCase()}`,
      'Esta ação não pode ser desfeita.',
    );
    if (!ok) return;

    try {
      await remove(current.key, id);
      goBack();
    } catch (e) {
      avisar('Não foi possível excluir', (e as Error).message);
    }
  }

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Stack.Screen options={{ title: editing ? `Editar ${current.singular.toLowerCase()}` : current.newLabel }} />

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {message && (
          <View style={[styles.alert, { backgroundColor: colors.dangerSoft }]}>
            <Text style={[styles.alertText, { color: colors.danger }]}>{message}</Text>
          </View>
        )}

        {loading ? (
          <ActivityIndicator style={styles.loader} color={colors.gold} />
        ) : (
          <View style={styles.fields}>
            {current.fields.map((field) => (
              <FormField
                key={field.name}
                field={field}
                value={values[field.name]}
                error={errors[field.name]}
                onChange={(value) => setField(field.name, value)}
              />
            ))}
          </View>
        )}

        <Pressable
          onPress={save}
          disabled={saving || loading}
          style={({ pressed }) => [styles.primaryButton, (saving || loading) && styles.disabled, pressed && styles.pressed]}
        >
          {saving ? <ActivityIndicator color="#242629" /> : <Text style={styles.primaryButtonText}>Salvar</Text>}
        </Pressable>

        {editing && !loading && (
          <Pressable onPress={deleteRecord} style={styles.deleteButton}>
            <Text style={[styles.deleteButtonText, { color: colors.danger }]}>
              Excluir {current.singular.toLowerCase()}
            </Text>
          </Pressable>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { flexGrow: 1, padding: 20, paddingBottom: 40 },
  fields: { gap: 18 },
  loader: { marginVertical: 40 },
  message: { marginTop: 40, textAlign: 'center', fontSize: 15 },
  alert: { borderRadius: 10, padding: 12, marginBottom: 18 },
  alertText: { fontSize: 14, fontWeight: 'bold' },
  primaryButton: {
    marginTop: 30,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#C49A3A',
    borderRadius: 10,
  },
  primaryButtonText: { color: '#242629', fontSize: 15, fontWeight: 'bold' },
  disabled: { opacity: 0.6 },
  pressed: { transform: [{ scale: 0.99 }] },
  deleteButton: { marginTop: 14, height: 48, justifyContent: 'center', alignItems: 'center' },
  deleteButtonText: { fontSize: 15, fontWeight: 'bold' },
});
