import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        scout: {
          bg: '#F8F7F4',
          dark: '#0A0A0A',
          card: '#FFFFFF',
          border: '#E5E4E0',
          muted: '#6B6B6B',
          accent: '#1F4D44',
          'accent-ink': '#143630',
          'accent-soft': '#E8F0EE',
          blue: '#2563EB',
          red: '#EF4444',
          sale: '#B91C1C',
          'sale-soft': '#FBEAEA',
          green: '#16A34A',
          warn: '#A35A11',
          'warn-soft': '#F7EFE0',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        sm: '3px',
        DEFAULT: '4px',
        lg: '8px',
        xl: '10px',
        '2xl': '12px',
        '3xl': '16px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.1)',
        modal: '0 20px 60px rgba(0,0,0,0.15)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite linear',
        fadeIn: 'fadeIn 0.2s ease-out',
        slideUp: 'slideUp 0.2s ease-out',
      },
    },
  },
  plugins: [],
}

export default config
