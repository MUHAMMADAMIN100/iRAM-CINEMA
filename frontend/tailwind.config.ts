import type { Config } from 'tailwindcss'
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cinema: {
          red: '#C0392B',
          dark: '#0A0A0F',
          card: '#13131A',
          border: '#1E1E2E',
          gold: '#F0A500',
        }
      },
      fontFamily: { sans: ['Inter', 'sans-serif'] }
    }
  },
  plugins: []
} satisfies Config
