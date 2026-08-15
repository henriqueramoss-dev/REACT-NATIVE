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

type Step = 'email' | 'code';
type UserRole = 'client' | 'barber';

const DISPLAY_FONT = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  web: 'Georgia, serif',
});

function isUserRole(value: string | string[] | undefined): value is UserRole {
  return value === 'client' || value === 'barber';
}

function createTestCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export default function RecoverPasswordScreen() {
  const { colors, resolvedMode } = useAppTheme();
  const { role } = useLocalSearchParams<{ role?: string }>();
  const selectedRole = isUserRole(role) ? role : 'client';
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [testCode, setTestCode] = useState('');

  function sendCode() {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !normalizedEmail.includes('@')) {
      Alert.alert('E-mail inválido', 'Informe o e-mail usado para entrar no aplicativo.');
      return;
    }

    const generatedCode = createTestCode();
    setEmail(normalizedEmail);
    setTestCode(generatedCode);
    setCode(generatedCode);
    setStep('code');

    Alert.alert(
      'Código de demonstração',
      `O código ${generatedCode} foi preenchido automaticamente. Quando conectarmos o servidor, ele será enviado por e-mail.`,
    );
  }

  function verifyCode() {
    if (code.length !== 6) {
      Alert.alert('Código incompleto', 'Digite os 6 números recebidos.');
      return;
    }

    if (code !== testCode) {
      Alert.alert('Código incorreto', 'Confira o código e tente novamente.');
      return;
    }

    router.push({
      pathname: '/nova-senha',
      params: { email, role: selectedRole },
    });
  }

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar style={resolvedMode === 'dark' ? 'light' : 'dark'} />
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.eyebrow, { color: colors.goldText }]}>RECUPERAR ACESSO</Text>
        <Text style={[styles.title, { color: colors.text }]}>
          {step === 'email' ? 'Vamos encontrar sua conta.' : 'Confira seu código.'}
        </Text>
        <Text style={[styles.description, { color: colors.textMuted }]}>
          {step === 'email'
            ? 'Digite o mesmo e-mail usado no cadastro para receber um código de segurança.'
            : `Enviamos um código de 6 números para ${email}.`}
        </Text>

        <View
          style={[
            styles.card,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          {step === 'email' ? (
            <>
              <Text style={[styles.label, { color: colors.textSecondary }]}>E-mail de login</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="seu@email.com"
                placeholderTextColor={colors.placeholder}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                returnKeyType="send"
                onSubmitEditing={sendCode}
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.background,
                    borderColor: colors.borderStrong,
                    color: colors.text,
                  },
                ]}
              />
              <PrimaryButton label="Enviar código" onPress={sendCode} />
            </>
          ) : (
            <>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Código de segurança</Text>
              <TextInput
                value={code}
                onChangeText={(value) => setCode(value.replace(/\D/g, ''))}
                placeholder="000000"
                placeholderTextColor={colors.placeholder}
                keyboardType="number-pad"
                autoComplete="one-time-code"
                maxLength={6}
                style={[
                  styles.codeInput,
                  {
                    backgroundColor: colors.background,
                    borderColor: colors.borderStrong,
                    color: colors.text,
                  },
                ]}
              />
              <PrimaryButton label="Validar código" onPress={verifyCode} />
              <View style={styles.codeActions}>
                <Pressable onPress={sendCode}>
                  <Text style={[styles.link, { color: colors.goldText }]}>Reenviar código</Text>
                </Pressable>
                <Pressable onPress={() => setStep('email')}>
                  <Text style={[styles.link, { color: colors.textMuted }]}>Trocar e-mail</Text>
                </Pressable>
              </View>
            </>
          )}
        </View>

        <Text style={[styles.notice, { color: colors.placeholder }]}>
          Nunca compartilhe seu código de segurança com outras pessoas.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function PrimaryButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}>
      <Text style={styles.buttonText}>{label}</Text>
    </Pressable>
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
  description: { maxWidth: 470, marginTop: 10, fontSize: 15, lineHeight: 22 },
  card: { gap: 18, marginTop: 30, borderWidth: 1, borderRadius: 18, padding: 18 },
  label: { fontSize: 13, fontWeight: '800' },
  input: { height: 56, borderWidth: 1, borderRadius: 12, paddingHorizontal: 15, fontSize: 15 },
  codeInput: {
    height: 64,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 9,
    textAlign: 'center',
  },
  button: {
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#C49A3A',
  },
  buttonPressed: { transform: [{ scale: 0.99 }] },
  buttonText: { color: '#242629', fontSize: 14, fontWeight: '900' },
  codeActions: { flexDirection: 'row', justifyContent: 'space-between' },
  link: { fontSize: 12, fontWeight: '800' },
  notice: { maxWidth: 350, alignSelf: 'center', marginTop: 24, fontSize: 11, lineHeight: 17, textAlign: 'center' },
});
