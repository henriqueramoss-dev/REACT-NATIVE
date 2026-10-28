import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, ScrollView, Text, View } from 'react-native';

import BrandMark from '@/components/brand-mark';
import { useAppTheme } from '@/contexts/theme-context';
import styles from '@/styles/biblioteca.styles';

export default function HomeScreen() {
  const { colors, resolvedMode } = useAppTheme();

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <StatusBar style={resolvedMode === 'dark' ? 'light' : 'dark'} />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.brand}>
          <BrandMark />
          <Text style={[styles.brandName, { color: colors.text }]}>Biblioteca</Text>
        </View>

        <Text style={[styles.eyebrow, { color: colors.primary }]}>BEM-VINDO</Text>

        <Text style={[styles.title, { color: colors.text }]}>
          Seus livros e empréstimos em um só lugar.
        </Text>

        <Text style={[styles.description, { color: colors.textMuted }]}>
          Consulte o acervo, acompanhe seus empréstimos e encontre novos livros.
        </Text>

        <Pressable
          style={[styles.primaryButton, { backgroundColor: colors.primary }]}
          onPress={() => router.push('/login')}
        >
          <Text style={[styles.primaryButtonText, { color: colors.onPrimary }]}>Entrar</Text>
        </Pressable>

        <Pressable
          style={[styles.secondaryButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={() => router.push('/cadastro')}
        >
          <Text style={[styles.secondaryButtonText, { color: colors.text }]}>
            Criar conta
          </Text>
        </Pressable>

        <Pressable onPress={() => router.push('/painel')}>
          <Text style={[styles.demoLink, { color: colors.primary }]}>
            Ver protótipo sem login
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
