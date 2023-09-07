import UnheadVite from '@unhead/addons/vite'
import { alias } from './alias'
import { isDevelopment } from 'std-env'

//nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  sourcemap: isDevelopment,
  modules: [
    ['@pinia/nuxt', { autoImports: ['defineStore', 'storeToRefs'] }],
  ],
  alias: alias,
  devtools: { enabled: true },
  imports: {
    dirs: ['./stores'],
  },
  vite: {
    define: {
      'import.meta.vitest': 'undefined',
      fsevents: 'undefined',
    },
    plugins: [UnheadVite()],
    optimizeDeps: {
      exclude: ['fsevents'],
    },
  },
})
