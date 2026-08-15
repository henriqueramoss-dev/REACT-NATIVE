import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { formatPrice, plans, services, type Plan, type Service } from '@/data/catalog';
import { useAppTheme } from '@/contexts/theme-context';

type CatalogTab = 'services' | 'plans';

const DISPLAY_FONT = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  web: 'Georgia, serif',
});

export default function ServicesAndPlansScreen() {
  const { colors, resolvedMode } = useAppTheme();
  const [activeTab, setActiveTab] = useState<CatalogTab>('services');

  function selectPlan(plan: Plan) {
    Alert.alert(
      `Plano ${plan.name}`,
      'A contratação ainda é demonstrativa. Na próxima etapa, conectaremos pagamento e assinatura.',
      [{ text: 'Entendi' }],
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <StatusBar style={resolvedMode === 'dark' ? 'light' : 'dark'} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.eyebrow, { color: colors.goldText }]}>NOSSO CATÁLOGO</Text>
        <Text style={[styles.title, { color: colors.text }]}>Escolha o cuidado ideal para você.</Text>
        <Text style={[styles.description, { color: colors.textMuted }]}>
          Serviços avulsos ou planos para manter o visual sempre em dia.
        </Text>

        <View style={styles.tabs}>
          <TabButton
            label="Serviços"
            active={activeTab === 'services'}
            onPress={() => setActiveTab('services')}
          />
          <TabButton
            label="Planos"
            active={activeTab === 'plans'}
            onPress={() => setActiveTab('plans')}
          />
        </View>

        {activeTab === 'services' ? (
          <View style={styles.list}>
            {services.map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
          </View>
        ) : (
          <View style={styles.list}>
            {plans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} onSelect={() => selectPlan(plan)} />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function TabButton({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.tab, active && styles.tabActive]}>
      <Text style={[styles.tabText, active && styles.tabTextActive]}>{label}</Text>
    </Pressable>
  );
}

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const { colors } = useAppTheme();

  return (
    <View
      style={[
        styles.serviceCard,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <View style={styles.serviceImagePlaceholder}>
        <Text style={styles.serviceImageNumber}>{String(index + 1).padStart(2, '0')}</Text>
      </View>
      <View style={styles.serviceBody}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>{service.name}</Text>
        <Text style={styles.cardDescription}>{service.description}</Text>
        <View style={styles.serviceDetails}>
          <Text style={styles.duration}>{service.duration} min</Text>
          <Text style={styles.price}>{formatPrice(service.price)}</Text>
        </View>
        <Pressable
          onPress={() =>
            router.push({ pathname: '/novo-agendamento', params: { serviceId: service.id } })
          }
          style={({ pressed }) => [styles.actionButton, pressed && styles.buttonPressed]}
        >
          <Text style={styles.actionButtonText}>Agendar este serviço</Text>
        </Pressable>
      </View>
    </View>
  );
}

function PlanCard({ plan, onSelect }: { plan: Plan; onSelect: () => void }) {
  const { colors } = useAppTheme();

  return (
    <View
      style={[
        styles.planCard,
        { backgroundColor: colors.surface, borderColor: colors.border },
        plan.featured && styles.planCardFeatured,
      ]}
    >
      {plan.featured && (
        <View style={styles.featuredBadge}>
          <Text style={styles.featuredBadgeText}>MAIS ESCOLHIDO</Text>
        </View>
      )}
      <Text style={[styles.planName, { color: colors.text }]}>{plan.name}</Text>
      <Text style={styles.cardDescription}>{plan.description}</Text>
      <View style={styles.planPriceRow}>
        <Text style={[styles.planPrice, { color: colors.text }]}>{formatPrice(plan.price)}</Text>
        <Text style={styles.planFrequency}>{plan.frequency}</Text>
      </View>
      <View style={styles.benefits}>
        {plan.benefits.map((benefit) => (
          <View key={benefit} style={styles.benefitRow}>
            <Text style={styles.check}>✓</Text>
            <Text style={[styles.benefitText, { color: colors.textSecondary }]}>
              {benefit}
            </Text>
          </View>
        ))}
      </View>
      <Pressable
        onPress={onSelect}
        style={({ pressed }) => [
          styles.planButton,
          plan.featured && styles.planButtonFeatured,
          pressed && styles.buttonPressed,
        ]}
      >
        <Text
          style={[
            styles.planButtonText,
            { color: plan.featured ? '#242629' : colors.goldText },
          ]}
        >
          Quero este plano
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F2F3F5' },
  content: { paddingHorizontal: 20, paddingTop: 28, paddingBottom: 44 },
  eyebrow: { color: '#8A6818', fontSize: 11, fontWeight: '800', letterSpacing: 1.5 },
  title: {
    maxWidth: 540,
    marginTop: 12,
    color: '#242629',
    fontFamily: DISPLAY_FONT,
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 37,
  },
  description: { marginTop: 10, color: '#62666B', fontSize: 15, lineHeight: 22 },
  tabs: {
    flexDirection: 'row',
    marginTop: 30,
    borderRadius: 14,
    backgroundColor: '#E7E8EA',
    padding: 4,
  },
  tab: { flex: 1, alignItems: 'center', borderRadius: 11, paddingVertical: 11 },
  tabActive: { backgroundColor: '#FAFAFA' },
  tabText: { color: '#62666B', fontSize: 14, fontWeight: '700' },
  tabTextActive: { color: '#242629' },
  list: { gap: 16, marginTop: 22 },
  serviceCard: {
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#D9DADD',
    borderRadius: 18,
    backgroundColor: '#FAFAFA',
  },
  serviceImagePlaceholder: {
    height: 92,
    justifyContent: 'center',
    backgroundColor: '#242629',
    paddingHorizontal: 18,
  },
  serviceImageNumber: { color: '#C49A3A', fontFamily: DISPLAY_FONT, fontSize: 30, fontWeight: '800' },
  serviceBody: { padding: 18 },
  cardTitle: { color: '#242629', fontFamily: DISPLAY_FONT, fontSize: 20, fontWeight: '800' },
  cardDescription: { marginTop: 7, color: '#62666B', fontSize: 14, lineHeight: 20 },
  serviceDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  duration: { color: '#62666B', fontSize: 13, fontWeight: '700' },
  price: { color: '#242629', fontSize: 17, fontWeight: '900' },
  actionButton: {
    alignItems: 'center',
    marginTop: 18,
    borderRadius: 11,
    backgroundColor: '#C49A3A',
    paddingVertical: 13,
  },
  actionButtonText: { color: '#242629', fontSize: 13, fontWeight: '900' },
  planCard: {
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#D9DADD',
    borderRadius: 18,
    backgroundColor: '#FAFAFA',
    padding: 20,
  },
  planCardFeatured: { borderWidth: 2, borderColor: '#C49A3A', padding: 19 },
  featuredBadge: {
    alignSelf: 'flex-start',
    marginBottom: 16,
    borderRadius: 20,
    backgroundColor: '#C49A3A',
    paddingHorizontal: 11,
    paddingVertical: 6,
  },
  featuredBadgeText: { color: '#242629', fontSize: 9, fontWeight: '900', letterSpacing: 1.2 },
  planName: { color: '#242629', fontFamily: DISPLAY_FONT, fontSize: 23, fontWeight: '800' },
  planPriceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 7, marginTop: 20 },
  planPrice: { color: '#242629', fontFamily: DISPLAY_FONT, fontSize: 28, fontWeight: '900' },
  planFrequency: { color: '#62666B', fontSize: 12 },
  benefits: { gap: 11, marginTop: 22 },
  benefitRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  check: { color: '#8A6818', fontSize: 15, fontWeight: '900' },
  benefitText: { flex: 1, color: '#3B3E42', fontSize: 14 },
  planButton: {
    alignItems: 'center',
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#C49A3A',
    borderRadius: 11,
    paddingVertical: 13,
  },
  planButtonFeatured: { backgroundColor: '#C49A3A' },
  planButtonText: { color: '#242629', fontSize: 13, fontWeight: '900' },
  buttonPressed: { transform: [{ scale: 0.99 }] },
});
