import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { useAppTheme } from '@/contexts/theme-context';
import styles from '@/styles/biblioteca.styles';

const modules = [
  {
    title: 'Livros',
    description: 'Consulte e pesquise o acervo da biblioteca.',
    icon: '📚',
    route: '/livros' as const,
  },
  {
    title: 'Empréstimos',
    description: 'Veja seus livros emprestados e o prazo de devolução.',
    icon: '🔄',
    route: '/emprestimos' as const,
  },
  {
    title: 'Autores',
    description: 'Consulte os autores cadastrados.',
    icon: '✍️',
    route: '/autores' as const,
  },
  {
    title: 'Categorias',
    description: 'Explore os livros por categoria.',
    icon: '🏷️',
    route: '/categorias' as const,
  },
  {
    title: 'Minha conta',
    description: 'Consulte e altere seus dados pessoais.',
    icon: '👤',
    route: '/conta' as const,
  },
];

export default function DashboardScreen() {
  const { colors, resolvedMode } = useAppTheme();

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <StatusBar style={resolvedMode === 'dark' ? 'light' : 'dark'} />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.topBar}>
          <View style={styles.brand}>
            <Text style={styles.brandSymbol}>B</Text>
            <Text style={[styles.brandName, { color: colors.text }]}>Biblioteca</Text>
          </View>

          <Pressable onPress={() => router.replace('/')}>
            <Text style={[styles.exit, { color: colors.goldText }]}>Sair</Text>
          </Pressable>
        </View>

        <Text style={[styles.eyebrow, { color: colors.goldText }]}>PAINEL</Text>

        <Text style={[styles.title, { color: colors.text }]}>
          O que você deseja consultar?
        </Text>

        <Text style={[styles.description, { color: colors.textMuted }]}>
          Acesse os principais recursos da biblioteca.
        </Text>

        <View style={styles.list}>
          {modules.map((module) => (
            <Pressable
              key={module.title}
              style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={() => router.push(module.route)}
            >
              <Text style={styles.cardIcon}>{module.icon}</Text>

              <View style={styles.cardText}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>{module.title}</Text>
                <Text style={[styles.cardDescription, { color: colors.textMuted }]}>
                  {module.description}
                </Text>
              </View>

              <Text style={[styles.arrow, { color: colors.goldText }]}>›</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
