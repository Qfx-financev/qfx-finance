import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0A84FF',
        dark: '#020617',
        glass: 'rgba(255,255,255,0.05)',
        success: '#12D18E',
      },
      boxShadow: {
        soft: '0 8px 30px rgba(0,0,0,0.25)',
      },
    },
  },
  plugins: [],
}

export default config
