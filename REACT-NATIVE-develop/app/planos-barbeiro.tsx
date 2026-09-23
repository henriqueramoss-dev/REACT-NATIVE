import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useAppTheme } from '@/contexts/theme-context';
import { initialBarberPlans, type BarberPlan } from '@/data/barber-management';
import styles from '@/styles/management.styles';

export default function BarberPlansScreen() {
  const { colors, resolvedMode } = useAppTheme();
  const [plans, setPlans] = useState(initialBarberPlans);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  function addPlan() {
    const priceNumber = Number(price.replace(',', '.'));

    if (!name.trim() || priceNumber <= 0) {
      Alert.alert('Dados inválidos', 'Informe o nome e o valor do plano.');
      return;
    }

    const plan: BarberPlan = {
      id: `plan-${Date.now()}`,
      name: name.trim(),
      price: priceNumber,
      subscribers: 0,
      active: true,
    };

    setPlans((current) => [...current, plan]);
    setName('');
    setPrice('');
  }

  function togglePlan(id: string) {
    setPlans((current) =>
      current.map((plan) => (plan.id === id ? { ...plan, active: !plan.active } : plan)),
    );
  }

  function removePlan(id: string) {
    setPlans((current) => current.filter((plan) => plan.id !== id));
  }

  const subscribers = plans.reduce((total, plan) => total + plan.subscribers, 0);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <StatusBar style={resolvedMode === 'dark' ? 'light' : 'dark'} />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={[styles.eyebrow, { color: colors.goldText }]}>ASSINATURAS</Text>
        <Text style={[styles.title, { color: colors.text }]}>Planos</Text>
        <Text style={[styles.description, { color: colors.textMuted }]}>Crie planos mensais e acompanhe os assinantes.</Text>

        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.summaryValue, { color: colors.text }]}>{plans.length}</Text>
            <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>Planos</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.summaryValue, { color: colors.text }]}>{subscribers}</Text>
            <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>Assinantes</Text>
          </View>
        </View>

        <View style={[styles.formCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Novo plano</Text>
          <TextInput value={name} onChangeText={setName} placeholder="Nome do plano" placeholderTextColor={colors.placeholder} style={[styles.input, { color: colors.text, borderColor: colors.borderStrong, backgroundColor: colors.background }]} />
          <TextInput value={price} onChangeText={setPrice} placeholder="Valor mensal" placeholderTextColor={colors.placeholder} keyboardType="decimal-pad" style={[styles.input, { color: colors.text, borderColor: colors.borderStrong, backgroundColor: colors.background }]} />
          <Pressable onPress={addPlan} style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Adicionar plano</Text>
          </Pressable>
        </View>

        <View style={styles.list}>
          {plans.map((plan) => (
            <View key={plan.id} style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>{plan.name}</Text>
                <View style={[styles.badge, !plan.active && styles.badgeMuted]}>
                  <Text style={styles.badgeText}>{plan.active ? 'Ativo' : 'Inativo'}</Text>
                </View>
              </View>
              <Text style={[styles.cardSubtitle, { color: colors.textMuted }]}>{plan.subscribers} assinante(s)</Text>
              <Text style={[styles.cardValue, { color: colors.text }]}>R$ {plan.price.toFixed(2).replace('.', ',')} / mês</Text>
              <View style={styles.actions}>
                <Pressable onPress={() => togglePlan(plan.id)} style={[styles.smallButton, { borderColor: colors.borderStrong }]}>
                  <Text style={[styles.smallButtonText, { color: colors.text }]}>{plan.active ? 'Desativar' : 'Ativar'}</Text>
                </Pressable>
                <Pressable onPress={() => removePlan(plan.id)} style={[styles.smallButton, { borderColor: colors.borderStrong }]}>
                  <Text style={[styles.smallButtonText, styles.dangerText]}>Excluir</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
