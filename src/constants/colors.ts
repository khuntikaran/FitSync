export const Colors = {
  primary: '#FF6B35',
  primaryDark: '#E55A2B',
  primaryLight: '#FF8F6B',

  secondary: '#004E89',
  secondaryDark: '#003A66',
  secondaryLight: '#337BB3',

  categories: {
    push: '#E91E63',
    pull: '#673AB7',
    legs: '#2196F3',
    chest: '#F44336',
    back: '#4CAF50',
    arms: '#FFC107',
    shoulders: '#9C27B0',
    core: '#FF9800',
    cardio: '#00BCD4',
    upper: '#795548',
    lower: '#607D8B',
    full_body: '#3F51B5',
  },

  success: '#4CAF50',
  warning: '#FFC107',
  error: '#F44336',
  info: '#2196F3',

  background: '#121212',
  surface: '#1E1E1E',
  surfaceVariant: '#2C2C2C',
  border: '#3D3D3D',

  text: '#FFFFFF',
  textSecondary: '#B0B0B0',
  textTertiary: '#757575',

  light: {
    background: '#F5F5F5',
    surface: '#FFFFFF',
    surfaceVariant: '#EEEEEE',
    border: '#E0E0E0',
    text: '#212121',
    textSecondary: '#757575',
    textTertiary: '#9E9E9E',
  },
};

export const Typography = {
  h1: { fontSize: 32, fontWeight: '700', lineHeight: 40 },
  h2: { fontSize: 28, fontWeight: '700', lineHeight: 36 },
  h3: { fontSize: 24, fontWeight: '600', lineHeight: 32 },
  h4: { fontSize: 20, fontWeight: '600', lineHeight: 28 },
  body1: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
  body2: { fontSize: 14, fontWeight: '400', lineHeight: 20 },
  caption: { fontSize: 12, fontWeight: '400', lineHeight: 16 },
  button: { fontSize: 16, fontWeight: '600', letterSpacing: 0.5 },
  label: { fontSize: 12, fontWeight: '500', letterSpacing: 0.5 },
} as const;
