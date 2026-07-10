export const palette = {
  brandBlue: '#045795',
  brandCyan: '#07ABDE',
  brandLime: '#8ECE1D',
  brandSand: '#B7AB92',
  blueDark: '#033C68',
  blueSoft: '#E8F2F8',
  cyanSoft: '#E4F7FC',
  limeSoft: '#F0F8DF',
  sandSoft: '#F5F2ED',
  background: '#F4F7F9',
  surface: '#FFFFFF',
  textPrimary: '#102B3C',
  textSecondary: '#667C89',
  border: '#DCE5EA',
  error: '#D64B5A',
} as const;

/** Semantic aliases keep the existing screens free of raw color values. */
export const colors = {
  ...palette,
  primaryNavy: palette.brandBlue,
  secondaryNavy: palette.blueDark,
  royalBlue: palette.brandBlue,
  cyan: palette.brandCyan,
  green: palette.brandLime,
  textMuted: palette.textSecondary,
  muted: palette.blueSoft,
  danger: palette.error,
  success: palette.brandLime,
  overlay: 'rgba(3, 60, 104, 0.42)',
} as const;

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, '2xl': 32, '3xl': 40 } as const;
export const radius = { sm: 10, md: 16, lg: 24, xl: 32, pill: 999 } as const;
export const fontSize = { xs: 12, sm: 14, md: 16, lg: 20, xl: 28, '2xl': 34 } as const;
