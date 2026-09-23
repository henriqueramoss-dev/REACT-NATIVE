import { StatusBar } from 'expo-status-bar';
import { ScrollView, Text, View } from 'react-native';
import { useAppTheme } from '@/contexts/theme-context';
import { monthlyResults, reportServices } from '@/data/barber-management';
import styles from '@/styles/management.styles';

export default function ReportsScreen() {
  const { colors, resolvedMode } = useAppTheme();

  const totalAppointments = reportServices.reduce(
    (total, service) => total + service.appointments,
    0,
  );

  const totalRevenue = reportServices.reduce(
    (total, service) => total + service.revenue,
    0,
  );

  const currentMonth = monthlyResults[monthlyResults.length - 1];
  const bestService = [...reportServices].sort(
    (a, b) => b.appointments - a.appointments,
  )[0];

  const maxAppointments = Math.max(
    ...reportServices.map((service) => service.appointments),
  );

  function money(value: number) {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <StatusBar style={resolvedMode === 'dark' ? 'light' : 'dark'} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.eyebrow, { color: colors.goldText }]}>INDICADORES</Text>
        <Text style={[styles.title, { color: colors.text }]}>Relatórios e gráficos</Text>
        <Text style={[styles.description, { color: colors.textMuted }]}>Veja um resumo simples do desempenho da barbearia.</Text>

        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.summaryValue, { color: colors.text }]}>{totalAppointments}</Text>
            <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>Atendimentos</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.summaryValue, { color: colors.text }]}>{money(totalRevenue)}</Text>
            <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>Receita</Text>
          </View>
        </View>

        <View style={[styles.card, { marginTop: 20, backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Destaques</Text>
          <Text style={[styles.cardSubtitle, { color: colors.textMuted }]}>Serviço mais procurado</Text>
          <Text style={[styles.cardValue, { color: colors.text }]}>{bestService.name}</Text>
          <Text style={[styles.cardSubtitle, { marginTop: 12, color: colors.textMuted }]}>Resultado de {currentMonth.month}</Text>
          <Text style={[styles.cardValue, { color: colors.text }]}>{money(currentMonth.revenue - currentMonth.expenses)}</Text>
        </View>

        <View style={[styles.formCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Serviços mais realizados</Text>
          {reportServices.map((service) => {
            const width = `${Math.round((service.appointments / maxAppointments) * 100)}%` as `${number}%`;

            return (
              <View key={service.name}>
                <View style={styles.cardHeader}>
                  <Text style={[styles.cardTitle, { color: colors.text }]}>{service.name}</Text>
                  <Text style={[styles.cardSubtitle, { color: colors.textMuted }]}>{service.appointments}</Text>
                </View>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width }]} />
                </View>
              </View>
            );
          })}
        </View>

        <View style={[styles.formCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Resultado mensal</Text>
          {monthlyResults.map((item) => (
            <View key={item.month} style={styles.cardHeader}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>{item.month}</Text>
              <Text style={[styles.cardSubtitle, { color: colors.textMuted }]}>{money(item.revenue - item.expenses)}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
