import { StyleSheet, Text } from 'react-native';

import { useAppTheme } from '@/contexts/theme-context';

// Selo colorido de status. tone pode ser 'ok' (verde), 'warn' (cinza) ou 'danger' (vermelho).
// Arquivo em JavaScript (.jsx): componente pequeno, sem tipos.
export default function StatusBadge({ text, tone }) {
  const { colors } = useAppTheme();

  const palette = {
    ok: { backgroundColor: colors.successSoft, color: colors.success },
    warn: { backgroundColor: colors.neutralSoft, color: colors.textMuted },
    danger: { backgroundColor: colors.dangerSoft, color: colors.danger },
  }[tone];

  return <Text style={[styles.badge, palette]}>{text}</Text>;
}

const styles = StyleSheet.create({
  badge: {
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 'bold',
  },
});
