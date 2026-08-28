export type ThemeColors = {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textLight: string;
  border: string;
  error: string;
  success: string;
};

export const COLORS: ThemeColors = {
  primary: '#0F766E',
  secondary: '#F59E0B',
  background: '#F0FDFA',
  surface: '#FFFFFF',
  text: '#134E4A',
  textLight: '#5F7A77',
  border: '#CCFBF1',
  error: '#DC2626',
  success: '#16A34A',
};

export const DARK_COLORS: ThemeColors = {
  primary: '#0F766E',
  secondary: '#F59E0B',
  background: '#042F2E',
  surface: '#0B4F4A',
  text: '#F0FDFA',
  textLight: '#CCFBF1',
  border: '#0F766E',
  error: '#DC2626',
  success: '#16A34A',
};

export const SIZES = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,

  radiusSm: 8,
  radiusMd: 12,
  radiusLg: 16,
} as const;

export const FONTS = {
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
  },

  subtitle: {
    fontSize: 16,
    fontWeight: '600' as const,
  },

  body: {
    fontSize: 14,
    fontWeight: '400' as const,
  },

  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
  },

  button: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
} as const;