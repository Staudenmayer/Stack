// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  devtools: {
    enabled: true,
    timeline: {
      enabled: true,
    },
  },
  routeRules: {
    '/': {ssr: false},
  },
  app:{
    head: {
      title: 'Dashboard',
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1.0',
      link: [
        {
          rel: 'icon',
          href: '/favicon.svg',
          type: 'image/svg'
        }
      ]
    }
  },
  build: {
    transpile: ['vuetify'],
  },
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
    '@vite-pwa/nuxt',
    '@pinia/nuxt'
  ],
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:4343',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        }
      }
    }
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  css: ['~/assets/css/main.css'],
  pwa: {
    registerType: 'autoUpdate',
    manifest:{
      name: "Stack",
      short_name: "Stack",
      start_url: '/login',
      // gona look like an app
      display: "standalone",
      //  background of the splashscreen when we load the app
      background_color: "#FFE9D2",
      // colorize the bar at the top of the app
      theme_color: "#FFE1C4",
      
      // icon of the app, depending the device its going to use a different size of icon
      icons:[
        {
          src: 'pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable',
        },
      ],
    },
    workbox: {
      globPatterns: ['_nuxt/builds/**/*.json']
    },
    devOptions: {
      enabled: true,
      type: "module"
    }
  }
})
