import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { useAppTheme } from '@/contexts/theme-context';
import { livros } from '@/data/biblioteca';
import styles from '@/styles/biblioteca.styles';

export default function LivrosScreen() {
  const { colors } = useAppTheme();
  const [search, setSearch] = useState('');

  const filteredBooks = livros.filter((livro) =>
    livro.titulo.toLowerCase().includes(search.toLowerCase()) ||
    livro.autor.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Livros</Text>
        <Text style={[styles.description, { color: colors.textMuted }]}>
          Pesquise no acervo da biblioteca.
        </Text>

        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Pesquisar por título ou autor"
          placeholderTextColor="#999"
          style={styles.searchInput}
        />

        {filteredBooks.map((livro) => (
          <Pressable
            key={livro.id}
            style={[styles.itemCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() =>
              router.push({
                pathname: '/livro-detalhes',
                params: { id: livro.id },
              })
            }
          >
            <Text style={[styles.itemTitle, { color: colors.text }]}>{livro.titulo}</Text>
            <Text style={[styles.itemInfo, { color: colors.textMuted }]}>{livro.autor}</Text>
            <Text style={[styles.itemInfo, { color: colors.textMuted }]}>{livro.categoria}</Text>

            <Text
              style={[
                styles.status,
                { color: livro.disponivel ? '#2E7D32' : '#B3261E' },
              ]}
            >
              {livro.disponivel ? 'Disponível' : 'Emprestado'}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
