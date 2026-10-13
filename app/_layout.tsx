import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppThemeProvider, useAppTheme } from '@/contexts/theme-context';

export default function RootLayout() {
  return (
    <AppThemeProvider>
      <AppNavigator />
    </AppThemeProvider>
  );
}

function AppNavigator() {
  const { colors, resolvedMode } = useAppTheme();

  return (
    <>
      <StatusBar style={resolvedMode === 'dark' ? 'light' : 'dark'} />

      <Stack
        screenOptions={{
          headerShadowVisible: false,
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ title: 'Entrar' }} />
        <Stack.Screen name="cadastro" options={{ title: 'Cadastro' }} />
        <Stack.Screen name="painel" options={{ title: '' }} />
        <Stack.Screen name="livros" options={{ title: 'Livros' }} />
        <Stack.Screen name="livro-detalhes" options={{ title: 'Detalhes do livro' }} />
        <Stack.Screen name="emprestimos" options={{ title: 'Empréstimos' }} />
        <Stack.Screen name="autores" options={{ title: 'Autores' }} />
        <Stack.Screen name="categorias" options={{ title: 'Categorias' }} />
        <Stack.Screen name="conta" options={{ title: 'Minha conta' }} />
        <Stack.Screen name="recuperar-senha" options={{ title: 'Recuperar senha' }} />
        <Stack.Screen name="nova-senha" options={{ title: 'Nova senha' }} />
      </Stack>
    </>
  );
}
