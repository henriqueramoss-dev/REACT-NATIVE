import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { useAppTheme } from '@/contexts/theme-context';
import { livros as mockLivros } from '@/data/biblioteca';
import { listarLivros, type LivroApi } from '@/services/biblioteca-api';
import styles from '@/styles/biblioteca.styles';

export default function LivrosScreen() {
  const { colors } = useAppTheme();
  const [search, setSearch] = useState('');
  const [livros, setLivros] = useState<LivroApi[]>([]);

  useEffect(() => {
    loadBooks();
  }, []);

  async function loadBooks() {
    try {
      const data = await listarLivros();
      setLivros(data);
    } catch {
      setLivros(
        mockLivros.map((livro) => ({
          id: Number(livro.id),
          titulo: livro.titulo,
          isbn: livro.isbn,
          anoPublicacao: livro.ano,
          categoria: { id: 0, nome: livro.categoria },
          autores: [{ id: 0, nome: livro.autor }],
        })),
      );
    }
  }

  const filteredBooks = livros.filter((livro) => {
    const autores = livro.autores.map((autor) => autor.nome).join(' ');
    const term = search.toLowerCase();

    return livro.titulo.toLowerCase().includes(term) || autores.toLowerCase().includes(term);
  });

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Livros</Text>
        <Text style={[styles.description, { color: colors.textMuted }]}>
          Dados reais da API quando ela estiver disponível.
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
            onPress={() => router.push({ pathname: '/livro-detalhes', params: { id: String(livro.id) } })}
          >
            <Text style={[styles.itemTitle, { color: colors.text }]}>{livro.titulo}</Text>
            <Text style={[styles.itemInfo, { color: colors.textMuted }]}>
              {livro.autores.map((autor) => autor.nome).join(', ') || 'Autor não informado'}
            </Text>
            <Text style={[styles.itemInfo, { color: colors.textMuted }]}>
              {livro.categoria?.nome || 'Sem categoria'}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
