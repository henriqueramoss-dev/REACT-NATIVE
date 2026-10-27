import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import BrandMark from '@/components/brand-mark';
import { useAppTheme } from '@/contexts/theme-context';
import styles from '@/styles/auth.styles';
import { avisar } from '@/utils/dialogs';

export default function LoginScreen() {
  const { colors } = useAppTheme();
  const inputColors = { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleLogin() {
    if (!email.trim() || !password) {
      avisar('Campos incompletos', 'Informe seu e-mail e sua senha.');
      return;
    }

    avisar(
      'Acesso demonstrativo',
      'A API atual ainda não possui autenticação. O aplicativo abrirá o painel para testes.',
      () => router.replace('/painel'),
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.brand}>
          <BrandMark />
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
              placeholderTextColor={colors.placeholder}
              keyboardType="email-address"
              autoCapitalize="none"
              style={[styles.input, inputColors]}
            />
          </View>

          <View>
            <Text style={[styles.label, { color: colors.text }]}>Senha</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Digite sua senha"
              placeholderTextColor={colors.placeholder}
              secureTextEntry
              style={[styles.input, inputColors]}
            />
          </View>

          <Pressable style={[styles.button, { backgroundColor: colors.primary }]} onPress={handleLogin}>
            <Text style={[styles.buttonText, { color: colors.onPrimary }]}>Entrar</Text>
          </Pressable>
        </View>

        <Text style={[styles.secondaryText, { color: colors.textMuted }]}>
          Ainda não tem cadastro?{' '}
          <Link href="/cadastro" style={[styles.link, { color: colors.primary }]}>
            Criar conta
          </Link>
        </Text>

        <Text style={[styles.notice, { color: colors.placeholder }]}>
          Login real será conectado quando a API Spring Boot possuir autenticação e senha.
        </Text>
      </ScrollView>
    </View>
  );
}
