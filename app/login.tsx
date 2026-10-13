import { Link, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { useAppTheme } from '@/contexts/theme-context';
import styles from '@/styles/auth.styles';

export default function LoginScreen() {
  const { colors, resolvedMode } = useAppTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleLogin() {
    if (!email.trim() || !password) {
      Alert.alert('Campos incompletos', 'Informe seu e-mail e sua senha.');
      return;
    }

    Alert.alert(
      'Acesso demonstrativo',
      'A API atual ainda não possui autenticação. O aplicativo abrirá o painel para testes.',
      [{ text: 'Continuar', onPress: () => router.replace('/painel') }],
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <StatusBar style={resolvedMode === 'dark' ? 'light' : 'dark'} />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.brand}>
          <Text style={styles.brandSymbol}>B</Text>
          <Text style={[styles.brandName, { color: colors.text }]}>Biblioteca</Text>
        </View>

        <Text style={[styles.title, { color: colors.text }]}>Entrar</Text>
        <Text style={[styles.description, { color: colors.textMuted }]}>
          Acesse o aplicativo para consultar o acervo e seus empréstimos.
        </Text>

        <View style={styles.form}>
          <View>
            <Text style={[styles.label, { color: colors.text }]}>E-mail</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="seu@email.com"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />
          </View>

          <View>
            <Text style={[styles.label, { color: colors.text }]}>Senha</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Digite sua senha"
              placeholderTextColor="#999"
              secureTextEntry
              style={styles.input}
            />
          </View>

          <Pressable style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Entrar</Text>
          </Pressable>
        </View>

        <Text style={[styles.secondaryText, { color: colors.textMuted }]}>
          Ainda não tem cadastro?{' '}
          <Link href="/cadastro" style={styles.link}>
            Criar conta
          </Link>
        </Text>

        <Text style={styles.notice}>
          Login real será conectado quando a API Spring Boot possuir autenticação e senha.
        </Text>
      </ScrollView>
    </View>
  );
}
