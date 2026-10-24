import fs from 'node:fs'
import path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

function resolveAppVersion(): string {
  if (process.env.VITE_APP_VERSION) {
    return process.env.VITE_APP_VERSION
  }
  try {
    const versionFile = fs.readFileSync(path.resolve(import.meta.dirname, '../.version'), 'utf-8')
    const match = versionFile.match(/^VERSION=(.+)$/m)
    if (match?.[1]) {
      return `${match[1].trim()}.1`
    }
  } catch {
    // Fallback if .version cannot be read
  }
  return '1.0.1'
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_APP_VERSION': JSON.stringify(resolveAppVersion()),
  },
  server: {
    proxy: { '/api': 'http://localhost:3001' },
  },
})
