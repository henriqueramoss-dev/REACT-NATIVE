import { Link, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { useAppTheme } from '@/contexts/theme-context';
import { create } from '@/services/biblioteca-api';
import { isValidIsoDate, type Usuario } from '@/services/resources';
import styles from '@/styles/auth.styles';
import { brToIso, maskDate } from '@/utils/dates';
import { avisar } from '@/utils/dialogs';

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
      avisar('Campos incompletos', 'Preencha todos os campos.');
      return;
    }

    const nascimentoIso = brToIso(dataNascimento);
    if (!nascimentoIso || !isValidIsoDate(nascimentoIso)) {
      avisar('Data inválida', 'Informe a data de nascimento no formato DD/MM/AAAA.');
      return;
    }

    setLoading(true);

    let usuario: Usuario;
    try {
      usuario = await create<Usuario>('usuarios', { nome: nome.trim(), email: email.trim().toLowerCase() });
    } catch (error) {
      setLoading(false);
      const message = error instanceof Error ? error.message : 'Não foi possível realizar o cadastro.';
      avisar('Erro no cadastro', message);
      return;
    }

    try {
      await create('perfis', {
        usuarioId: usuario.id,
        telefone: telefone.trim(),
        endereco: endereco.trim(),
        dataNascimento: nascimentoIso,
      });

      avisar('Cadastro realizado', 'Usuário e perfil foram cadastrados na API.', () => router.replace('/painel'));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido.';
      avisar(
        'Perfil não cadastrado',
        `O usuário foi criado, mas o perfil não pôde ser salvo (${message}). Complete-o pela tela Perfis.`,
        () => router.replace('/painel'),
      );
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
            onChangeText={(text) => setDataNascimento(maskDate(text))}
            placeholder="Data de nascimento (DD/MM/AAAA)"
            placeholderTextColor="#999"
            keyboardType="number-pad"
            maxLength={10}
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
