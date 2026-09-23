import { createContext, useContext, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';

export type ThemeMode = 'light' | 'dark' | 'system';

export const lightColors = {
  background: '#F2F3F5',
  surface: '#FAFAFA',
  surfaceMuted: '#E7E8EA',
  text: '#242629',
  textSecondary: '#3B3E42',
  textMuted: '#62666B',
  placeholder: '#8A8E93',
  border: '#D9DADD',
  borderStrong: '#CED0D4',
  gold: '#C49A3A',
  goldText: '#8A6818',
  overlay: 'rgba(20, 22, 24, 0.62)',
};

export const darkColors = {
  background: '#17191C',
  surface: '#23262A',
  surfaceMuted: '#30343A',
  text: '#F1F2F3',
  textSecondary: '#D8DADD',
  textMuted: '#ADB1B6',
  placeholder: '#858A91',
  border: '#393D43',
  borderStrong: '#4A4F56',
  gold: '#D0A84B',
  goldText: '#E0BE6A',
  overlay: 'rgba(0, 0, 0, 0.76)',
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
