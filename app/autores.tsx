import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { useAppTheme } from '@/contexts/theme-context';
import { autores as mockAutores } from '@/data/biblioteca';
import { listarAutores, type AutorApi } from '@/services/biblioteca-api';
import styles from '@/styles/biblioteca.styles';

export default function AutoresScreen() {
  const { colors } = useAppTheme();
  const [autores, setAutores] = useState<AutorApi[]>([]);

  useEffect(() => {
    listarAutores()
      .then(setAutores)
      .catch(() => setAutores(mockAutores.map((item) => ({ id: Number(item.id), nome: item.nome }))));
  }, []);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Autores</Text>
        <Text style={[styles.description, { color: colors.textMuted }]}>Autores cadastrados na API.</Text>

        {autores.map((autor) => (
          <View key={autor.id} style={[styles.itemCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.itemTitle, { color: colors.text }]}>{autor.nome}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
