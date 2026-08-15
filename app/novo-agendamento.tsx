import { useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { formatPrice, services } from '@/data/catalog';
import { useAppTheme } from '@/contexts/theme-context';

type AvailableDate = {
  id: string;
  weekday: string;
  day: string;
  month: string;
};

const DISPLAY_FONT = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  web: 'Georgia, serif',
});

const times = ['09:00', '10:00', '11:30', '13:30', '14:30', '16:00', '17:30', '19:00'];
const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

function buildAvailableDates(): AvailableDate[] {
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index);

    return {
      id: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
      weekday: index === 0 ? 'Hoje' : weekdays[date.getDay()],
      day: String(date.getDate()).padStart(2, '0'),
      month: months[date.getMonth()],
    };
  });
}

const availableDates = buildAvailableDates();

export default function NewAppointmentScreen() {
  const { colors, resolvedMode } = useAppTheme();
  const { serviceId: requestedServiceId } = useLocalSearchParams<{ serviceId?: string }>();
  const validRequestedService = services.some((service) => service.id === requestedServiceId)
    ? requestedServiceId
    : undefined;
  const [serviceId, setServiceId] = useState<string | undefined>(validRequestedService);
  const [dateId, setDateId] = useState<string>();
  const [time, setTime] = useState<string>();

  const selectedService = services.find((service) => service.id === serviceId);
  const selectedDate = availableDates.find((date) => date.id === dateId);
  const isComplete = Boolean(selectedService && selectedDate && time);

  function confirmAppointment() {
    if (!selectedService || !selectedDate || !time) {
      Alert.alert(
        'Falta escolher uma opção',
        'Selecione o serviço, o dia e o horário para continuar.',
      );
      return;
    }

    Alert.alert(
      'Agendamento pronto para confirmar',
      `${selectedService.name}\n${selectedDate.weekday}, ${selectedDate.day} ${selectedDate.month} às ${time}\n${formatPrice(selectedService.price)}`,
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <StatusBar style={resolvedMode === 'dark' ? 'light' : 'dark'} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.eyebrow, { color: colors.goldText }]}>NOVO AGENDAMENTO</Text>
        <Text style={[styles.title, { color: colors.text }]}>Escolha os detalhes do seu atendimento.</Text>
        <Text style={[styles.description, { color: colors.textMuted }]}>
          Você poderá revisar tudo antes de confirmar o horário.
        </Text>

        <View style={styles.section}>
          <StepHeader number="1" title="Qual serviço você deseja?" />
          <View style={styles.list}>
            {services.map((service) => {
              const selected = service.id === serviceId;
              return (
                <Pressable
                  key={service.id}
                  onPress={() => setServiceId(service.id)}
                  style={[
                    styles.selectionCard,
                    { backgroundColor: colors.surface, borderColor: colors.border },
                    selected && styles.selectionCardSelected,
                  ]}
                >
                  <View style={styles.selectionText}>
                    <Text style={[styles.selectionTitle, { color: colors.text }]}>{service.name}</Text>
                    <Text style={styles.selectionDescription}>
                      Aproximadamente {service.duration} minutos
                    </Text>
                  </View>
                  <Text style={styles.price}>{formatPrice(service.price)}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <StepHeader number="2" title="Escolha o dia" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.dateRow}>
              {availableDates.map((date) => {
                const selected = date.id === dateId;
                return (
                  <Pressable
                    key={date.id}
                    onPress={() => {
                      setDateId(date.id);
                      setTime(undefined);
                    }}
                    style={[
                      styles.dateCard,
                      { backgroundColor: colors.surface, borderColor: colors.border },
                      selected && styles.dateCardSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.dateWeekday,
                        { color: selected ? '#242629' : colors.textMuted },
                      ]}
                    >
                      {date.weekday}
                    </Text>
                    <Text
                      style={[
                        styles.dateDay,
                        { color: selected ? '#242629' : colors.text },
                      ]}
                    >
                      {date.day}
                    </Text>
                    <Text
                      style={[
                        styles.dateMonth,
                        { color: selected ? '#242629' : colors.textMuted },
                      ]}
                    >
                      {date.month}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>
        </View>

        <View style={styles.section}>
          <StepHeader number="3" title="Escolha o horário" />
          {!dateId ? (
            <Text style={styles.emptyMessage}>Escolha um dia para ver os horários.</Text>
          ) : (
            <View style={styles.timeGrid}>
              {times.map((availableTime) => {
                const selected = availableTime === time;
                return (
                  <Pressable
                    key={availableTime}
                    onPress={() => setTime(availableTime)}
                    style={[styles.timeButton, selected && styles.timeButtonSelected]}
                  >
                    <Text style={[styles.timeText, selected && styles.selectedText]}>
                      {availableTime}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          )}
        </View>

        {isComplete && selectedService && selectedDate && (
          <View style={[styles.summary, { backgroundColor: colors.surface }]}>
            <Text style={styles.summaryLabel}>RESUMO</Text>
            <Text style={[styles.summaryTitle, { color: colors.text }]}>{selectedService.name}</Text>
            <Text style={styles.summaryText}>
              {selectedDate.weekday}, {selectedDate.day} {selectedDate.month} às {time}
            </Text>
            <Text style={[styles.summaryPrice, { color: colors.text }]}>
              {formatPrice(selectedService.price)}
            </Text>
          </View>
        )}

        <Pressable
          onPress={confirmAppointment}
          style={({ pressed }) => [
            styles.confirmButton,
            !isComplete && styles.confirmButtonDisabled,
            pressed && isComplete && styles.confirmButtonPressed,
          ]}
        >
          <Text style={styles.confirmButtonText}>Revisar agendamento</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

function StepHeader({ number, title }: { number: string; title: string }) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.stepHeader}>
      <View style={styles.stepNumber}>
        <Text style={styles.stepNumberText}>{number}</Text>
      </View>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F2F3F5' },
  content: { paddingHorizontal: 20, paddingTop: 28, paddingBottom: 44 },
  eyebrow: {
    color: '#8A6818',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  title: {
    maxWidth: 560,
    marginTop: 12,
    color: '#242629',
    fontFamily: DISPLAY_FONT,
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 37,
  },
  description: { marginTop: 10, color: '#62666B', fontSize: 15, lineHeight: 22 },
  section: { marginTop: 36 },
  stepHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  stepNumber: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: '#C49A3A',
  },
  stepNumberText: { color: '#242629', fontSize: 12, fontWeight: '900' },
  sectionTitle: {
    flex: 1,
    color: '#242629',
    fontFamily: DISPLAY_FONT,
    fontSize: 19,
    fontWeight: '800',
  },
  list: { gap: 10 },
  selectionCard: {
    minHeight: 78,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D9DADD',
    borderRadius: 16,
    backgroundColor: '#FAFAFA',
    padding: 16,
  },
  selectionCardSelected: { borderWidth: 2, borderColor: '#C49A3A', padding: 15 },
  selectionText: { flex: 1, paddingRight: 10 },
  selectionTitle: { color: '#242629', fontSize: 16, fontWeight: '800' },
  selectionDescription: { marginTop: 5, color: '#62666B', fontSize: 13 },
  price: { color: '#8A6818', fontSize: 15, fontWeight: '800' },
  dateRow: { flexDirection: 'row', gap: 10 },
  dateCard: {
    width: 70,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D9DADD',
    borderRadius: 16,
    backgroundColor: '#FAFAFA',
    paddingVertical: 12,
  },
  dateCardSelected: { borderColor: '#C49A3A', backgroundColor: '#C49A3A' },
  dateWeekday: { color: '#62666B', fontSize: 12, fontWeight: '700' },
  dateDay: { marginTop: 5, color: '#242629', fontSize: 21, fontWeight: '900' },
  dateMonth: { marginTop: 2, color: '#62666B', fontSize: 12 },
  selectedText: { color: '#242629' },
  emptyMessage: {
    borderWidth: 1,
    borderColor: '#D9DADD',
    borderRadius: 14,
    padding: 18,
    color: '#62666B',
    fontSize: 14,
    textAlign: 'center',
  },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  timeButton: {
    width: '30%',
    minWidth: 88,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D9DADD',
    borderRadius: 12,
    backgroundColor: '#FAFAFA',
    paddingVertical: 13,
  },
  timeButtonSelected: { borderColor: '#C49A3A', backgroundColor: '#C49A3A' },
  timeText: { color: '#3B3E42', fontSize: 14, fontWeight: '700' },
  summary: {
    marginTop: 36,
    borderLeftWidth: 4,
    borderLeftColor: '#C49A3A',
    borderRadius: 14,
    backgroundColor: '#FAFAFA',
    padding: 18,
  },
  summaryLabel: { color: '#8A6818', fontSize: 10, fontWeight: '900', letterSpacing: 1.4 },
  summaryTitle: {
    marginTop: 10,
    color: '#242629',
    fontFamily: DISPLAY_FONT,
    fontSize: 19,
    fontWeight: '800',
  },
  summaryText: { marginTop: 6, color: '#62666B', fontSize: 14 },
  summaryPrice: { marginTop: 12, color: '#242629', fontSize: 18, fontWeight: '900' },
  confirmButton: {
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    borderRadius: 14,
    backgroundColor: '#C49A3A',
  },
  confirmButtonDisabled: { opacity: 0.45 },
  confirmButtonPressed: { transform: [{ scale: 0.99 }] },
  confirmButtonText: { color: '#242629', fontSize: 15, fontWeight: '900' },
});
