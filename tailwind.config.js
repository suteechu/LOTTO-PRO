/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#0b0e11',
          800: '#1e2329',
          700: '#2b3139',
          600: '#38424d',
          500: '#474d57',
        },
        gold: {
          400: '#fbbf24',
          500: '#f0b90b', // Binance Gold
          600: '#d97706',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Roboto Mono', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
