import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useAppTheme } from '@/contexts/theme-context';
import styles from '@/styles/agenda-barbeiro.styles';
import { formatTime, isValidTime } from '@/utils/formatters';
import {
  initialAppointments,
  initialWorkDays,
  type AppointmentStatus,
  type PageTab,
  type WorkDay,
} from '@/data/barber-schedule';

export default function BarberScheduleScreen() {
  const { colors, resolvedMode } = useAppTheme();
  const [activeTab, setActiveTab] = useState<PageTab>('agenda');
  const [appointments, setAppointments] = useState(initialAppointments);
  const [workDays, setWorkDays] = useState(initialWorkDays);

  const confirmedCount = appointments.filter((item) => item.status === 'confirmed').length;
  const completedCount = appointments.filter((item) => item.status === 'completed').length;

  function updateAppointmentStatus(id: string, status: AppointmentStatus) {
    setAppointments((current) =>
      current.map((item) => (item.id === id ? { ...item, status } : item)),
    );
  }

  function updateWorkDay(id: string, changes: Partial<WorkDay>) {
    setWorkDays((current) =>
      current.map((day) => (day.id === id ? { ...day, ...changes } : day)),
    );
  }

  function saveWorkHours() {
    const invalidDay = workDays.find(
      (day) => day.enabled && (!isValidTime(day.start) || !isValidTime(day.end)),
    );

    if (invalidDay) {
      Alert.alert('Horário inválido', `Confira os horários de ${invalidDay.label}.`);
      return;
    }

    Alert.alert('Horários atualizados', 'A disponibilidade foi salva nesta sessão.');
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <StatusBar style={resolvedMode === 'dark' ? 'light' : 'dark'} />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={[styles.eyebrow, { color: colors.goldText }]}>GESTÃO DA ROTINA</Text>
        <Text style={[styles.title, { color: colors.text }]}>Agenda e horários.</Text>
        <Text style={[styles.description, { color: colors.textMuted }]}>
          Acompanhe o dia e controle quando novos agendamentos podem ser feitos.
        </Text>

        <View style={[styles.tabs, { backgroundColor: colors.surfaceMuted }]}>
          <TabButton
            label="Agenda de hoje"
            active={activeTab === 'agenda'}
            onPress={() => setActiveTab('agenda')}
          />
          <TabButton
            label="Horários de trabalho"
            active={activeTab === 'hours'}
            onPress={() => setActiveTab('hours')}
          />
        </View>

        {activeTab === 'agenda' ? (
          <>
            <View style={styles.metrics}>
              <Metric label="Aguardando" value={String(confirmedCount)} />
              <Metric label="Concluídos" value={String(completedCount)} />
              <Metric label="Total do dia" value={String(appointments.length)} />
            </View>

            <View style={styles.list}>
              {appointments.map((appointment) => (
                <View
                  key={appointment.id}
                  style={[
                    styles.appointmentCard,
                    { backgroundColor: colors.surface, borderColor: colors.border },
                  ]}
                >
                  <View style={styles.appointmentHeader}>
                    <Text style={[styles.appointmentTime, { color: colors.goldText }]}>
                      {appointment.time}
                    </Text>
                    <StatusBadge status={appointment.status} />
                  </View>
                  <Text style={[styles.customerName, { color: colors.text }]}>
                    {appointment.customer}
                  </Text>
                  <Text style={[styles.service, { color: colors.textMuted }]}>
                    {appointment.service} · {appointment.duration}
                  </Text>
                  <Text style={[styles.price, { color: colors.text }]}>{appointment.price}</Text>

                  {appointment.status === 'confirmed' && (
                    <View style={styles.actions}>
                      <Pressable
                        onPress={() => updateAppointmentStatus(appointment.id, 'completed')}
                        style={styles.completeButton}
                      >
                        <Text style={styles.completeButtonText}>Concluir</Text>
                      </Pressable>
                      <Pressable
                        onPress={() => updateAppointmentStatus(appointment.id, 'no-show')}
                        style={[styles.outlineButton, { borderColor: colors.borderStrong }]}
                      >
                        <Text style={[styles.outlineButtonText, { color: colors.textMuted }]}>
                          Não compareceu
                        </Text>
                      </Pressable>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </>
        ) : (
          <View style={styles.hoursContent}>
            {workDays.map((day) => (
              <View
                key={day.id}
                style={[
                  styles.dayCard,
                  { backgroundColor: colors.surface, borderColor: colors.border },
                ]}
              >
                <View style={styles.dayHeader}>
                  <Text style={[styles.dayName, { color: colors.text }]}>{day.label}</Text>
                  <Switch
                    value={day.enabled}
                    onValueChange={(enabled) => updateWorkDay(day.id, { enabled })}
                    trackColor={{ false: colors.borderStrong, true: colors.gold }}
                    thumbColor={day.enabled ? colors.text : colors.surface}
                  />
                </View>

                {day.enabled ? (
                  <View style={styles.timeRow}>
                    <TimeField
                      label="Abertura"
                      value={day.start}
                      onChangeText={(start) => updateWorkDay(day.id, { start })}
                    />
                    <Text style={[styles.timeSeparator, { color: colors.textMuted }]}>até</Text>
                    <TimeField
                      label="Fechamento"
                      value={day.end}
                      onChangeText={(end) => updateWorkDay(day.id, { end })}
                    />
                  </View>
                ) : (
                  <Text style={[styles.closedText, { color: colors.textMuted }]}>Fechado</Text>
                )}
              </View>
            ))}

            <Pressable onPress={saveWorkHours} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Salvar horários</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function TabButton({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  const { colors } = useAppTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[styles.tab, active && { backgroundColor: colors.surface }]}
    >
      <Text style={[styles.tabText, { color: active ? colors.text : colors.textMuted }]}>
        {label}
      </Text>
    </Pressable>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  const { colors } = useAppTheme();
  return (
    <View style={[styles.metric, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Text style={[styles.metricValue, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.metricLabel, { color: colors.textMuted }]}>{label}</Text>
    </View>
  );
}

function StatusBadge({ status }: { status: AppointmentStatus }) {
  const labels: Record<AppointmentStatus, string> = {
    confirmed: 'Confirmado',
    completed: 'Concluído',
    'no-show': 'Não compareceu',
  };
  return (
    <View style={[styles.statusBadge, status !== 'confirmed' && styles.statusBadgeMuted]}>
      <Text style={styles.statusBadgeText}>{labels[status]}</Text>
    </View>
  );
}

function TimeField({
  label,
  value,
  onChangeText,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
}) {
  const { colors } = useAppTheme();
  return (
    <View style={styles.timeField}>
      <Text style={[styles.timeLabel, { color: colors.textMuted }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={(text) => onChangeText(formatTime(text))}
        keyboardType="number-pad"
        maxLength={5}
        style={[
          styles.timeInput,
          {
            backgroundColor: colors.background,
            borderColor: colors.borderStrong,
            color: colors.text,
          },
        ]}
      />
    </View>
  );
}
