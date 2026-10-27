import { createContext, useContext, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';

export type ThemeMode = 'light' | 'dark' | 'system';

// Mesma paleta do site (biblioteca-web/src/styles.css).
export const lightColors = {
  background: '#F6F4EF',
  surface: '#FFFFFF',
  surfaceMuted: '#FAF8F4',
  text: '#1F2430',
  textSecondary: '#1F2430',
  textMuted: '#6B6F7B',
  placeholder: '#8A8E99',
  border: '#E6E1D6',
  borderStrong: '#DAD4C7',
  primary: '#1F4E79',
  primarySoft: '#E7EEF6',
  onPrimary: '#FFFFFF',
  header: '#17324D',
  headerText: '#FFFFFF',
  success: '#2F7D4F',
  successSoft: '#E3F3E9',
  danger: '#B4372F',
  dangerSoft: '#FBE7E5',
  neutralSoft: '#EEEEEF',
  overlay: 'rgba(20, 30, 50, 0.55)',
};

export const darkColors = {
  background: '#12161D',
  surface: '#1A2029',
  surfaceMuted: '#1F2631',
  text: '#E6E9EE',
  textSecondary: '#E6E9EE',
  textMuted: '#9AA3B0',
  placeholder: '#7D8694',
  border: '#2C3542',
  borderStrong: '#3A4452',
  primary: '#6FA8DC',
  primarySoft: '#1E3247',
  onPrimary: '#0E1420',
  header: '#0E1420',
  headerText: '#FFFFFF',
  success: '#6CC890',
  successSoft: '#1B3226',
  danger: '#EF8A82',
  dangerSoft: '#3A2220',
  neutralSoft: '#272D36',
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
  const [mode, setMode] = useState<ThemeMode>('system');
  const resolvedMode = mode === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : mode;
  const colors = resolvedMode === 'dark' ? darkColors : lightColors;

  const value = useMemo(
    () => ({ mode, resolvedMode, colors, setMode }),
    [colors, mode, resolvedMode],
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
