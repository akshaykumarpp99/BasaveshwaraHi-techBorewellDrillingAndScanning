import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { cities } from './src/data/cities'
import { services } from './src/data/services'
import { seoFiles } from './tools/seoFiles'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', 'VITE_')
  const siteUrl = (env.VITE_SITE_URL || 'https://www.example.com').replace(/\/$/, '')
  return {
    plugins: [
      react(),
      seoFiles({
        siteUrl,
        servicePaths: services.map((s) => `/services/${s.slug}`),
        cityPaths: cities.map((c) => `/borewell-drilling-in/${c.slug}`),
      }),
    ],
    build: { chunkSizeWarningLimit: 700 },
  }
})
