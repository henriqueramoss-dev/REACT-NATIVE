import { Link, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { useAppTheme } from '@/contexts/theme-context';
import { criarPerfil, criarUsuario } from '@/services/biblioteca-api';
import styles from '@/styles/auth.styles';

export default function SignUpScreen() {
  const { colors, resolvedMode } = useAppTheme();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignUp() {
    if (!nome.trim() || !email.trim() || !telefone.trim() || !endereco.trim() || !dataNascimento.trim()) {
      Alert.alert('Campos incompletos', 'Preencha todos os campos.');
      return;
    }

    try {
      setLoading(true);

      const usuario = await criarUsuario(nome.trim(), email.trim().toLowerCase());

      await criarPerfil(
        usuario.id,
        telefone.trim(),
        endereco.trim(),
        dataNascimento.trim(),
      );

      Alert.alert(
        'Cadastro realizado',
        'Usuário e perfil foram cadastrados na API.',
        [{ text: 'Continuar', onPress: () => router.replace('/painel') }],
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Não foi possível realizar o cadastro.';
      Alert.alert('Erro no cadastro', message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <StatusBar style={resolvedMode === 'dark' ? 'light' : 'dark'} />

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.brand}>
          <Text style={styles.brandSymbol}>B</Text>
          <Text style={[styles.brandName, { color: colors.text }]}>Biblioteca</Text>
        </View>

        <Text style={[styles.title, { color: colors.text }]}>Criar conta</Text>
        <Text style={[styles.description, { color: colors.textMuted }]}>
          Os campos seguem a estrutura atual da sua API Java.
        </Text>

        <View style={styles.form}>
          <TextInput value={nome} onChangeText={setNome} placeholder="Nome completo" placeholderTextColor="#999" style={styles.input} />
          <TextInput value={email} onChangeText={setEmail} placeholder="E-mail" placeholderTextColor="#999" keyboardType="email-address" autoCapitalize="none" style={styles.input} />
          <TextInput value={telefone} onChangeText={setTelefone} placeholder="Telefone" placeholderTextColor="#999" keyboardType="phone-pad" style={styles.input} />
          <TextInput value={endereco} onChangeText={setEndereco} placeholder="Endereço" placeholderTextColor="#999" style={styles.input} />
          <TextInput
            value={dataNascimento}
            onChangeText={setDataNascimento}
            placeholder="Data de nascimento: 2000-05-10"
            placeholderTextColor="#999"
            style={styles.input}
          />

          <Pressable style={styles.button} onPress={handleSignUp} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'Cadastrando...' : 'Cadastrar'}</Text>
          </Pressable>
        </View>

        <Text style={[styles.secondaryText, { color: colors.textMuted }]}>
          Já tem uma conta?{' '}
          <Link href="/login" style={styles.link}>
            Entrar
          </Link>
        </Text>

        <Text style={styles.notice}>
          A API atual não possui CPF nem senha no modelo de usuário; por isso esses campos não são enviados.
        </Text>
      </ScrollView>
    </View>
  );
}
