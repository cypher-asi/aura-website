'use client';

import { useState, useEffect, useCallback, useMemo, type ReactNode } from 'react';
import {
  ThemeContext,
  type Theme,
  type AccentColor,
  type ResolvedTheme,
  type ThemeContextValue,
} from './ThemeContext';
import { useSystemTheme } from './useSystemTheme';

interface StoredTheme {
  theme: Theme;
  accent: AccentColor;
}

const DEFAULT_STORAGE_KEY = 'aura-theme';

function getStoredTheme(storageKey: string): StoredTheme | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      const parsed = JSON.parse(stored) as StoredTheme;
      if (
        (parsed.theme === 'dark' || parsed.theme === 'light' || parsed.theme === 'system') &&
        ['cyan', 'blue', 'purple', 'green', 'orange', 'rose'].includes(parsed.accent)
      ) {
        return parsed;
      }
    }
  } catch {
    // localStorage might not be available or JSON might be invalid
  }

  return null;
}

function saveTheme(storageKey: string, theme: Theme, accent: AccentColor): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(storageKey, JSON.stringify({ theme, accent }));
  } catch {
    // localStorage might not be available
  }
}

function applyThemeToDocument(resolvedTheme: ResolvedTheme, accent: AccentColor): void {
  if (typeof document === 'undefined') {
    return;
  }

  const root = document.documentElement;
  root.setAttribute('data-theme', resolvedTheme);
  root.setAttribute('data-accent', accent);
}

export interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  defaultAccent?: AccentColor;
  storageKey?: string;
  forcedTheme?: ResolvedTheme;
}

export function ThemeProvider({
  children,
  defaultTheme = 'dark',
  defaultAccent = 'cyan',
  storageKey = DEFAULT_STORAGE_KEY,
  forcedTheme,
}: ThemeProviderProps) {
  const systemTheme = useSystemTheme();

  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = getStoredTheme(storageKey);
    return stored?.theme ?? defaultTheme;
  });

  const [accent, setAccentState] = useState<AccentColor>(() => {
    const stored = getStoredTheme(storageKey);
    return stored?.accent ?? defaultAccent;
  });

  const resolvedTheme: ResolvedTheme = useMemo(() => {
    if (forcedTheme) {
      return forcedTheme;
    }
    if (theme === 'system') {
      return systemTheme;
    }
    return theme;
  }, [theme, systemTheme, forcedTheme]);

  useEffect(() => {
    applyThemeToDocument(resolvedTheme, accent);
  }, [resolvedTheme, accent]);

  const setTheme = useCallback(
    (newTheme: Theme) => {
      setThemeState(newTheme);
      saveTheme(storageKey, newTheme, accent);
    },
    [storageKey, accent]
  );

  const setAccent = useCallback(
    (newAccent: AccentColor) => {
      setAccentState(newAccent);
      saveTheme(storageKey, theme, newAccent);
    },
    [storageKey, theme]
  );

  const contextValue: ThemeContextValue = useMemo(
    () => ({
      theme,
      accent,
      resolvedTheme,
      systemTheme,
      setTheme,
      setAccent,
    }),
    [theme, accent, resolvedTheme, systemTheme, setTheme, setAccent]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}
