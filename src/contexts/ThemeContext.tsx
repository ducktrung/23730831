import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import {
  COLORS,
  DARK_COLORS,
  ThemeColors,
} from '@constants/theme';

type ThemeContextValue = {
  isDark: boolean;
  colors: ThemeColors;
  toggleTheme: () => void;
};

const ThemeContext =
  createContext<ThemeContextValue | undefined>(
    undefined,
  );

type Props = {
  children: ReactNode;
};

export function ThemeProvider({
  children,
}: Props) {
  const [isDark, setIsDark] =
    useState(false);

  const toggleTheme =
    useCallback(() => {
      setIsDark(current => !current);
    }, []);

  const colors =
    isDark ? DARK_COLORS : COLORS;

  const value = useMemo(
    () => ({
      isDark,
      colors,
      toggleTheme,
    }),
    [isDark, colors, toggleTheme],
  );

  return (
    <ThemeContext.Provider
      value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context =
    useContext(ThemeContext);

  if (!context) {
    throw new Error(
      'useTheme must be used inside ThemeProvider',
    );
  }

  return context;
}