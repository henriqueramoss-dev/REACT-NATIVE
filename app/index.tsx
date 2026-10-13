import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { useAppTheme } from '@/contexts/theme-context';
import styles from '@/styles/biblioteca.styles';

export default function HomeScreen() {
  const { colors, resolvedMode } = useAppTheme();

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <StatusBar style={resolvedMode === 'dark' ? 'light' : 'dark'} />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.brand}>
          <Text style={styles.brandSymbol}>B</Text>
          <Text style={[styles.brandName, { color: colors.text }]}>Biblioteca</Text>
        </View>

        <Text style={[styles.eyebrow, { color: colors.goldText }]}>BEM-VINDO</Text>

        <Text style={[styles.title, { color: colors.text }]}>
          Seus livros e empréstimos em um só lugar.
        </Text>

        <Text style={[styles.description, { color: colors.textMuted }]}>
          Consulte o acervo, acompanhe seus empréstimos e encontre novos livros.
        </Text>

        <Pressable
          style={styles.primaryButton}
          onPress={() => router.push('/login')}
        >
          <Text style={styles.primaryButtonText}>Entrar</Text>
        </Pressable>

        <Pressable
          style={[styles.secondaryButton, { borderColor: colors.borderStrong }]}
          onPress={() => router.push('/cadastro')}
        >
          <Text style={[styles.secondaryButtonText, { color: colors.text }]}>
            Criar conta
          </Text>
        </Pressable>

        <Pressable onPress={() => router.push('/painel')}>
          <Text style={[styles.demoLink, { color: colors.goldText }]}>
            Ver protótipo sem login
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
