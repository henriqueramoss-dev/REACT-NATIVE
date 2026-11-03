import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';

import { lerValor, gravarValor } from '../utils/armazenamento';

const CHAVE_TEMA = 'biblioteca:tema';

export type ThemeMode = 'light' | 'dark' | 'system';

// Paleta de biblioteca (a mesma do site, biblioteca-web/src/styles.css): papel, couro, madeira e ouro velho.
export const lightColors = {
  background: '#F4ECDD',
  surface: '#FFFBF2',
  surfaceMuted: '#F8F0E0',
  text: '#2B1D14',
  textSecondary: '#2B1D14',
  textMuted: '#6A5444',
  placeholder: '#7B6756',
  border: '#DCCDAE',
  borderStrong: '#C9B78F',
  primary: '#7A2E2E',
  primarySoft: '#F1DFD2',
  onPrimary: '#FFF8EA',
  header: '#3B2417',
  headerText: '#F6EBD3',
  gold: '#B7862B',
  success: '#3D6B3A',
  successSoft: '#E1EBD6',
  danger: '#A33A2C',
  dangerSoft: '#F7DFD8',
  neutralSoft: '#EADFC8',
  overlay: 'rgba(43, 29, 20, 0.55)',
};

export const darkColors = {
  background: '#1B1410',
  surface: '#261C16',
  surfaceMuted: '#2D2119',
  text: '#F1E6D2',
  textSecondary: '#F1E6D2',
  textMuted: '#C2AC92',
  placeholder: '#A38E77',
  border: '#45362B',
  borderStrong: '#5A4838',
  primary: '#E0A25C',
  primarySoft: '#3A2A1B',
  onPrimary: '#1B1410',
  header: '#120C09',
  headerText: '#F6EBD3',
  gold: '#D9AE5B',
  success: '#8FCB86',
  successSoft: '#223020',
  danger: '#F0988A',
  dangerSoft: '#41231F',
  neutralSoft: '#33271E',
  overlay: 'rgba(0, 0, 0, 0.7)',
};

export type ThemeColors = typeof lightColors;

type ThemeContextValue = {
  mode: ThemeMode;
  resolvedMode: 'light' | 'dark';
  colors: ThemeColors;
  setMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>('system');

  // Recupera a escolha salva no aparelho (se houver) ao abrir o app.
  useEffect(() => {
    lerValor(CHAVE_TEMA).then((salvo) => {
      if (salvo === 'light' || salvo === 'dark' || salvo === 'system') setModeState(salvo);
    });
  }, []);

  // Troca o tema e guarda a escolha no aparelho.
  const setMode = useCallback((novo: ThemeMode) => {
    setModeState(novo);
    gravarValor(CHAVE_TEMA, novo);
  }, []);
  const resolvedMode = mode === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : mode;
  const colors = resolvedMode === 'dark' ? darkColors : lightColors;

  const value = useMemo(
    () => ({ mode, resolvedMode, colors, setMode }),
    [colors, mode, resolvedMode, setMode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useAppTheme precisa ser usado dentro de AppThemeProvider.');
  }

  return context;
}
