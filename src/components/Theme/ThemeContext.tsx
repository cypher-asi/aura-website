import { createContext } from 'react';

export type Theme = 'dark' | 'light' | 'system';
export type ResolvedTheme = 'dark' | 'light';
export type AccentColor = 'cyan' | 'blue' | 'purple' | 'green' | 'orange' | 'rose';

export const ACCENT_COLORS: AccentColor[] = ['cyan', 'blue', 'purple', 'green', 'orange', 'rose'];
export const THEMES: Theme[] = ['dark', 'light', 'system'];

export interface ThemeContextValue {
  theme: Theme;
  accent: AccentColor;
  resolvedTheme: ResolvedTheme;
  systemTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  setAccent: (accent: AccentColor) => void;
}

const defaultContextValue: ThemeContextValue = {
  theme: 'dark',
  accent: 'cyan',
  resolvedTheme: 'dark',
  systemTheme: 'dark',
  setTheme: () => {
    console.warn('ThemeProvider not found. Wrap your app in <ThemeProvider>.');
  },
  setAccent: () => {
    console.warn('ThemeProvider not found. Wrap your app in <ThemeProvider>.');
  },
};

export const ThemeContext = createContext<ThemeContextValue>(defaultContextValue);
