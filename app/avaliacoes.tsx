import { StatusBar } from 'expo-status-bar';
import { useAppTheme } from '@/contexts/theme-context';
import { useMemo, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

type RatingFilter = 'all' | 5 | 4 | 3;

type Review = {
  id: string;
  customer: string;
  initials: string;
  rating: number;
  service: string;
  date: string;
  comment: string;
  helpful: number;
};

const DISPLAY_FONT = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  web: 'Georgia, serif',
});

const reviews: Review[] = [
  {
    id: 'review-1',
    customer: 'Carlos M.',
    initials: 'CM',
    rating: 5,
    service: 'Corte + barba',
    date: 'Há 2 dias',
    comment: 'Atendimento excelente, sem atrasos e com muito cuidado nos detalhes. Voltarei com certeza.',
    helpful: 8,
  },
  {
    id: 'review-2',
    customer: 'André S.',
    initials: 'AS',
    rating: 5,
    service: 'Corte tradicional',
    date: 'Há 1 semana',
    comment: 'O corte ficou exatamente como pedi. Ambiente organizado e atendimento muito profissional.',
    helpful: 5,
  },
  {
    id: 'review-3',
    customer: 'Matheus R.',
    initials: 'MR',
    rating: 4,
    service: 'Barba',
    date: 'Há 2 semanas',
    comment: 'Gostei bastante do resultado e da atenção durante o atendimento.',
    helpful: 3,
  },
  {
    id: 'review-4',
    customer: 'Bruno L.',
    initials: 'BL',
    rating: 5,
    service: 'Acabamento',
    date: 'Há 3 semanas',
    comment: 'Serviço rápido e acabamento muito bem feito. Recomendo.',
    helpful: 2,
  },
];

const distribution = [
  { stars: 5, percentage: 82 },
  { stars: 4, percentage: 14 },
  { stars: 3, percentage: 4 },
  { stars: 2, percentage: 0 },
  { stars: 1, percentage: 0 },
];

export default function ReviewsScreen() {
  const { colors, resolvedMode } = useAppTheme();
  const [filter, setFilter] = useState<RatingFilter>('all');
  const [helpfulReviewIds, setHelpfulReviewIds] = useState<string[]>([]);

  const visibleReviews = useMemo(
    () => (filter === 'all' ? reviews : reviews.filter((review) => review.rating === filter)),
    [filter],
  );

  function toggleHelpful(reviewId: string) {
    setHelpfulReviewIds((current) =>
      current.includes(reviewId)
        ? current.filter((id) => id !== reviewId)
        : [...current, reviewId],
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <StatusBar style={resolvedMode === 'dark' ? 'light' : 'dark'} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.eyebrow, { color: colors.goldText }]}>OPINIÕES DOS CLIENTES</Text>
        <Text style={[styles.title, { color: colors.text }]}>Experiências de quem já passou por aqui.</Text>
        <Text style={[styles.description, { color: colors.textMuted }]}>
          Avaliações publicadas após atendimentos concluídos.
        </Text>

        <View
          style={[
            styles.summaryCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <View style={styles.scoreColumn}>
            <Text style={[styles.score, { color: colors.text }]}>4,8</Text>
            <Stars rating={5} size={20} />
            <Text style={styles.reviewCount}>128 avaliações</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.distribution}>
            {distribution.map((item) => (
              <View key={item.stars} style={styles.distributionRow}>
                <Text style={styles.distributionLabel}>{item.stars}</Text>
                <Text style={styles.smallStar}>★</Text>
                <View style={styles.progressTrack}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${item.percentage}%` as `${number}%` },
                    ]}
                  />
                </View>
                <Text style={styles.percentage}>{item.percentage}%</Text>
              </View>
            ))}
          </View>
        </View>

        <Text style={[styles.filterTitle, { color: colors.textSecondary }]}>Filtrar avaliações</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filters}>
            <FilterButton label="Todas" active={filter === 'all'} onPress={() => setFilter('all')} />
            <FilterButton label="5 estrelas" active={filter === 5} onPress={() => setFilter(5)} />
            <FilterButton label="4 estrelas" active={filter === 4} onPress={() => setFilter(4)} />
            <FilterButton label="3 estrelas" active={filter === 3} onPress={() => setFilter(3)} />
          </View>
        </ScrollView>

        {visibleReviews.length > 0 ? (
          <View style={styles.list}>
            {visibleReviews.map((review) => {
              const markedHelpful = helpfulReviewIds.includes(review.id);
              const helpfulCount = review.helpful + (markedHelpful ? 1 : 0);

              return (
                <View
                  key={review.id}
                  style={[
                    styles.reviewCard,
                    { backgroundColor: colors.surface, borderColor: colors.border },
                  ]}
                >
                  <View style={styles.reviewHeader}>
                    <View
                      style={[
                        styles.avatar,
                        { backgroundColor: resolvedMode === 'dark' ? '#0D0F11' : '#242629' },
                      ]}
                    >
                      <Text style={styles.avatarText}>{review.initials}</Text>
                    </View>
                    <View style={styles.customerInfo}>
                      <Text style={[styles.customerName, { color: colors.text }]}>{review.customer}</Text>
                      <Text style={[styles.reviewMeta, { color: colors.textMuted }]}>
                        {review.service} · {review.date}
                      </Text>
                    </View>
                    <Stars rating={review.rating} size={15} />
                  </View>

                  <Text style={[styles.comment, { color: colors.textSecondary }]}>
                    {review.comment}
                  </Text>

                  <Pressable
                    onPress={() => toggleHelpful(review.id)}
                    style={[styles.helpfulButton, markedHelpful && styles.helpfulButtonActive]}
                  >
                    <Text style={[styles.helpfulText, markedHelpful && styles.helpfulTextActive]}>
                      {markedHelpful ? 'Útil ✓' : 'Foi útil?'} · {helpfulCount}
                    </Text>
                  </Pressable>
                </View>
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Nenhuma avaliação com essa nota</Text>
            <Text style={styles.emptyDescription}>Escolha outro filtro para continuar.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function Stars({ rating, size }: { rating: number; size: number }) {
  return (
    <View style={styles.stars}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Text key={star} style={[styles.star, { fontSize: size }, star > rating && styles.starEmpty]}>
          ★
        </Text>
      ))}
    </View>
  );
}

function FilterButton({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.filterButton, active && styles.filterButtonActive]}>
      <Text style={[styles.filterButtonText, active && styles.filterButtonTextActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F2F3F5' },
  content: { paddingHorizontal: 20, paddingTop: 28, paddingBottom: 44 },
  eyebrow: { color: '#8A6818', fontSize: 11, fontWeight: '800', letterSpacing: 1.5 },
  title: {
    maxWidth: 570,
    marginTop: 12,
    color: '#242629',
    fontFamily: DISPLAY_FONT,
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 37,
  },
  description: { marginTop: 10, color: '#62666B', fontSize: 15, lineHeight: 22 },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    borderWidth: 1,
    borderColor: '#D9DADD',
    borderRadius: 18,
    backgroundColor: '#FAFAFA',
    padding: 18,
  },
  scoreColumn: { alignItems: 'center', width: 112 },
  score: { color: '#242629', fontFamily: DISPLAY_FONT, fontSize: 38, fontWeight: '900' },
  reviewCount: { marginTop: 7, color: '#62666B', fontSize: 11 },
  divider: { width: 1, height: 108, marginHorizontal: 16, backgroundColor: '#D9DADD' },
  distribution: { flex: 1, gap: 6 },
  distributionRow: { flexDirection: 'row', alignItems: 'center' },
  distributionLabel: { width: 10, color: '#62666B', fontSize: 11, textAlign: 'right' },
  smallStar: { marginLeft: 3, color: '#C49A3A', fontSize: 11 },
  progressTrack: {
    flex: 1,
    height: 6,
    overflow: 'hidden',
    marginHorizontal: 7,
    borderRadius: 3,
    backgroundColor: '#E7E8EA',
  },
  progressFill: { height: 6, borderRadius: 3, backgroundColor: '#C49A3A' },
  percentage: { width: 28, color: '#62666B', fontSize: 10, textAlign: 'right' },
  filterTitle: { marginTop: 30, color: '#3B3E42', fontSize: 13, fontWeight: '800' },
  filters: { flexDirection: 'row', gap: 9, marginTop: 11 },
  filterButton: {
    borderWidth: 1,
    borderColor: '#CED0D4',
    borderRadius: 20,
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 15,
    paddingVertical: 9,
  },
  filterButtonActive: { borderColor: '#C49A3A', backgroundColor: '#C49A3A' },
  filterButtonText: { color: '#62666B', fontSize: 12, fontWeight: '700' },
  filterButtonTextActive: { color: '#242629', fontWeight: '900' },
  list: { gap: 14, marginTop: 22 },
  reviewCard: {
    borderWidth: 1,
    borderColor: '#D9DADD',
    borderRadius: 18,
    backgroundColor: '#FAFAFA',
    padding: 18,
  },
  reviewHeader: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
    borderRadius: 21,
    backgroundColor: '#242629',
  },
  avatarText: { color: '#C49A3A', fontSize: 12, fontWeight: '900' },
  customerInfo: { flex: 1, paddingRight: 8 },
  customerName: { color: '#242629', fontSize: 14, fontWeight: '800' },
  reviewMeta: { marginTop: 4, color: '#8A8E93', fontSize: 10 },
  stars: { flexDirection: 'row' },
  star: { color: '#C49A3A', lineHeight: 22 },
  starEmpty: { color: '#CED0D4' },
  comment: { marginTop: 17, color: '#3B3E42', fontSize: 14, lineHeight: 21 },
  helpfulButton: {
    alignSelf: 'flex-start',
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#D9DADD',
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  helpfulButtonActive: { borderColor: '#C49A3A', backgroundColor: '#F3E8C8' },
  helpfulText: { color: '#62666B', fontSize: 11, fontWeight: '700' },
  helpfulTextActive: { color: '#8A6818' },
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
  emptyDescription: { marginTop: 8, color: '#62666B', fontSize: 13 },
});
