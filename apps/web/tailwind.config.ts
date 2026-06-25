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
        surface: {
          DEFAULT: 'hsl(var(--color-surface))',
          elevated: 'hsl(var(--color-surface-elevated))',
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
        display: ['2rem', { lineHeight: '1.2', fontWeight: '600' }],
        'page-title': ['1.75rem', { lineHeight: '1.25', fontWeight: '600' }],
        'section-title': ['1.375rem', { lineHeight: '1.3', fontWeight: '600' }],
        'card-title': ['1.125rem', { lineHeight: '1.35', fontWeight: '600' }],
        heading: ['1.0625rem', { lineHeight: '1.4', fontWeight: '600' }],
        subheading: ['0.9375rem', { lineHeight: '1.45', fontWeight: '500' }],
        'body-lg': ['1.0625rem', { lineHeight: '1.5', fontWeight: '400' }],
        body: ['1rem', { lineHeight: '1.5', fontWeight: '400' }],
        caption: ['0.8125rem', { lineHeight: '1.45', fontWeight: '400' }],
        micro: ['0.6875rem', { lineHeight: '1.4', fontWeight: '500' }],
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
      },
      fontFamily: {
        sans: [
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
        mono: ['ui-monospace', '"Cascadia Code"', '"SF Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
