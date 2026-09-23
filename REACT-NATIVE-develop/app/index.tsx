import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAppTheme } from '@/contexts/theme-context';
import styles from '@/styles/index.styles';
import type { UserRole } from '@/types/user';
import {
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

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
