export const THEME = {
  brand: {
    name: '골 때리는 그녀들',
    tagline: '데이터센터',
    description: '데이터센터',
  },

  colors: {
    primary: '#000000',
    secondary: '#FFFFFF',
    accent: {
      red: '#FF0000',
    },
    neutral: {
      lightGray: '#F5F5F5',
      mediumGray: '#999999',
      darkGray: '#333333',
    },
  },

  typography: {
    fontFamily: 'system-ui, -apple-system, sans-serif',
    heading: {
      fontWeight: '700',
      sizes: {
        large: '24px',
        medium: '18px',
        small: '16px',
      },
    },
    body: {
      fontWeight: '400',
      fontSize: '14px',
      lineHeight: '1.5',
    },
    caption: {
      fontWeight: '400',
      fontSize: '12px',
      color: '#999999',
    },
  },

  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },

  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '12px',
  },

  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px',
    largeDesktop: '1200px',
  },
} as const;

export type ThemeColors = typeof THEME.colors;
export type ThemeTypography = typeof THEME.typography;
