// medusa-config.ts
import { loadEnv, Modules, defineConfig } from '@medusajs/utils'
import {
  ADMIN_CORS,
  AUTH_CORS,
  BACKEND_URL,
  COOKIE_SECRET,
  DATABASE_URL,
  JWT_SECRET,
  PORT,
  REDIS_URL,
  RESEND_API_KEY,
  RESEND_FROM_EMAIL,
  SENDGRID_API_KEY,
  SENDGRID_FROM_EMAIL,
  SHOULD_DISABLE_ADMIN,
  STORE_CORS,
  STRIPE_API_KEY,
  STRIPE_WEBHOOK_SECRET,
  WORKER_MODE,
  MEILISEARCH_HOST,
  MEILISEARCH_ADMIN_KEY,
  ODOO_URL,
  ODOO_DB,
  ODOO_USERNAME,
  ODOO_API_KEY,
} from 'lib/constants'

loadEnv(process.env.NODE_ENV, process.cwd())

const medusaConfig = {
  projectConfig: {
    databaseUrl: DATABASE_URL,
    databaseLogging: false,
    redisUrl: REDIS_URL,
    workerMode: WORKER_MODE,
    http: {
      port: process.env.MEDUSA_INTERNAL_PORT || PORT,
      adminCors: ADMIN_CORS || '*',
      authCors: AUTH_CORS || '*',
      storeCors: STORE_CORS || '*',
      jwtSecret: JWT_SECRET,
      cookieSecret: COOKIE_SECRET,
    },
    build: {
      admin: {
        path: './admin',
        outDir: './admin/dist',
      },
    },
  },
  admin: {
    backendUrl: BACKEND_URL,
    disable: SHOULD_DISABLE_ADMIN ?? false,
  },
  modules: [
    ...(ODOO_URL && ODOO_DB && ODOO_USERNAME && ODOO_API_KEY
      ? [
          {
            resolve: './src/modules/odoo',
            options: {
              url: ODOO_URL,
              dbName: ODOO_DB,
              username: ODOO_USERNAME,
              apiKey: ODOO_API_KEY,
            },
          },
        ]
      : []),

    // ✅ STORAGE SOLO LOCAL
    {
      key: Modules.FILE,
      resolve: '@medusajs/file',
      options: {
        providers: [
          {
            resolve: '@medusajs/file-local',
            id: 'local',
            options: {
              upload_dir: 'static',               // carpeta local
              backend_url: `${BACKEND_URL}/static`, // URL pública de esos ficheros
            },
          },
        ],
      },
    },

    ...(REDIS_URL
      ? [
          {
            key: Modules.EVENT_BUS,
            resolve: '@medusajs/event-bus-redis',
            options: { redisUrl: REDIS_URL },
          },
          {
            key: Modules.WORKFLOW_ENGINE,
            resolve: '@medusajs/workflow-engine-redis',
            options: { redis: { url: REDIS_URL } },
          },
        ]
      : []),

    ...((SENDGRID_API_KEY && SENDGRID_FROM_EMAIL) || (RESEND_API_KEY && RESEND_FROM_EMAIL)
      ? [
          {
            key: Modules.NOTIFICATION,
            resolve: '@medusajs/notification',
            options: {
              providers: [
                ...(SENDGRID_API_KEY && SENDGRID_FROM_EMAIL
                  ? [
                      {
                        resolve: '@medusajs/notification-sendgrid',
                        id: 'sendgrid',
                        options: {
                          channels: ['email'],
                          api_key: SENDGRID_API_KEY,
                          from: SENDGRID_FROM_EMAIL,
                        },
                      },
                    ]
                  : []),
                ...(RESEND_API_KEY && RESEND_FROM_EMAIL
                  ? [
                      {
                        resolve: './src/modules/email-notifications',
                        id: 'resend',
                        options: {
                          channels: ['email'],
                          api_key: RESEND_API_KEY,
                          from: RESEND_FROM_EMAIL,
                        },
                      },
                    ]
                  : []),
              ],
            },
          },
        ]
      : []),

    ...(STRIPE_API_KEY && STRIPE_WEBHOOK_SECRET
      ? [
          {
            key: Modules.PAYMENT,
            resolve: '@medusajs/payment',
            options: {
              providers: [
                {
                  resolve: '@medusajs/payment-stripe',
                  id: 'stripe',
                  options: {
                    apiKey: STRIPE_API_KEY,
                    webhookSecret: STRIPE_WEBHOOK_SECRET,
                  },
                },
              ],
            },
          },
        ]
      : []),
  ],
  plugins: [
    { resolve: 'medusa-variant-images', options: {} },
    ...(MEILISEARCH_HOST && MEILISEARCH_ADMIN_KEY
      ? [
          {
            resolve: '@rokmohar/medusa-plugin-meilisearch',
            options: {
              config: { host: MEILISEARCH_HOST, apiKey: MEILISEARCH_ADMIN_KEY },
              settings: {
                products: {
                  type: 'products',
                  enabled: true,
                  fields: ['id', 'title', 'description', 'handle', 'variant_sku', 'thumbnail'],
                  indexSettings: {
                    searchableAttributes: ['title', 'description', 'variant_sku'],
                    displayedAttributes: [
                      'id',
                      'handle',
                      'title',
                      'description',
                      'variant_sku',
                      'thumbnail',
                    ],
                    filterableAttributes: ['id', 'handle'],
                  },
                  primaryKey: 'id',
                },
              },
            },
          },
        ]
      : []),
  ],
}

export default defineConfig(medusaConfig)
