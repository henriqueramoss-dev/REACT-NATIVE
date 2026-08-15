import { Link, router, useLocalSearchParams } from 'expo-router';
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
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '@/contexts/theme-context';

type UserRole = 'client' | 'barber';

const DISPLAY_FONT = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  web: 'Georgia, serif',
});

const roleContent: Record<UserRole, { label: string; description: string }> = {
  client: {
    label: 'Cliente',
    description: 'Acesse seus agendamentos e escolha seu próximo serviço.',
  },
  barber: {
    label: 'Barbeiro',
    description: 'Cuide da agenda, dos serviços e da gestão da barbearia.',
  },
};

function isUserRole(value: string | string[] | undefined): value is UserRole {
  return value === 'client' || value === 'barber';
}

export default function LoginScreen() {
  const { colors, resolvedMode } = useAppTheme();
  const { role } = useLocalSearchParams<{ role?: string }>();
  const selectedRole = isUserRole(role) ? role : 'client';
  const content = roleContent[selectedRole];

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSignIn() {
    if (!email.trim() || !password) {
      Alert.alert('Dados incompletos', 'Informe seu e-mail e sua senha.');
      return;
    }

    router.replace({ pathname: '/painel', params: { role: selectedRole } });
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['bottom']}>
      <StatusBar style={resolvedMode === 'dark' ? 'light' : 'dark'} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.brand}>
            <Text style={styles.brandSymbol}>B</Text>
            <Text style={[styles.brandName, { color: colors.text }]}>Agenda da Barbearia</Text>
          </View>

          <View style={styles.roleBadge}>
            <View style={styles.roleDot} />
            <Text style={styles.roleBadgeText}>ACESSO {content.label.toUpperCase()}</Text>
          </View>

          <Text style={[styles.title, { color: colors.text }]}>Que bom ter você por aqui.</Text>
          <Text style={[styles.description, { color: colors.textMuted }]}>{content.description}</Text>

          <View style={[styles.form, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View>
              <Text style={styles.label}>E-mail</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="seu@email.com"
                placeholderTextColor="#8A8E93"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                style={styles.input}
              />
            </View>

            <View>
              <View style={styles.passwordLabelRow}>
                <Text style={styles.label}>Senha</Text>
                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: '/recuperar-senha',
                      params: { role: selectedRole },
                    })
                  }
                >
                  <Text style={styles.forgotPassword}>Esqueci minha senha</Text>
                </Pressable>
              </View>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Digite sua senha"
                placeholderTextColor="#8A8E93"
                secureTextEntry
                autoComplete="current-password"
                style={styles.input}
              />
            </View>

            <Pressable
              style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
              onPress={handleSignIn}
            >
              <Text style={styles.buttonText}>Entrar</Text>
              <Text style={styles.buttonArrow}>→</Text>
            </Pressable>
          </View>

          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>PRIMEIRO ACESSO?</Text>
            <View style={styles.divider} />
          </View>

          <Link
            href={{ pathname: '/cadastro', params: { role: selectedRole } }}
            asChild
          >
            <Pressable style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Criar uma conta</Text>
            </Pressable>
          </Link>

          <Text style={styles.notice}>
            A entrada ainda é demonstrativa. A autenticação real será conectada
            ao banco de dados na próxima etapa.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F2F3F5',
  },
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 28,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 42,
  },
  brandSymbol: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#C49A3A',
    color: '#242629',
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 38,
    textAlign: 'center',
  },
  brandName: {
    fontFamily: DISPLAY_FONT,
    color: '#242629',
    fontSize: 17,
    fontWeight: '800',
  },
  roleBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 22,
  },
  roleDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#C49A3A',
  },
  roleBadgeText: {
    color: '#8A6818',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.4,
  },
  title: {
    fontFamily: DISPLAY_FONT,
    maxWidth: 320,
    color: '#242629',
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: -1,
    lineHeight: 40,
  },
  description: {
    maxWidth: 340,
    marginTop: 12,
    color: '#62666B',
    fontSize: 16,
    lineHeight: 23,
  },
  form: {
    gap: 20,
    marginTop: 38,
    borderWidth: 1,
    borderColor: '#D9DADD',
    borderRadius: 18,
    backgroundColor: '#FAFAFA',
    padding: 18,
  },
  label: {
    marginBottom: 9,
    color: '#3B3E42',
    fontSize: 13,
    fontWeight: '700',
  },
  passwordLabelRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  forgotPassword: {
    color: '#8A6818',
    fontSize: 13,
    fontWeight: '600',
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderColor: '#CED0D4',
    borderRadius: 12,
    backgroundColor: '#F2F3F5',
    paddingHorizontal: 16,
    color: '#242629',
    fontSize: 16,
  },
  button: {
    height: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: 4,
    borderRadius: 12,
    backgroundColor: '#C49A3A',
  },
  buttonPressed: {
    opacity: 0.82,
  },
  buttonText: {
    color: '#242629',
    fontSize: 15,
    fontWeight: '700',
  },
  buttonArrow: {
    color: '#242629',
    fontSize: 18,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 28,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#D9DADD',
  },
  dividerText: {
    color: '#8A8E93',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.3,
  },
  secondaryButton: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#CED0D4',
    borderRadius: 12,
  },
  secondaryButtonText: {
    color: '#3B3E42',
    fontSize: 15,
    fontWeight: '700',
  },
  notice: {
    maxWidth: 310,
    alignSelf: 'center',
    marginTop: 24,
    color: '#8A8E93',
    fontSize: 11,
    lineHeight: 17,
    textAlign: 'center',
  },
});
