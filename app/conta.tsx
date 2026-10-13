import { StatusBar } from 'expo-status-bar';
import { ScrollView, Text, View } from 'react-native';

import { useAppTheme } from '@/contexts/theme-context';
import styles from '@/styles/biblioteca.styles';

export default function AccountScreen() {
  const { colors, resolvedMode } = useAppTheme();

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <StatusBar style={resolvedMode === 'dark' ? 'light' : 'dark'} />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Minha conta</Text>

        <Text style={[styles.description, { color: colors.textMuted }]}>
          Esta tela já está adaptada ao modelo da Biblioteca.
        </Text>

        <View style={[styles.itemCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.itemTitle, { color: colors.text }]}>Dados do usuário</Text>

          <Text style={[styles.itemInfo, { color: colors.textMuted }]}>
            A API possui nome e e-mail em Usuário.
          </Text>

          <Text style={[styles.itemInfo, { color: colors.textMuted }]}>
            Telefone, endereço e data de nascimento ficam em Perfil.
          </Text>
        </View>

        <Text style={[styles.description, { color: colors.textMuted }]}>
          Quando adicionarmos autenticação, esta tela buscará automaticamente o usuário logado e permitirá atualizar os dados.
        </Text>
      </ScrollView>
    </View>
  );
}
