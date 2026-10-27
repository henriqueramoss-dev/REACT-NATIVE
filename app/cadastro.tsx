import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import BrandMark from '@/components/brand-mark';
import { useAppTheme } from '@/contexts/theme-context';
import { ApiError, create } from '@/services/biblioteca-api';
import { RESOURCES, TIPO_USUARIO_OPTIONS, validate, type Usuario } from '@/services/resources';
import styles from '@/styles/auth.styles';
import { brToIso, maskDate } from '@/utils/dates';
import { avisar } from '@/utils/dialogs';

export default function SignUpScreen() {
  const { colors } = useAppTheme();
  const inputColors = { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text };

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [tipo, setTipo] = useState('ALUNO');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [cep, setCep] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignUp() {
    // As mesmas regras dos formulários de Usuários e Perfis (services/resources.ts).
    const nascimentoIso = brToIso(dataNascimento) ?? dataNascimento;
    const erros = {
      ...validate(RESOURCES.usuarios, { nome, email, cpf, tipo }),
      // O usuário ainda não existe: um id qualquer só faz o campo "usuário" passar na validação.
      ...validate(RESOURCES.perfis, {
        usuarioId: '0',
        telefone,
        endereco,
        cidade,
        estado,
        cep,
        dataNascimento: nascimentoIso,
      }),
    };
    const primeiroErro = Object.values(erros)[0];
    if (primeiroErro) {
      avisar('Confira os dados', primeiroErro);
      return;
    }

    setLoading(true);

    let usuario: Usuario;
    try {
      usuario = await create<Usuario>('usuarios', {
        nome: nome.trim(),
        email: email.trim().toLowerCase(),
        cpf,
        tipo,
      });
    } catch (error) {
      setLoading(false);
      avisar('Erro no cadastro', describeError(error, 'Não foi possível realizar o cadastro.'));
      return;
    }

    try {
      await create('perfis', {
        usuarioId: usuario.id,
        telefone: telefone.trim(),
        endereco: endereco.trim(),
        cidade: cidade.trim(),
        estado,
        cep,
        dataNascimento: nascimentoIso,
      });

      avisar('Cadastro realizado', 'Usuário e perfil foram cadastrados na API.', () => router.replace('/painel'));
    } catch (error) {
      const message = describeError(error, 'Erro desconhecido.');
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
          Cadastre-se como leitor da biblioteca.
        </Text>

        <View style={styles.form}>
          <TextInput value={nome} onChangeText={setNome} placeholder="Nome completo" placeholderTextColor={colors.placeholder} style={[styles.input, inputColors]} />
          <TextInput value={email} onChangeText={setEmail} placeholder="E-mail" placeholderTextColor={colors.placeholder} keyboardType="email-address" autoCapitalize="none" style={[styles.input, inputColors]} />
          <TextInput value={cpf} onChangeText={(text) => setCpf(text.replace(/\D/g, '').slice(0, 11))} placeholder="CPF (somente números)" placeholderTextColor={colors.placeholder} keyboardType="number-pad" style={[styles.input, inputColors]} />

          <View style={styles.chips}>
            {TIPO_USUARIO_OPTIONS.map((option) => {
              const active = tipo === option.value;
              return (
                <Pressable
                  key={option.value}
                  onPress={() => setTipo(option.value)}
                  style={[
                    styles.chip,
                    { backgroundColor: active ? colors.primary : colors.surface },
                    { borderColor: active ? colors.primary : colors.border },
                  ]}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: active }}
                >
                  <Text style={[styles.chipText, { color: active ? colors.onPrimary : colors.text }]}>{option.label}</Text>
                </Pressable>
              );
            })}
          </View>

          <TextInput value={telefone} onChangeText={setTelefone} placeholder="Telefone" placeholderTextColor={colors.placeholder} keyboardType="phone-pad" style={[styles.input, inputColors]} />
          <TextInput value={endereco} onChangeText={setEndereco} placeholder="Endereço" placeholderTextColor={colors.placeholder} style={[styles.input, inputColors]} />
          <TextInput value={cidade} onChangeText={setCidade} placeholder="Cidade" placeholderTextColor={colors.placeholder} style={[styles.input, inputColors]} />
          <View style={styles.row}>
            <TextInput value={estado} onChangeText={(text) => setEstado(text.replace(/[^A-Za-z]/g, '').toUpperCase())} placeholder="UF" placeholderTextColor={colors.placeholder} autoCapitalize="characters" maxLength={2} style={[styles.input, inputColors, styles.uf]} />
            <TextInput value={cep} onChangeText={(text) => setCep(text.replace(/\D/g, '').slice(0, 8))} placeholder="CEP (somente números)" placeholderTextColor={colors.placeholder} keyboardType="number-pad" style={[styles.input, inputColors, styles.grow]} />
          </View>
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
          A API atual não possui senha no modelo de usuário; por isso o cadastro ainda não cria uma senha de acesso.
        </Text>
      </ScrollView>
    </View>
  );
}

/** Usa a mensagem do primeiro campo recusado pela API, quando houver. */
function describeError(error: unknown, fallback: string) {
  if (!(error instanceof Error)) return fallback;
  const campos = (error as ApiError).campos;
  const primeiro = campos && Object.values(campos)[0];
  return primeiro || error.message;
}
