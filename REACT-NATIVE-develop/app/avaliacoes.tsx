import { StatusBar } from 'expo-status-bar';
import { useAppTheme } from '@/contexts/theme-context';
import styles from '@/styles/avaliacoes.styles';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { distribution, reviews, type RatingFilter } from '@/data/reviews';

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
