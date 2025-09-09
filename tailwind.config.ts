import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        badge: {
          primary: '#0ea5e9',
          theme: '#22c55e',
          subtheme: '#f59e0b'
        }
      }
    }
  },
  plugins: []
} satisfies Config
