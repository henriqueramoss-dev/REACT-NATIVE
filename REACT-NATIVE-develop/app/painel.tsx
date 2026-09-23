import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAppTheme } from '@/contexts/theme-context';
import styles from '@/styles/painel.styles';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { dashboards } from '@/data/dashboard';
import { isUserRole } from '@/utils/user-role';

export default function DashboardScreen() {
  const { colors, resolvedMode } = useAppTheme();
  const { role } = useLocalSearchParams<{ role?: string }>();
  const selectedRole = isUserRole(role) ? role : 'client';
  const content = dashboards[selectedRole];

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <StatusBar style={resolvedMode === 'dark' ? 'light' : 'dark'} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.topBar}>
          <View style={styles.brand}>
            <Text style={styles.brandSymbol}>B</Text>
            <Text style={[styles.brandName, { color: colors.text }]}>Agenda da Barbearia</Text>
          </View>
          <Pressable onPress={() => router.replace('/')}>
            <Text style={[styles.exit, { color: colors.goldText }]}>Sair</Text>
          </Pressable>
        </View>

        <Text style={[styles.eyebrow, { color: colors.goldText }]}>{content.eyebrow}</Text>
        <Text style={[styles.title, { color: colors.text }]}>{content.title}</Text>
        <Text style={[styles.description, { color: colors.textMuted }]}>{content.description}</Text>

        <View style={styles.grid}>
          {content.modules.map((module) => (
            <Pressable
              key={module.title}
              onPress={() => module.route && router.push(module.route)}
              style={({ pressed }) => [
                styles.card,
                { backgroundColor: colors.surface, borderColor: colors.border },
                pressed && { backgroundColor: colors.surfaceMuted },
              ]}
            >
              <View style={styles.cardAccent} />
              <Text style={[styles.cardTitle, { color: colors.text }]}>{module.title}</Text>
              <Text style={[styles.cardDescription, { color: colors.textMuted }]}>{module.description}</Text>
              <Text style={[styles.cardLink, { color: colors.goldText }]}>Abrir →</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.prototypeNotice}>
          Os módulos desta versão funcionam com dados locais e podem ser conectados ao Supabase depois.
        </Text>
      </ScrollView>
    </View>
  );
}
