import * as ImagePicker from 'expo-image-picker';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { type ThemeMode, useAppTheme } from '@/contexts/theme-context';
import { formatBrazilianPhone } from '@/utils/formatters';
import createStyles from '@/styles/conta.styles';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';

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
