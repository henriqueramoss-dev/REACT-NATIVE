import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAppTheme } from '@/contexts/theme-context';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

type UserRole = 'client' | 'barber';

const DISPLAY_FONT = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  web: 'Georgia, serif',
});

type DashboardContent = {
  eyebrow: string;
  title: string;
  description: string;
  modules: {
    title: string;
    description: string;
    route?:
      | '/novo-agendamento'
      | '/meus-horarios'
      | '/servicos-planos'
      | '/avaliacoes'
      | '/conta'
      | '/agenda-barbeiro';
  }[];
};

const dashboards: Record<UserRole, DashboardContent> = {
  client: {
    eyebrow: 'ÁREA DO CLIENTE',
    title: 'Olá! Vamos cuidar do seu próximo horário?',
    description: 'Agende serviços e acompanhe tudo em um só lugar.',
    modules: [
      {
        title: 'Novo agendamento',
        description: 'Escolha serviço, barbeiro e horário.',
        route: '/novo-agendamento',
      },
      {
        title: 'Meus horários',
        description: 'Consulte, remarque ou cancele.',
        route: '/meus-horarios',
      },
      {
        title: 'Serviços e planos',
        description: 'Veja preços, imagens e benefícios.',
        route: '/servicos-planos',
      },
      {
        title: 'Avaliações',
        description: 'Veja opiniões e avalie atendimentos concluídos.',
        route: '/avaliacoes',
      },
      {
        title: 'Minha conta',
        description: 'Perfil, senha e preferências de notificações.',
        route: '/conta',
      },
    ],
  },
  barber: {
    eyebrow: 'GESTÃO DA BARBEARIA',
    title: 'Agenda e administração em uma única visão.',
    description: 'Atenda seus clientes e acompanhe toda a operação do negócio.',
    modules: [
      {
        title: 'Agenda e horários',
        description: 'Atendimentos de hoje e horários de trabalho.',
        route: '/agenda-barbeiro',
      },
      { title: 'Serviços', description: 'CRUD de serviços, preços, duração e imagens.' },
      { title: 'Produtos', description: 'CRUD de produtos, custos, preços e estoque.' },
      { title: 'Planos', description: 'Crie planos e acompanhe assinaturas.' },
      { title: 'Funcionários', description: 'Cadastre profissionais quando ampliar a equipe.' },
      { title: 'Clientes', description: 'Gerencie clientes e históricos de atendimento.' },
      { title: 'Financeiro', description: 'Receitas, gastos e resultado por período.' },
      { title: 'Relatórios e gráficos', description: 'Clientes, serviços e desempenho.' },
      { title: 'Avaliações', description: 'Acompanhe a satisfação dos clientes.' },
      { title: 'Notificações', description: 'Push, avisos e mensagens por e-mail.' },
    ],
  },
};

function isUserRole(value: string | string[] | undefined): value is UserRole {
  return value === 'client' || value === 'barber';
}

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
          Protótipo de navegação: os módulos serão implementados por etapas.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F2F3F5' },
  content: { paddingHorizontal: 22, paddingTop: 24, paddingBottom: 40 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 48,
  },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 10 },
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
    color: '#242629',
    fontFamily: DISPLAY_FONT,
    fontSize: 16,
    fontWeight: '800',
  },
  exit: { color: '#8A6818', fontSize: 14, fontWeight: '700' },
  eyebrow: {
    color: '#8A6818',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  title: {
    fontFamily: DISPLAY_FONT,
    maxWidth: 620,
    marginTop: 12,
    color: '#242629',
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 37,
  },
  description: { marginTop: 10, color: '#62666B', fontSize: 16, lineHeight: 23 },
  grid: { gap: 12, marginTop: 32 },
  card: {
    borderWidth: 1,
    borderColor: '#D9DADD',
    borderRadius: 18,
    backgroundColor: '#FAFAFA',
    padding: 18,
    overflow: 'hidden',
  },
  cardPressed: { backgroundColor: '#E7E8EA' },
  cardAccent: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 4,
    backgroundColor: '#C49A3A',
  },
  cardTitle: {
    color: '#242629',
    fontFamily: DISPLAY_FONT,
    fontSize: 17,
    fontWeight: '800',
  },
  cardDescription: { marginTop: 6, color: '#62666B', fontSize: 14, lineHeight: 20 },
  cardLink: { marginTop: 14, color: '#8A6818', fontSize: 13, fontWeight: '700' },
  prototypeNotice: {
    marginTop: 28,
    color: '#8A8E93',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
});
