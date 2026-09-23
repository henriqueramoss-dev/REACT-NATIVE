import { useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { formatPrice, services } from '@/data/catalog';
import { availableDates, times } from '@/data/booking';
import { useAppTheme } from '@/contexts/theme-context';
import styles from '@/styles/novo-agendamento.styles';

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
