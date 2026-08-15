import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAppTheme } from '@/contexts/theme-context';
import {
  Pressable,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type UserRole = 'client' | 'barber';

const DISPLAY_FONT = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  web: 'Georgia, serif',
});

const profiles: {
  role: UserRole;
  title: string;
  description: string;
}[] = [
  {
    role: 'client',
    title: 'Sou cliente',
    description: 'Quero escolher um serviço e agendar meu horário.',
  },
  {
    role: 'barber',
    title: 'Sou barbeiro',
    description: 'Quero consultar minha agenda e meus atendimentos.',
  },
];

export default function HomeScreen() {
  const { colors, resolvedMode } = useAppTheme();
  function openLogin(role: UserRole) {
    router.push({
      pathname: '/login',
      params: { role },
    });
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <StatusBar style={resolvedMode === 'dark' ? 'light' : 'dark'} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.brand}>
          <Text style={styles.brandSymbol}>B</Text>
          <Text style={[styles.brandName, { color: colors.text }]}>Agenda da Barbearia</Text>
        </View>

        <View style={styles.header}>
          <Text style={[styles.kicker, { color: colors.goldText }]}>BEM-VINDO</Text>
          <Text style={[styles.title, { color: colors.text }]}>Seu próximo corte começa por aqui.</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            Escolha como deseja acessar o aplicativo.
          </Text>
        </View>

        <View style={styles.options}>
          {profiles.map((profile) => (
            <Pressable
              key={profile.role}
              accessibilityRole="button"
              accessibilityLabel={profile.title}
              onPress={() => openLogin(profile.role)}
              style={({ pressed }) => [
                styles.option,
                pressed && styles.optionPressed,
              ]}
            >
              <View style={styles.optionText}>
                <Text style={styles.optionTitle}>{profile.title}</Text>
                <Text style={styles.optionDescription}>
                  {profile.description}
                </Text>
              </View>

              <Text style={styles.arrow}>›</Text>
            </Pressable>
          ))}
        </View>

        <Text style={[styles.footer, { color: colors.placeholder }]}>
          Horário marcado, atendimento sem espera.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F2F3F5',
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 60,
    paddingBottom: 28,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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
  header: {
    marginTop: 48,
  },
  kicker: {
    color: '#8A6818',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.6,
  },
  title: {
    fontFamily: DISPLAY_FONT,
    maxWidth: 350,
    marginTop: 12,
    color: '#242629',
    fontSize: 32,
    fontWeight: '800',
    lineHeight: 39,
  },
  subtitle: {
    marginTop: 12,
    color: '#62666B',
    fontSize: 16,
    lineHeight: 23,
  },
  options: {
    gap: 12,
    marginTop: 36,
  },
  option: {
    minHeight: 92,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D9DADD',
    borderRadius: 18,
    backgroundColor: '#FAFAFA',
    padding: 18,
  },
  optionPressed: {
    backgroundColor: '#E7E8EA',
    transform: [{ scale: 0.99 }],
  },
  optionText: {
    flex: 1,
    paddingRight: 14,
  },
  optionTitle: {
    fontFamily: DISPLAY_FONT,
    color: '#242629',
    fontSize: 17,
    fontWeight: '800',
  },
  optionDescription: {
    marginTop: 5,
    color: '#62666B',
    fontSize: 14,
    lineHeight: 20,
  },
  arrow: {
    color: '#C49A3A',
    fontSize: 32,
    fontWeight: '300',
    lineHeight: 34,
  },
  footer: {
    marginTop: 'auto',
    paddingTop: 32,
    color: '#8A8E93',
    fontSize: 12,
    textAlign: 'center',
  },
});
