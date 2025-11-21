import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Change this to '/<REPO_NAME>/' if deploying to a custom path on GitHub Pages
})
