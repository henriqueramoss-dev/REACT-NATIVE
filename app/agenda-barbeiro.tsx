import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useAppTheme } from '@/contexts/theme-context';
import { formatTime, isValidTime } from '@/utils/formatters';

type PageTab = 'agenda' | 'hours';
type AppointmentStatus = 'confirmed' | 'completed' | 'no-show';

type Appointment = {
  id: string;
  time: string;
  customer: string;
  service: string;
  duration: string;
  price: string;
  status: AppointmentStatus;
};

type WorkDay = {
  id: string;
  label: string;
  enabled: boolean;
  start: string;
  end: string;
};

const DISPLAY_FONT = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  web: 'Georgia, serif',
});

const initialAppointments: Appointment[] = [
  {
    id: 'today-1',
    time: '09:00',
    customer: 'Carlos Mendes',
    service: 'Corte tradicional',
    duration: '45 min',
    price: 'R$ 50,00',
    status: 'confirmed',
  },
  {
    id: 'today-2',
    time: '10:30',
    customer: 'André Souza',
    service: 'Corte + barba',
    duration: '1h15',
    price: 'R$ 75,00',
    status: 'confirmed',
  },
  {
    id: 'today-3',
    time: '14:00',
    customer: 'Matheus Rocha',
    service: 'Barba',
    duration: '30 min',
    price: 'R$ 35,00',
    status: 'confirmed',
  },
];

const initialWorkDays: WorkDay[] = [
  { id: 'monday', label: 'Segunda-feira', enabled: true, start: '09:00', end: '19:00' },
  { id: 'tuesday', label: 'Terça-feira', enabled: true, start: '09:00', end: '19:00' },
  { id: 'wednesday', label: 'Quarta-feira', enabled: true, start: '09:00', end: '19:00' },
  { id: 'thursday', label: 'Quinta-feira', enabled: true, start: '09:00', end: '19:00' },
  { id: 'friday', label: 'Sexta-feira', enabled: true, start: '09:00', end: '20:00' },
  { id: 'saturday', label: 'Sábado', enabled: true, start: '08:00', end: '17:00' },
  { id: 'sunday', label: 'Domingo', enabled: false, start: '09:00', end: '13:00' },
];

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

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 28, paddingBottom: 44 },
  eyebrow: { fontSize: 11, fontWeight: '800', letterSpacing: 1.5 },
  title: { marginTop: 12, fontFamily: DISPLAY_FONT, fontSize: 30, fontWeight: '800' },
  description: { marginTop: 10, fontSize: 15, lineHeight: 22 },
  tabs: { flexDirection: 'row', marginTop: 28, borderRadius: 14, padding: 4 },
  tab: { flex: 1, alignItems: 'center', borderRadius: 11, paddingVertical: 11 },
  tabText: { fontSize: 12, fontWeight: '800' },
  metrics: { flexDirection: 'row', gap: 9, marginTop: 22 },
  metric: { flex: 1, borderWidth: 1, borderRadius: 14, padding: 13 },
  metricValue: { fontFamily: DISPLAY_FONT, fontSize: 23, fontWeight: '900' },
  metricLabel: { marginTop: 5, fontSize: 10 },
  list: { gap: 12, marginTop: 16 },
  appointmentCard: { borderWidth: 1, borderRadius: 18, padding: 18 },
  appointmentHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  appointmentTime: { fontSize: 16, fontWeight: '900' },
  statusBadge: { borderRadius: 18, backgroundColor: '#E9D8A5', paddingHorizontal: 10, paddingVertical: 6 },
  statusBadgeMuted: { backgroundColor: '#D9DADD' },
  statusBadgeText: { color: '#242629', fontSize: 10, fontWeight: '800' },
  customerName: { marginTop: 16, fontFamily: DISPLAY_FONT, fontSize: 19, fontWeight: '800' },
  service: { marginTop: 6, fontSize: 13 },
  price: { marginTop: 10, fontSize: 14, fontWeight: '900' },
  actions: { flexDirection: 'row', gap: 9, marginTop: 18 },
  completeButton: { flex: 1, alignItems: 'center', borderRadius: 11, backgroundColor: '#C49A3A', paddingVertical: 12 },
  completeButtonText: { color: '#242629', fontSize: 12, fontWeight: '900' },
  outlineButton: { flex: 1, alignItems: 'center', borderWidth: 1, borderRadius: 11, paddingVertical: 12 },
  outlineButtonText: { fontSize: 11, fontWeight: '800' },
  hoursContent: { gap: 11, marginTop: 22 },
  dayCard: { borderWidth: 1, borderRadius: 16, padding: 16 },
  dayHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dayName: { fontFamily: DISPLAY_FONT, fontSize: 16, fontWeight: '800' },
  timeRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, marginTop: 15 },
  timeField: { flex: 1 },
  timeLabel: { marginBottom: 7, fontSize: 10, fontWeight: '700' },
  timeInput: { height: 46, borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, fontSize: 14, textAlign: 'center' },
  timeSeparator: { paddingBottom: 14, fontSize: 11 },
  closedText: { marginTop: 10, fontSize: 12 },
  saveButton: { height: 54, alignItems: 'center', justifyContent: 'center', marginTop: 8, borderRadius: 12, backgroundColor: '#C49A3A' },
  saveButtonText: { color: '#242629', fontSize: 14, fontWeight: '900' },
});
