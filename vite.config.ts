import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Using relative path so it works everywhere (GitHub Pages, local preview, etc.)
  server: {
    proxy: {
      '/api/thaiorc': {
        target: 'https://horoscope.thaiorc.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/thaiorc/, '/lotto/thai/stats/lottery-years10.php'),
      },
    },
  },
})
