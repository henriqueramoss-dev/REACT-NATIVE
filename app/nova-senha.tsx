import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useAppTheme } from '@/contexts/theme-context';

type UserRole = 'client' | 'barber';

const DISPLAY_FONT = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  web: 'Georgia, serif',
});

function isUserRole(value: string | string[] | undefined): value is UserRole {
  return value === 'client' || value === 'barber';
}

export default function NewPasswordScreen() {
  const { colors, resolvedMode } = useAppTheme();
  const { email, role } = useLocalSearchParams<{ email?: string; role?: string }>();
  const selectedRole = isUserRole(role) ? role : 'client';
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');

  function savePassword() {
    if (password.length < 6) {
      Alert.alert('Senha muito curta', 'Use pelo menos 6 caracteres.');
      return;
    }

    if (password !== confirmation) {
      Alert.alert('Senhas diferentes', 'Digite a mesma senha nos dois campos.');
      return;
    }

    Alert.alert('Senha atualizada', 'Agora você já pode entrar com a nova senha.', [
      {
        text: 'Ir para o login',
        onPress: () =>
          router.replace({ pathname: '/login', params: { role: selectedRole } }),
      },
    ]);
  }

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar style={resolvedMode === 'dark' ? 'light' : 'dark'} />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={[styles.eyebrow, { color: colors.goldText }]}>NOVA SENHA</Text>
        <Text style={[styles.title, { color: colors.text }]}>Crie uma nova senha segura.</Text>
        <Text style={[styles.description, { color: colors.textMuted }]}>
          A senha será atualizada para {email || 'sua conta'}.
        </Text>

        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Field
            label="Nova senha"
            value={password}
            onChangeText={setPassword}
            placeholder="Mínimo de 6 caracteres"
          />
          <Field
            label="Confirmar nova senha"
            value={confirmation}
            onChangeText={setConfirmation}
            placeholder="Digite a senha novamente"
          />
          <Pressable onPress={savePassword} style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}>
            <Text style={styles.buttonText}>Salvar nova senha</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({
  label,
  value,
  onChangeText,
  placeholder,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
}) {
  const { colors } = useAppTheme();

  return (
    <View>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.placeholder}
        secureTextEntry
        autoComplete="new-password"
        style={[
          styles.input,
          {
            backgroundColor: colors.background,
            borderColor: colors.borderStrong,
            color: colors.text,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 22, paddingVertical: 36 },
  eyebrow: { fontSize: 11, fontWeight: '800', letterSpacing: 1.5 },
  title: {
    maxWidth: 430,
    marginTop: 12,
    fontFamily: DISPLAY_FONT,
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 37,
  },
  description: { marginTop: 10, fontSize: 15, lineHeight: 22 },
  card: { gap: 18, marginTop: 30, borderWidth: 1, borderRadius: 18, padding: 18 },
  label: { marginBottom: 8, fontSize: 13, fontWeight: '800' },
  input: { height: 56, borderWidth: 1, borderRadius: 12, paddingHorizontal: 15, fontSize: 15 },
  button: {
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#C49A3A',
  },
  buttonPressed: { transform: [{ scale: 0.99 }] },
  buttonText: { color: '#242629', fontSize: 14, fontWeight: '900' },
});
