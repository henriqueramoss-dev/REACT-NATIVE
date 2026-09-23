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
        <Stack.Screen name="login" options={{ title: '' }} />
        <Stack.Screen name="cadastro" options={{ title: '' }} />
        <Stack.Screen name="painel" options={{ title: '' }} />
        <Stack.Screen name="novo-agendamento" options={{ title: 'Novo agendamento' }} />
        <Stack.Screen name="meus-horarios" options={{ title: 'Meus horários' }} />
        <Stack.Screen name="servicos-planos" options={{ title: 'Serviços e planos' }} />
        <Stack.Screen name="avaliacoes" options={{ title: 'Avaliações' }} />
        <Stack.Screen name="conta" options={{ title: 'Minha conta' }} />
        <Stack.Screen
          name="recuperar-senha"
          options={{ title: 'Recuperar senha' }}
        />
        <Stack.Screen name="nova-senha" options={{ title: 'Nova senha' }} />
        <Stack.Screen
          name="agenda-barbeiro"
          options={{ title: 'Agenda e horários' }}
        />
        <Stack.Screen name="servicos-barbeiro" options={{ title: 'Serviços' }} />
        <Stack.Screen name="produtos" options={{ title: 'Produtos' }} />
        <Stack.Screen name="planos-barbeiro" options={{ title: 'Planos' }} />
        <Stack.Screen name="funcionarios" options={{ title: 'Funcionários' }} />
        <Stack.Screen name="clientes" options={{ title: 'Clientes' }} />
        <Stack.Screen name="financeiro" options={{ title: 'Financeiro' }} />
        <Stack.Screen name="relatorios" options={{ title: 'Relatórios' }} />
        <Stack.Screen name="notificacoes" options={{ title: 'Notificações' }} />
      </Stack>
    </>
  );
}
