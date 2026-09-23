import { router } from 'expo-router';
import { useAppTheme } from '@/contexts/theme-context';
import styles from '@/styles/meus-horarios.styles';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  initialAppointments,
  statusContent,
  type Appointment,
  type AppointmentTab,
} from '@/data/my-appointments';

export default function MyAppointmentsScreen() {
  const { colors, resolvedMode } = useAppTheme();
  const [activeTab, setActiveTab] = useState<AppointmentTab>('upcoming');
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
