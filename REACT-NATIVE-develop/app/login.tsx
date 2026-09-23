import { Link, router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '@/contexts/theme-context';
import styles from '@/styles/login.styles';
import { roleContent } from '@/data/auth';
import { isUserRole } from '@/utils/user-role';

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
