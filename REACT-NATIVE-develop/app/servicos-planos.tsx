import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { formatPrice, plans, services, type Plan, type Service } from '@/data/catalog';
import { useAppTheme } from '@/contexts/theme-context';
import styles from '@/styles/servicos-planos.styles';

type CatalogTab = 'services' | 'plans';

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
