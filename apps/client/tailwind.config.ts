import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary fintech blue
        primary: '#0A84FF',
        secondary: '#1E88FF',
        accent: '#00D9FF',
        
        // Dark backgrounds
        dark: '#020617',
        'dark-50': '#0F1729',
        'dark-100': '#1A2847',
        
        // Glass effect
        glass: 'rgba(255,255,255,0.05)',
        'glass-light': 'rgba(255,255,255,0.08)',
        'glass-lighter': 'rgba(255,255,255,0.12)',
        
        // Status colors
        success: '#12D18E',
        danger: '#FF3B3B',
        warning: '#FFB800',
        info: '#0A84FF',
      },
      boxShadow: {
        soft: '0 8px 30px rgba(0,0,0,0.25)',
        glow: '0 0 20px rgba(10, 132, 255, 0.3)',
        'glass': 'inset 0 1px 1px rgba(255,255,255,0.1), 0 8px 32px rgba(0,0,0,0.3)',
      },
      backdropBlur: {
        glass: '12px',
      },
      animation: {
        fadeInUp: 'fadeInUp 0.6s ease-out',
        slideDown: 'slideDown 0.4s ease-out',
      },
      keyframes: {
        fadeInUp: {
          from: {
            opacity: '0',
            transform: 'translateY(10px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        slideDown: {
          from: {
            opacity: '0',
            transform: 'translateY(-10px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
      fontSize: {
        xs: ['12px', { lineHeight: '16px' }],
        sm: ['14px', { lineHeight: '20px' }],
        base: ['16px', { lineHeight: '24px' }],
        lg: ['18px', { lineHeight: '28px' }],
        xl: ['20px', { lineHeight: '28px' }],
        '2xl': ['24px', { lineHeight: '32px' }],
        '3xl': ['30px', { lineHeight: '36px' }],
        '4xl': ['36px', { lineHeight: '44px' }],
      },
      letterSpacing: {
        tight: '-0.02em',
        normal: '0',
        wide: '0.02em',
      },
    },
  },
  plugins: [],
}

export default config
