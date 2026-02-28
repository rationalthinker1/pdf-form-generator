import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// VITE_ENTRY is set by the CLI when generating PDFs.
// Falls back to the chp-contract example for normal `vite` / `bun dev` runs.
const entry = process.env.VITE_ENTRY ?? '/src/main.tsx'
process.env.VITE_ENTRY = entry

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: entry,
    },
  },
})
