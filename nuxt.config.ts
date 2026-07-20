// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: true },

  modules: ['@nuxt/ui', 'nuxt-auth-utils'],

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    // Overridden by NUXT_SESSION_PASSWORD env var
    session: {
      password: process.env.NUXT_SESSION_PASSWORD || 'dev-only-change-me-please-32chars-min!!',
      // The demo is served over plain HTTP via Docker, so the session cookie must
      // not require HTTPS. Set to `true` behind an HTTPS reverse proxy in production.
      cookie: {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
      },
    },
    // Overridden by NUXT_DATABASE_URL env var
    databaseUrl: process.env.DATABASE_URL || 'postgres://eco:eco@localhost:5432/ecotransport',
  },

  app: {
    head: {
      title: 'ÉcoTransport — La mobilité douce, ensemble',
      htmlAttrs: { lang: 'fr' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'Forum, covoiturage, revente de billets, marché de véhicules éco et bricolage : la communauté de la mobilité durable.',
        },
      ],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    },
  },

  ui: {
    theme: {
      colors: ['primary', 'secondary', 'success', 'info', 'warning', 'error', 'neutral'],
    },
  },
})
