import { Link, useLocalSearchParams } from 'expo-router';
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
import { formatBrazilianPhone, formatBrazilianPostalCode } from '@/utils/formatters';

type UserRole = 'client' | 'barber';

const DISPLAY_FONT = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  web: 'Georgia, serif',
});

const roleNames: Record<UserRole, string> = {
  client: 'cliente',
  barber: 'barbeiro',
};

function isUserRole(value: string | string[] | undefined): value is UserRole {
  return value === 'client' || value === 'barber';
}

export default function SignUpScreen() {
  const { colors, resolvedMode } = useAppTheme();
  const { role } = useLocalSearchParams<{ role?: string }>();
  const selectedRole = isUserRole(role) ? role : 'client';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [street, setStreet] = useState('');
  const [addressNumber, setAddressNumber] = useState('');
  const [addressComplement, setAddressComplement] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  function handleSignUp() {
    if (!name.trim() || !email.trim() || !phone.trim() || !password) {
      Alert.alert('Campos incompletos', 'Preencha todos os campos obrigatórios.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Senha muito curta', 'Use uma senha com pelo menos 6 caracteres.');
      return;
    }

    if (password !== passwordConfirmation) {
      Alert.alert('Senhas diferentes', 'A confirmação deve ser igual à senha.');
      return;
    }

    if (selectedRole === 'barber' && !businessName.trim()) {
      Alert.alert('Barbearia obrigatória', 'Informe o nome da barbearia.');
      return;
    }

    if (
      selectedRole === 'barber' &&
      (!postalCode.trim() ||
        !street.trim() ||
        !addressNumber.trim() ||
        !neighborhood.trim() ||
        !city.trim() ||
        !state.trim())
    ) {
      Alert.alert(
        'Endereço incompleto',
        'Preencha CEP, rua, número, bairro, cidade e estado.',
      );
      return;
    }

    Alert.alert(
      'Formulário válido',
      'Os dados estão prontos. No próximo passo, vamos salvá-los com autenticação real.',
    );
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
            <Text style={styles.roleBadgeText}>
              NOVO PERFIL · {roleNames[selectedRole].toUpperCase()}
            </Text>
          </View>

          <Text style={[styles.title, { color: colors.text }]}>Vamos começar pelo essencial.</Text>
          <Text style={[styles.description, { color: colors.textMuted }]}>
            Conte um pouco sobre você. Depois, poderá completar seu perfil com
            calma.
          </Text>

          <View style={styles.form}>
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Seus dados</Text>
            <Field
              label="Nome completo"
              value={name}
              onChangeText={setName}
              placeholder="Digite seu nome"
              autoComplete="name"
            />

            <Field
              label="E-mail"
              value={email}
              onChangeText={setEmail}
              placeholder="voce@exemplo.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />

            <Field
              label="Telefone"
              value={phone}
              onChangeText={(value) => setPhone(formatBrazilianPhone(value))}
              placeholder="(00) 00000-0000"
              keyboardType="phone-pad"
              autoComplete="tel"
              maxLength={15}
            />
          </View>

          {selectedRole === 'barber' && (
            <View style={styles.barberFields}>
              <View>
                <Text style={styles.sectionTitle}>Dados da barbearia</Text>
                <Text style={styles.sectionDescription}>
                  Essas informações serão usadas no perfil público e nos
                  agendamentos dos clientes.
                </Text>
              </View>

              <Field
                label="Nome da barbearia"
                value={businessName}
                onChangeText={setBusinessName}
                placeholder="Ex.: Barbearia Central"
              />

              <Field
                label="CEP"
                value={postalCode}
                onChangeText={(value) => setPostalCode(formatBrazilianPostalCode(value))}
                placeholder="00000-000"
                keyboardType="number-pad"
                autoComplete="postal-code"
                maxLength={9}
              />

              <Field
                label="Rua ou avenida"
                value={street}
                onChangeText={setStreet}
                placeholder="Ex.: Avenida Paulista"
                autoComplete="street-address"
              />

              <View style={styles.addressRow}>
                <View style={styles.addressNumberField}>
                  <Field
                    label="Número"
                    value={addressNumber}
                    onChangeText={setAddressNumber}
                    placeholder="123"
                    keyboardType="number-pad"
                  />
                </View>

                <View style={styles.complementField}>
                  <Field
                    label="Complemento (opcional)"
                    value={addressComplement}
                    onChangeText={setAddressComplement}
                    placeholder="Sala 4"
                  />
                </View>
              </View>

              <Field
                label="Bairro"
                value={neighborhood}
                onChangeText={setNeighborhood}
                placeholder="Digite o bairro"
              />

              <View style={styles.addressRow}>
                <View style={styles.cityField}>
                  <Field
                    label="Cidade"
                    value={city}
                    onChangeText={setCity}
                    placeholder="Digite a cidade"
                  />
                </View>

                <View style={styles.stateField}>
                  <Field
                    label="UF"
                    value={state}
                    onChangeText={(value) => setState(value.toUpperCase())}
                    placeholder="SP"
                    autoCapitalize="characters"
                    maxLength={2}
                  />
                </View>
              </View>
            </View>
          )}

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Segurança</Text>
            <Field
              label="Senha"
              value={password}
              onChangeText={setPassword}
              placeholder="Mínimo de 6 caracteres"
              secureTextEntry
              autoComplete="new-password"
            />

            <Field
              label="Confirmar senha"
              value={passwordConfirmation}
              onChangeText={setPasswordConfirmation}
              placeholder="Digite a senha novamente"
              secureTextEntry
              autoComplete="new-password"
            />
          </View>

          <Pressable
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
            onPress={handleSignUp}
          >
            <Text style={styles.buttonText}>Continuar cadastro</Text>
            <Text style={styles.buttonArrow}>→</Text>
          </Pressable>
          </View>

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Já tem uma conta? </Text>
            <Link
              href={{ pathname: '/login', params: { role: selectedRole } }}
              style={styles.loginLink}
            >
              Entrar
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

type FieldProps = React.ComponentProps<typeof TextInput> & {
  label: string;
};

function Field({ label, ...inputProps }: FieldProps) {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor="#8A8E93"
        {...inputProps}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F2F3F5',
  },
  container: {
    flex: 1,
    backgroundColor: '#F2F3F5',
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 36,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 34,
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
    marginBottom: 20,
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
    letterSpacing: 1.2,
  },
  title: {
    fontFamily: DISPLAY_FONT,
    maxWidth: 340,
    color: '#242629',
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.9,
    lineHeight: 38,
  },
  description: {
    maxWidth: 350,
    marginTop: 12,
    color: '#62666B',
    fontSize: 16,
    lineHeight: 23,
  },
  form: {
    gap: 20,
    marginTop: 36,
  },
  sectionCard: {
    gap: 20,
    borderWidth: 1,
    borderColor: '#D9DADD',
    borderRadius: 18,
    backgroundColor: '#FAFAFA',
    padding: 18,
  },
  barberFields: {
    gap: 20,
    borderWidth: 1,
    borderColor: '#D9DADD',
    borderRadius: 18,
    backgroundColor: '#FAFAFA',
    padding: 18,
  },
  sectionTitle: {
    fontFamily: DISPLAY_FONT,
    color: '#242629',
    fontSize: 18,
    fontWeight: '700',
  },
  sectionDescription: {
    maxWidth: 340,
    marginTop: 6,
    color: '#62666B',
    fontSize: 13,
    lineHeight: 19,
  },
  addressRow: {
    flexDirection: 'row',
    gap: 12,
  },
  addressNumberField: {
    width: 100,
  },
  complementField: {
    flex: 1,
  },
  cityField: {
    flex: 1,
  },
  stateField: {
    width: 76,
  },
  label: {
    marginBottom: 9,
    color: '#3B3E42',
    fontSize: 13,
    fontWeight: '700',
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
    marginTop: 6,
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
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  loginText: {
    color: '#62666B',
    fontSize: 14,
  },
  loginLink: {
    color: '#8A6818',
    fontSize: 14,
    fontWeight: '700',
  },
});
