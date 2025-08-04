export const THEME = {
  brand: {
    name: '29CM',
    tagline: '감도 깊은 취향 셀렉트샵',
    description: '미니멀하고 세련된 패션/라이프스타일 플랫폼',
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
