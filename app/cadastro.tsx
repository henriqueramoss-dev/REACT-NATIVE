import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import BrandMark from '@/components/brand-mark';
import { useAppTheme } from '@/contexts/theme-context';
import { create } from '@/services/biblioteca-api';
import { isValidIsoDate, type Usuario } from '@/services/resources';
import styles from '@/styles/auth.styles';
import { brToIso, maskDate } from '@/utils/dates';
import { avisar } from '@/utils/dialogs';

export default function SignUpScreen() {
  const { colors } = useAppTheme();
  const inputColors = { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text };

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

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.brand}>
          <BrandMark />
          <Text style={[styles.brandName, { color: colors.text }]}>Biblioteca</Text>
        </View>

        <Text style={[styles.title, { color: colors.text }]}>Criar conta</Text>
        <Text style={[styles.description, { color: colors.textMuted }]}>
          Os campos seguem a estrutura atual da sua API Java.
        </Text>

        <View style={styles.form}>
          <TextInput value={nome} onChangeText={setNome} placeholder="Nome completo" placeholderTextColor={colors.placeholder} style={[styles.input, inputColors]} />
          <TextInput value={email} onChangeText={setEmail} placeholder="E-mail" placeholderTextColor={colors.placeholder} keyboardType="email-address" autoCapitalize="none" style={[styles.input, inputColors]} />
          <TextInput value={telefone} onChangeText={setTelefone} placeholder="Telefone" placeholderTextColor={colors.placeholder} keyboardType="phone-pad" style={[styles.input, inputColors]} />
          <TextInput value={endereco} onChangeText={setEndereco} placeholder="Endereço" placeholderTextColor={colors.placeholder} style={[styles.input, inputColors]} />
          <TextInput
            value={dataNascimento}
            onChangeText={(text) => setDataNascimento(maskDate(text))}
            placeholder="Data de nascimento (DD/MM/AAAA)"
            placeholderTextColor={colors.placeholder}
            keyboardType="number-pad"
            maxLength={10}
            style={[styles.input, inputColors]}
          />

          <Pressable style={[styles.button, { backgroundColor: colors.primary }]} onPress={handleSignUp} disabled={loading}>
            <Text style={[styles.buttonText, { color: colors.onPrimary }]}>{loading ? 'Cadastrando...' : 'Cadastrar'}</Text>
          </Pressable>
        </View>

        <Text style={[styles.secondaryText, { color: colors.textMuted }]}>
          Já tem uma conta?{' '}
          <Link href="/login" style={[styles.link, { color: colors.primary }]}>
            Entrar
          </Link>
        </Text>

        <Text style={[styles.notice, { color: colors.placeholder }]}>
          A API atual não possui CPF nem senha no modelo de usuário; por isso esses campos não são enviados.
        </Text>
      </ScrollView>
    </View>
  );
}
