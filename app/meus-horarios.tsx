import { router } from 'expo-router';
import { useAppTheme } from '@/contexts/theme-context';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  Alert,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type Tab = 'upcoming' | 'history';
type AppointmentStatus = 'confirmed' | 'cancelled' | 'completed';

type Appointment = {
  id: string;
  service: string;
  date: string;
  time: string;
  duration: string;
  price: string;
  status: AppointmentStatus;
};

const DISPLAY_FONT = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  web: 'Georgia, serif',
});

const weekdays = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
const months = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

function dateFromToday(offset: number) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return `${weekdays[date.getDay()]}, ${date.getDate()} de ${months[date.getMonth()]}`;
}

const initialAppointments: Appointment[] = [
  {
    id: 'appointment-1',
    service: 'Corte + barba',
    date: dateFromToday(2),
    time: '14:30',
    duration: '1h15',
    price: 'R$ 75,00',
    status: 'confirmed',
  },
  {
    id: 'appointment-2',
    service: 'Corte tradicional',
    date: dateFromToday(9),
    time: '10:00',
    duration: '45 min',
    price: 'R$ 50,00',
    status: 'confirmed',
  },
  {
    id: 'appointment-3',
    service: 'Barba',
    date: dateFromToday(-12),
    time: '16:00',
    duration: '30 min',
    price: 'R$ 35,00',
    status: 'completed',
  },
];

const statusContent: Record<AppointmentStatus, { label: string; style: 'gold' | 'gray' | 'red' }> = {
  confirmed: { label: 'Confirmado', style: 'gold' },
  completed: { label: 'Concluído', style: 'gray' },
  cancelled: { label: 'Cancelado', style: 'red' },
};

export default function MyAppointmentsScreen() {
  const { colors, resolvedMode } = useAppTheme();
  const [activeTab, setActiveTab] = useState<Tab>('upcoming');
  const [appointments, setAppointments] = useState(initialAppointments);
  const [appointmentToReview, setAppointmentToReview] = useState<Appointment>();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewedAppointmentIds, setReviewedAppointmentIds] = useState<string[]>([]);

  const visibleAppointments = appointments.filter((appointment) =>
    activeTab === 'upcoming'
      ? appointment.status === 'confirmed'
      : appointment.status === 'completed' || appointment.status === 'cancelled',
  );

  function cancelAppointment(appointment: Appointment) {
    Alert.alert(
      'Cancelar agendamento?',
      `${appointment.service}\n${appointment.date} às ${appointment.time}`,
      [
        { text: 'Voltar', style: 'cancel' },
        {
          text: 'Cancelar horário',
          style: 'destructive',
          onPress: () => {
            setAppointments((current) =>
              current.map((item) =>
                item.id === appointment.id ? { ...item, status: 'cancelled' } : item,
              ),
            );
          },
        },
      ],
    );
  }

  function openReview(appointment: Appointment) {
    setAppointmentToReview(appointment);
    setRating(0);
    setComment('');
  }

  function closeReview() {
    setAppointmentToReview(undefined);
    setRating(0);
    setComment('');
  }

  function submitReview() {
    if (!appointmentToReview) return;

    if (rating === 0) {
      Alert.alert('Escolha uma nota', 'Selecione de 1 a 5 estrelas para continuar.');
      return;
    }

    setReviewedAppointmentIds((current) => [...current, appointmentToReview.id]);
    closeReview();
    Alert.alert('Avaliação enviada', 'Obrigado por compartilhar sua experiência!');
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <StatusBar style={resolvedMode === 'dark' ? 'light' : 'dark'} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.eyebrow, { color: colors.goldText }]}>MINHA AGENDA</Text>
        <Text style={[styles.title, { color: colors.text }]}>Seus horários, sempre à mão.</Text>
        <Text style={[styles.description, { color: colors.textMuted }]}>
          Consulte os próximos atendimentos e o histórico de serviços.
        </Text>

        <View style={styles.tabs}>
          <TabButton
            label="Próximos"
            active={activeTab === 'upcoming'}
            onPress={() => setActiveTab('upcoming')}
          />
          <TabButton
            label="Histórico"
            active={activeTab === 'history'}
            onPress={() => setActiveTab('history')}
          />
        </View>

        {visibleAppointments.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>
              {activeTab === 'upcoming' ? 'Nenhum horário marcado' : 'Seu histórico está vazio'}
            </Text>
            <Text style={styles.emptyDescription}>
              {activeTab === 'upcoming'
                ? 'Quando você fizer um agendamento, ele aparecerá aqui.'
                : 'Atendimentos concluídos ou cancelados aparecerão aqui.'}
            </Text>
          </View>
        ) : (
          <View style={styles.list}>
            {visibleAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                onCancel={() => cancelAppointment(appointment)}
                onReview={() => openReview(appointment)}
                reviewed={reviewedAppointmentIds.includes(appointment.id)}
              />
            ))}
          </View>
        )}

        {activeTab === 'upcoming' && (
          <Pressable
            onPress={() => router.push('/novo-agendamento')}
            style={({ pressed }) => [styles.newButton, pressed && styles.buttonPressed]}
          >
            <Text style={styles.newButtonText}>Agendar novo horário</Text>
          </Pressable>
        )}
      </ScrollView>

      <Modal
        visible={Boolean(appointmentToReview)}
        transparent
        animationType="fade"
        onRequestClose={closeReview}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderText}>
                <Text style={styles.modalEyebrow}>AVALIAR ATENDIMENTO</Text>
                <Text style={styles.modalTitle}>{appointmentToReview?.service}</Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Fechar avaliação"
                onPress={closeReview}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>×</Text>
              </Pressable>
            </View>

            <Text style={styles.ratingQuestion}>Como foi sua experiência?</Text>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Pressable
                  key={star}
                  accessibilityRole="button"
                  accessibilityLabel={`${star} ${star === 1 ? 'estrela' : 'estrelas'}`}
                  onPress={() => setRating(star)}
                  style={styles.starButton}
                >
                  <Text style={[styles.star, star <= rating && styles.starSelected]}>★</Text>
                </Pressable>
              ))}
            </View>
            <Text style={styles.ratingLabel}>
              {rating === 0 ? 'Toque para escolher uma nota' : `${rating} de 5 estrelas`}
            </Text>

            <Text style={styles.commentLabel}>Conte mais (opcional)</Text>
            <TextInput
              value={comment}
              onChangeText={setComment}
              placeholder="O que você mais gostou?"
              placeholderTextColor="#8A8E93"
              multiline
              maxLength={500}
              textAlignVertical="top"
              style={styles.commentInput}
            />
            <Text style={styles.characterCount}>{comment.length}/500</Text>

            <Pressable
              onPress={submitReview}
              style={({ pressed }) => [
                styles.submitReviewButton,
                rating === 0 && styles.submitReviewButtonDisabled,
                pressed && rating > 0 && styles.buttonPressed,
              ]}
            >
              <Text style={styles.submitReviewButtonText}>Enviar avaliação</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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

function AppointmentCard({
  appointment,
  onCancel,
  onReview,
  reviewed,
}: {
  appointment: Appointment;
  onCancel: () => void;
  onReview: () => void;
  reviewed: boolean;
}) {
  const { colors } = useAppTheme();
  const status = statusContent[appointment.status];
  const isUpcoming = appointment.status === 'confirmed';

  return (
    <View
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
    >
      <View style={styles.cardTopRow}>
        <View style={styles.dateBadge}>
          <Text style={styles.dateBadgeTime}>{appointment.time}</Text>
        </View>
        <View
          style={[
            styles.status,
            status.style === 'gray' && styles.statusGray,
            status.style === 'red' && styles.statusRed,
          ]}
        >
          <Text style={styles.statusText}>{status.label}</Text>
        </View>
      </View>

      <Text style={[styles.cardTitle, { color: colors.text }]}>{appointment.service}</Text>
      <Text style={styles.cardDate}>{appointment.date}</Text>

      <View style={styles.detailsRow}>
        <Text style={styles.detail}>{appointment.duration}</Text>
        <View style={styles.detailDot} />
        <Text style={styles.price}>{appointment.price}</Text>
      </View>

      {isUpcoming && (
        <View style={styles.actions}>
          <Pressable onPress={() => router.push('/novo-agendamento')} style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Remarcar</Text>
          </Pressable>
          <Pressable onPress={onCancel} style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </Pressable>
        </View>
      )}

      {appointment.status === 'completed' && (
        <Pressable
          disabled={reviewed}
          onPress={onReview}
          style={[styles.reviewButton, reviewed && styles.reviewButtonDone]}
        >
          <Text style={[styles.reviewButtonText, reviewed && styles.reviewButtonTextDone]}>
            {reviewed ? 'Avaliação enviada' : 'Avaliar atendimento'}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F2F3F5' },
  content: { paddingHorizontal: 20, paddingTop: 28, paddingBottom: 44 },
  eyebrow: { color: '#8A6818', fontSize: 11, fontWeight: '800', letterSpacing: 1.5 },
  title: {
    maxWidth: 520,
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
  list: { gap: 14, marginTop: 22 },
  card: {
    borderWidth: 1,
    borderColor: '#D9DADD',
    borderRadius: 18,
    backgroundColor: '#FAFAFA',
    padding: 18,
  },
  cardTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dateBadge: { borderRadius: 9, backgroundColor: '#E7E8EA', paddingHorizontal: 11, paddingVertical: 7 },
  dateBadgeTime: { color: '#242629', fontSize: 14, fontWeight: '900' },
  status: { borderRadius: 20, backgroundColor: '#E9D8A5', paddingHorizontal: 11, paddingVertical: 6 },
  statusGray: { backgroundColor: '#E2E3E5' },
  statusRed: { backgroundColor: '#F3DDDD' },
  statusText: { color: '#3B3E42', fontSize: 11, fontWeight: '800' },
  cardTitle: {
    marginTop: 18,
    color: '#242629',
    fontFamily: DISPLAY_FONT,
    fontSize: 20,
    fontWeight: '800',
  },
  cardDate: { marginTop: 7, color: '#62666B', fontSize: 14 },
  detailsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 13 },
  detail: { color: '#62666B', fontSize: 13 },
  detailDot: { width: 4, height: 4, marginHorizontal: 9, borderRadius: 2, backgroundColor: '#C49A3A' },
  price: { color: '#242629', fontSize: 14, fontWeight: '800' },
  actions: { flexDirection: 'row', gap: 10, marginTop: 20 },
  secondaryButton: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 11,
    backgroundColor: '#C49A3A',
    paddingVertical: 12,
  },
  secondaryButtonText: { color: '#242629', fontSize: 13, fontWeight: '900' },
  cancelButton: {
    flex: 1,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CED0D4',
    borderRadius: 11,
    paddingVertical: 12,
  },
  cancelButtonText: { color: '#62666B', fontSize: 13, fontWeight: '800' },
  reviewButton: {
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#C49A3A',
    borderRadius: 11,
    paddingVertical: 12,
  },
  reviewButtonText: { color: '#8A6818', fontSize: 13, fontWeight: '800' },
  reviewButtonDone: { borderColor: '#D9DADD', backgroundColor: '#E7E8EA' },
  reviewButtonTextDone: { color: '#62666B' },
  newButton: {
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    borderRadius: 14,
    backgroundColor: '#C49A3A',
  },
  newButtonText: { color: '#242629', fontSize: 15, fontWeight: '900' },
  buttonPressed: { transform: [{ scale: 0.99 }] },
  emptyState: {
    alignItems: 'center',
    marginTop: 22,
    borderWidth: 1,
    borderColor: '#D9DADD',
    borderRadius: 18,
    backgroundColor: '#FAFAFA',
    padding: 30,
  },
  emptyTitle: { color: '#242629', fontFamily: DISPLAY_FONT, fontSize: 18, fontWeight: '800' },
  emptyDescription: { marginTop: 8, color: '#62666B', fontSize: 13, lineHeight: 19, textAlign: 'center' },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(20, 22, 24, 0.62)',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
    borderRadius: 20,
    backgroundColor: '#FAFAFA',
    padding: 20,
  },
  modalHeader: { flexDirection: 'row', alignItems: 'flex-start' },
  modalHeaderText: { flex: 1, paddingRight: 12 },
  modalEyebrow: { color: '#8A6818', fontSize: 10, fontWeight: '900', letterSpacing: 1.3 },
  modalTitle: {
    marginTop: 7,
    color: '#242629',
    fontFamily: DISPLAY_FONT,
    fontSize: 22,
    fontWeight: '800',
  },
  closeButton: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 17,
    backgroundColor: '#E7E8EA',
  },
  closeButtonText: { color: '#3B3E42', fontSize: 25, lineHeight: 27 },
  ratingQuestion: { marginTop: 26, color: '#3B3E42', fontSize: 14, fontWeight: '700' },
  starsRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 14 },
  starButton: { paddingHorizontal: 5, paddingVertical: 4 },
  star: { color: '#CED0D4', fontSize: 38 },
  starSelected: { color: '#C49A3A' },
  ratingLabel: { marginTop: 5, color: '#62666B', fontSize: 12, textAlign: 'center' },
  commentLabel: { marginTop: 24, marginBottom: 9, color: '#3B3E42', fontSize: 13, fontWeight: '800' },
  commentInput: {
    minHeight: 110,
    borderWidth: 1,
    borderColor: '#CED0D4',
    borderRadius: 12,
    backgroundColor: '#F2F3F5',
    padding: 14,
    color: '#242629',
    fontSize: 14,
    lineHeight: 20,
  },
  characterCount: { marginTop: 6, color: '#8A8E93', fontSize: 11, textAlign: 'right' },
  submitReviewButton: {
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    borderRadius: 12,
    backgroundColor: '#C49A3A',
  },
  submitReviewButtonDisabled: { opacity: 0.45 },
  submitReviewButtonText: { color: '#242629', fontSize: 14, fontWeight: '900' },
});
