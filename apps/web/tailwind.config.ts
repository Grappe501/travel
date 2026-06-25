import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'hsl(var(--color-primary))',
          hover: 'hsl(var(--color-primary-hover))',
          active: 'hsl(var(--color-primary-active))',
          foreground: 'hsl(var(--color-primary-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--color-accent))',
          foreground: 'hsl(var(--color-accent-foreground))',
        },
        success: {
          DEFAULT: 'hsl(var(--color-success))',
          foreground: 'hsl(var(--color-success-foreground))',
        },
        warning: {
          DEFAULT: 'hsl(var(--color-warning))',
          foreground: 'hsl(var(--color-warning-foreground))',
        },
        danger: {
          DEFAULT: 'hsl(var(--color-danger))',
          foreground: 'hsl(var(--color-danger-foreground))',
        },
        info: {
          DEFAULT: 'hsl(var(--color-info))',
          foreground: 'hsl(var(--color-info-foreground))',
        },
        background: 'hsl(var(--color-background))',
        'background-subtle': 'hsl(var(--color-background-subtle))',
        surface: {
          DEFAULT: 'hsl(var(--color-surface))',
          elevated: 'hsl(var(--color-surface-elevated))',
          muted: 'hsl(var(--color-surface-muted))',
        },
        border: 'hsl(var(--color-border))',
        foreground: 'hsl(var(--color-text-primary))',
        muted: {
          DEFAULT: 'hsl(var(--color-text-muted))',
          foreground: 'hsl(var(--color-text-muted))',
        },
        selected: 'hsl(var(--color-selected))',
        hover: 'hsl(var(--color-hover))',
        disabled: 'hsl(var(--color-text-disabled))',
      },
      fontSize: {
        display: ['2.25rem', { lineHeight: '1.15', fontWeight: '700', letterSpacing: '-0.02em' }],
        'page-title': ['1.875rem', { lineHeight: '1.2', fontWeight: '700', letterSpacing: '-0.02em' }],
        'section-title': ['1.375rem', { lineHeight: '1.3', fontWeight: '600', letterSpacing: '-0.01em' }],
        'card-title': ['1.125rem', { lineHeight: '1.35', fontWeight: '600' }],
        heading: ['1.0625rem', { lineHeight: '1.4', fontWeight: '600' }],
        subheading: ['0.9375rem', { lineHeight: '1.45', fontWeight: '500' }],
        'body-lg': ['1.0625rem', { lineHeight: '1.55', fontWeight: '400' }],
        body: ['1rem', { lineHeight: '1.55', fontWeight: '400' }],
        caption: ['0.8125rem', { lineHeight: '1.45', fontWeight: '400' }],
        micro: ['0.6875rem', { lineHeight: '1.4', fontWeight: '600', letterSpacing: '0.02em' }],
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        primary: 'var(--shadow-primary)',
        glow: 'var(--shadow-glow)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', '"Cascadia Code"', '"SF Mono"', 'monospace'],
      },
      animation: {
        'fade-in': 'fade-in 0.25s ease-out',
        'slide-up': 'slide-up 0.35s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.97)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
