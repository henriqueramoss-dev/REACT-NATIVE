import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { useAppTheme } from '@/contexts/theme-context';
import { categorias as mockCategorias } from '@/data/biblioteca';
import { listarCategorias, type CategoriaApi } from '@/services/biblioteca-api';
import styles from '@/styles/biblioteca.styles';

export default function CategoriasScreen() {
  const { colors } = useAppTheme();
  const [categorias, setCategorias] = useState<CategoriaApi[]>([]);

  useEffect(() => {
    listarCategorias()
      .then(setCategorias)
      .catch(() => setCategorias(mockCategorias.map((item) => ({ id: Number(item.id), nome: item.nome }))));
  }, []);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Categorias</Text>
        <Text style={[styles.description, { color: colors.textMuted }]}>Categorias cadastradas na API.</Text>

        {categorias.map((categoria) => (
          <View key={categoria.id} style={[styles.itemCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.itemTitle, { color: colors.text }]}>{categoria.nome}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
