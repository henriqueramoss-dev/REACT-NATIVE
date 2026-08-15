import * as ImagePicker from 'expo-image-picker';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { type ThemeColors, type ThemeMode, useAppTheme } from '@/contexts/theme-context';
import { formatBrazilianPhone } from '@/utils/formatters';
import {
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';

const DISPLAY_FONT = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  web: 'Georgia, serif',
});

export default function AccountScreen() {
  const { colors, mode, resolvedMode, setMode } = useAppTheme();
  const styles = createStyles(colors);
  const [profileImage, setProfileImage] = useState<string>();
  const [name, setName] = useState('Carlos da Silva');
  const [email, setEmail] = useState('carlos@email.com');
  const [phone, setPhone] = useState('(11) 99999-0000');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [appointmentPush, setAppointmentPush] = useState(true);
  const [appointmentEmail, setAppointmentEmail] = useState(true);
  const [promotions, setPromotions] = useState(false);
  const [reviewReminder, setReviewReminder] = useState(true);

  async function chooseProfileImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        'Permissão necessária',
        'Permita o acesso às fotos para escolher uma imagem de perfil.',
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  }

  function savePersonalData() {
    if (!name.trim() || !email.trim() || !phone.trim()) {
      Alert.alert('Dados incompletos', 'Preencha nome, e-mail e telefone.');
      return;
    }

    Alert.alert('Dados atualizados', 'Suas informações foram salvas nesta sessão.');
  }

  function changePassword() {
    if (!currentPassword || !newPassword || !passwordConfirmation) {
      Alert.alert('Campos incompletos', 'Preencha os três campos de senha.');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Senha muito curta', 'A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (newPassword !== passwordConfirmation) {
      Alert.alert('Senhas diferentes', 'A confirmação deve ser igual à nova senha.');
      return;
    }

    setCurrentPassword('');
    setNewPassword('');
    setPasswordConfirmation('');
    Alert.alert('Senha atualizada', 'A alteração foi validada nesta demonstração.');
  }

  return (
    <View style={styles.screen}>
      <StatusBar style={resolvedMode === 'dark' ? 'light' : 'dark'} />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.eyebrow}>PERFIL E PREFERÊNCIAS</Text>
        <Text style={styles.title}>Sua conta, do seu jeito.</Text>
        <Text style={styles.description}>
          Atualize seus dados e escolha como deseja receber nossos avisos.
        </Text>

        <View style={styles.profileCard}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <View style={styles.profilePlaceholder}>
              <Text style={styles.profileInitials}>CS</Text>
            </View>
          )}
          <View style={styles.profileText}>
            <Text style={styles.profileName}>{name}</Text>
            <Text style={styles.profileEmail}>{email}</Text>
            <Pressable onPress={chooseProfileImage} style={styles.photoButton}>
              <Text style={styles.photoButtonText}>Trocar foto</Text>
            </Pressable>
          </View>
        </View>

        <Section title="Dados pessoais" description="Informações usadas no cadastro e nos agendamentos.">
          <Field label="Nome completo" value={name} onChangeText={setName} autoComplete="name" />
          <Field
            label="E-mail"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
          <Field
            label="Telefone"
            value={phone}
            onChangeText={(value) => setPhone(formatBrazilianPhone(value))}
            keyboardType="phone-pad"
            autoComplete="tel"
            maxLength={15}
          />
          <PrimaryButton label="Salvar dados" onPress={savePersonalData} />
        </Section>

        <Section title="Trocar senha" description="Use uma senha diferente das anteriores.">
          <Field
            label="Senha atual"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry
            autoComplete="current-password"
          />
          <Field
            label="Nova senha"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            autoComplete="new-password"
          />
          <Field
            label="Confirmar nova senha"
            value={passwordConfirmation}
            onChangeText={setPasswordConfirmation}
            secureTextEntry
            autoComplete="new-password"
          />
          <PrimaryButton label="Atualizar senha" onPress={changePassword} />
        </Section>

        <Section
          title="Aparência"
          description="Escolha as cores do aplicativo ou acompanhe o celular."
        >
          <View style={styles.themeOptions}>
            <ThemeOption label="Claro" value="light" selectedMode={mode} onSelect={setMode} />
            <ThemeOption label="Escuro" value="dark" selectedMode={mode} onSelect={setMode} />
            <ThemeOption label="Automático" value="system" selectedMode={mode} onSelect={setMode} />
          </View>
        </Section>

        <Section
          title="Notificações"
          description="Você pode alterar estas preferências quando quiser."
        >
          <Preference
            title="Lembretes no aplicativo"
            description="Confirmações, alterações e lembretes de horários."
            value={appointmentPush}
            onValueChange={setAppointmentPush}
          />
          <Preference
            title="Avisos por e-mail"
            description="Receba confirmações e cancelamentos no seu e-mail."
            value={appointmentEmail}
            onValueChange={setAppointmentEmail}
          />
          <Preference
            title="Novidades e promoções"
            description="Planos, produtos e condições especiais."
            value={promotions}
            onValueChange={setPromotions}
          />
          <Preference
            title="Lembrete para avaliar"
            description="Aviso após a conclusão de um atendimento."
            value={reviewReminder}
            onValueChange={setReviewReminder}
          />
        </Section>

        <Text style={styles.localNotice}>
          As alterações ainda são locais e serão persistidas após a conexão com o banco.
        </Text>
      </ScrollView>
    </View>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionDescription}>{description}</Text>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );
}

type FieldProps = React.ComponentProps<typeof TextInput> & { label: string };

function Field({ label, ...inputProps }: FieldProps) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <TextInput placeholderTextColor={colors.placeholder} {...inputProps} style={styles.input} />
    </View>
  );
}

function PrimaryButton({ label, onPress }: { label: string; onPress: () => void }) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]}>
      <Text style={styles.primaryButtonText}>{label}</Text>
    </Pressable>
  );
}

function Preference({
  title,
  description,
  value,
  onValueChange,
}: {
  title: string;
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.preference}>
      <View style={styles.preferenceText}>
        <Text style={styles.preferenceTitle}>{title}</Text>
        <Text style={styles.preferenceDescription}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.borderStrong, true: colors.gold }}
        thumbColor={value ? colors.text : colors.surface}
      />
    </View>
  );
}

function ThemeOption({
  label,
  value,
  selectedMode,
  onSelect,
}: {
  label: string;
  value: ThemeMode;
  selectedMode: ThemeMode;
  onSelect: (mode: ThemeMode) => void;
}) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const selected = value === selectedMode;

  return (
    <Pressable
      onPress={() => onSelect(value)}
      style={[styles.themeOption, selected && styles.themeOptionSelected]}
    >
      <View style={[styles.themePreview, value === 'dark' && styles.themePreviewDark]}>
        <View style={styles.themePreviewGold} />
      </View>
      <Text style={[styles.themeOptionText, selected && styles.themeOptionTextSelected]}>
        {label}
      </Text>
    </Pressable>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 20, paddingTop: 28, paddingBottom: 44 },
  eyebrow: { color: colors.goldText, fontSize: 11, fontWeight: '800', letterSpacing: 1.5 },
  title: {
    marginTop: 12,
    color: colors.text,
    fontFamily: DISPLAY_FONT,
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 37,
  },
  description: { marginTop: 10, color: colors.textMuted, fontSize: 15, lineHeight: 22 },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    backgroundColor: colors.surface,
    padding: 18,
  },
  profileImage: { width: 78, height: 78, borderRadius: 39 },
  profilePlaceholder: {
    width: 78,
    height: 78,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 39,
    backgroundColor: colors.text,
  },
  profileInitials: { color: colors.gold, fontFamily: DISPLAY_FONT, fontSize: 24, fontWeight: '900' },
  profileText: { flex: 1, marginLeft: 16 },
  profileName: { color: colors.text, fontFamily: DISPLAY_FONT, fontSize: 19, fontWeight: '800' },
  profileEmail: { marginTop: 4, color: colors.textMuted, fontSize: 12 },
  photoButton: { alignSelf: 'flex-start', marginTop: 10 },
  photoButtonText: { color: colors.goldText, fontSize: 12, fontWeight: '900' },
  section: {
    marginTop: 18,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    backgroundColor: colors.surface,
    padding: 18,
  },
  sectionTitle: { color: colors.text, fontFamily: DISPLAY_FONT, fontSize: 19, fontWeight: '800' },
  sectionDescription: { marginTop: 6, color: colors.textMuted, fontSize: 13, lineHeight: 19 },
  sectionContent: { gap: 18, marginTop: 22 },
  label: { marginBottom: 8, color: colors.textSecondary, fontSize: 13, fontWeight: '800' },
  input: {
    height: 54,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: 12,
    backgroundColor: colors.background,
    paddingHorizontal: 14,
    color: colors.text,
    fontSize: 15,
  },
  primaryButton: {
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: colors.gold,
  },
  primaryButtonText: { color: '#242629', fontSize: 14, fontWeight: '900' },
  buttonPressed: { transform: [{ scale: 0.99 }] },
  preference: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  preferenceText: { flex: 1 },
  preferenceTitle: { color: colors.text, fontSize: 14, fontWeight: '800' },
  preferenceDescription: { marginTop: 4, color: colors.textMuted, fontSize: 12, lineHeight: 17 },
  themeOptions: { flexDirection: 'row', gap: 10 },
  themeOption: {
    flex: 1,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 10,
  },
  themeOptionSelected: { borderWidth: 2, borderColor: colors.gold, padding: 9 },
  themePreview: {
    width: '100%',
    height: 42,
    justifyContent: 'flex-end',
    borderRadius: 8,
    backgroundColor: '#F2F3F5',
    padding: 7,
  },
  themePreviewDark: { backgroundColor: '#17191C' },
  themePreviewGold: { width: '62%', height: 7, borderRadius: 4, backgroundColor: '#C49A3A' },
  themeOptionText: { marginTop: 8, color: colors.textMuted, fontSize: 11, fontWeight: '700' },
  themeOptionTextSelected: { color: colors.text, fontWeight: '900' },
  localNotice: { marginTop: 24, color: colors.placeholder, fontSize: 11, lineHeight: 17, textAlign: 'center' },
  });
}
