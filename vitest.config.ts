import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    css: false,
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}', 'tools/**/*.ts'],
      exclude: ['src/test/**', 'src/main.tsx', '**/*.d.ts'],
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: './coverage',
    },
  },
})
