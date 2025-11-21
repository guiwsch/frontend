const theme = {
  colors: {
    // Cores principais - Preto e Dourado
    primary: '#0a0a0a',          // Preto profundo
    primaryLight: '#1a1a1a',     // Preto mais claro
    primaryDark: '#000000',      // Preto absoluto
    secondary: '#d4af37',        // Dourado principal
    secondaryLight: '#f4d03f',   // Dourado claro
    secondaryDark: '#b8941e',    // Dourado escuro
    accent: '#c9a961',           // Dourado accent
    accentHover: '#d4af37',      // Dourado hover

    // Cores neutras
    white: '#ffffff',
    background: '#0a0a0a',       // Fundo preto
    backgroundLight: '#1a1a1a',  // Fundo preto claro
    backgroundCard: '#141414',   // Fundo de cards
    lightGray: '#2a2a2a',        // Cinza escuro
    gray: '#4a4a4a',             // Cinza médio
    darkGray: '#6a6a6a',         // Cinza claro
    text: '#ffffff',             // Texto branco
    textLight: '#b8b8b8',        // Texto claro
    textMuted: '#888888',        // Texto discreto
    border: '#2a2a2a',           // Borda escura
    borderLight: '#3a3a3a',      // Borda mais clara

    // Estados
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',

    // Overlay
    overlay: 'rgba(0, 0, 0, 0.85)',
    overlayLight: 'rgba(0, 0, 0, 0.6)',
  },

  fonts: {
    primary: "'Inter', sans-serif",
    heading: "'Poppins', sans-serif",
  },

  fontSizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    md: '1rem',       // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem',// 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
    '6xl': '3.75rem', // 60px
  },

  spacing: {
    xs: '0.25rem',  // 4px
    sm: '0.5rem',   // 8px
    md: '1rem',     // 16px
    lg: '1.5rem',   // 24px
    xl: '2rem',     // 32px
    '2xl': '3rem',  // 48px
    '3xl': '4rem',  // 64px
    '4xl': '6rem',  // 96px
  },

  breakpoints: {
    xs: '480px',
    sm: '768px',
    md: '1024px',
    lg: '1280px',
    xl: '1536px',
  },

  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  },

  borderRadius: {
    sm: '0.125rem',  // 2px
    md: '0.375rem',  // 6px
    lg: '0.5rem',    // 8px
    xl: '0.75rem',   // 12px
    '2xl': '1rem',   // 16px
    full: '9999px',
  },

  transitions: {
    fast: '150ms ease-in-out',
    normal: '300ms ease-in-out',
    slow: '500ms ease-in-out',
  },

  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },
};

export default theme;
