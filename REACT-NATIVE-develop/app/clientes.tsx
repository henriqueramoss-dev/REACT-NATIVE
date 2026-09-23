import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';
import { useAppTheme } from '@/contexts/theme-context';
import { initialCustomers } from '@/data/barber-management';
import styles from '@/styles/management.styles';

export default function CustomersScreen() {
  const { colors, resolvedMode } = useAppTheme();
  const [search, setSearch] = useState('');

  const filteredCustomers = initialCustomers.filter((customer) =>
    customer.name.toLowerCase().includes(search.trim().toLowerCase()),
  );

  const totalAppointments = initialCustomers.reduce(
    (total, customer) => total + customer.appointments,
    0,
  );

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <StatusBar style={resolvedMode === 'dark' ? 'light' : 'dark'} />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={[styles.eyebrow, { color: colors.goldText }]}>RELACIONAMENTO</Text>
        <Text style={[styles.title, { color: colors.text }]}>Clientes</Text>
        <Text style={[styles.description, { color: colors.textMuted }]}>Consulte clientes e o histórico resumido de atendimentos.</Text>

        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.summaryValue, { color: colors.text }]}>{initialCustomers.length}</Text>
            <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>Clientes</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.summaryValue, { color: colors.text }]}>{totalAppointments}</Text>
            <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>Atendimentos</Text>
          </View>
        </View>

        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Pesquisar cliente"
          placeholderTextColor={colors.placeholder}
          style={[styles.searchInput, { color: colors.text, borderColor: colors.borderStrong, backgroundColor: colors.surface }]}
        />

        {filteredCustomers.length > 0 ? (
          <View style={styles.list}>
            {filteredCustomers.map((customer) => (
              <View key={customer.id} style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>{customer.name}</Text>
                <Text style={[styles.cardSubtitle, { color: colors.textMuted }]}>{customer.phone}</Text>
                <Text style={[styles.cardSubtitle, { color: colors.textMuted }]}>Última visita: {customer.lastVisit}</Text>
                <Text style={[styles.cardValue, { color: colors.text }]}>{customer.appointments} atendimento(s)</Text>
              </View>
            ))}
          </View>
        ) : (
          <View style={[styles.empty, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>Nenhum cliente encontrado.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
