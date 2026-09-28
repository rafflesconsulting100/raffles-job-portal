import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import rafflesPrerender from './vite-plugin-prerender.mjs'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // Build-time SEO prerender: static route shells, /jobs/<slug> pages,
    // sitemap.xml and 404.html (see vite-plugin-prerender.mjs).
    rafflesPrerender(),
  ],
})
