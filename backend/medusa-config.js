import { loadEnv, Modules, defineConfig } from '@medusajs/utils'
import {
  ADMIN_CORS,
  AUTH_CORS,
  BACKEND_URL,
  COOKIE_SECRET,
  DATABASE_URL,
  JWT_SECRET,
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
  // Mantengo estos MINIO_* de tus constants para compatibilidad
  MINIO_ENDPOINT,
  MINIO_ACCESS_KEY,
  MINIO_SECRET_KEY,
  MINIO_BUCKET,
  MEILISEARCH_HOST,
  MEILISEARCH_ADMIN_KEY,
} from 'lib/constants'

loadEnv(process.env.NODE_ENV, process.cwd())

/** Helpers */
const ensureHttpUrl = (val: string | undefined | null) => {
  if (!val) return ''
  const trimmed = String(val).trim()
  // Respeta http/https si ya viene definido
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  // Por defecto usa http para evitar CN mismatch si el cert no cubre subdominios
  return `http://${trimmed}`
}

// --- Tomamos primero las vars “nuevas” de Railway si existen, si no las de constants ---
const RAW_PUBLIC_ENDPOINT =
  process.env.MINIO_PUBLIC_ENDPOINT || process.env.MINIO_ENDPOINT || MINIO_ENDPOINT

const ACCESS_KEY =
  process.env.MINIO_ACCESS_KEY || process.env.MINIO_ROOT_USER || MINIO_ACCESS_KEY

const SECRET_KEY =
  process.env.MINIO_SECRET_KEY || process.env.MINIO_ROOT_PASSWORD || MINIO_SECRET_KEY

const BUCKET = process.env.MINIO_BUCKET || MINIO_BUCKET // <- asegúrate de setearla en Railway

// Normalizamos endpoint para EVITAR virtual-hosted-style con el bucket como subdominio
// e.g. medusa-media.bucket-xxxx.up.railway.app -> bucket-xxxx.up.railway.app
const RAW_ENDPOINT_CLEAN = RAW_PUBLIC_ENDPOINT ? ensureHttpUrl(RAW_PUBLIC_ENDPOINT) : ''
const S3_ENDPOINT = (() => {
  if (!RAW_ENDPOINT_CLEAN) return ''
  try {
    const u = new URL(RAW_ENDPOINT_CLEAN)
    const bucketPrefix = `${BUCKET}.`
    if (u.hostname.startsWith(bucketPrefix)) {
      u.hostname = u.hostname.slice(bucketPrefix.length)
    }
    // Devolvemos solo protocolo + host (sin path) p.ej. http(s)://bucket-xxxx.up.railway.app
    return `${u.protocol}//${u.host}`
  } catch {
    return RAW_ENDPOINT_CLEAN
  }
})()

const HAS_S3 = Boolean(S3_ENDPOINT && ACCESS_KEY && SECRET_KEY && BUCKET)

const medusaConfig = {
  projectConfig: {
    databaseUrl: DATABASE_URL,
    databaseLogging: false,
    redisUrl: REDIS_URL,
    workerMode: WORKER_MODE,
    http: {
      adminCors: ADMIN_CORS,
      authCors: AUTH_CORS,
      storeCors: STORE_CORS,
      jwtSecret: JWT_SECRET,
      cookieSecret: COOKIE_SECRET,
    },
    build: {
      rollupOptions: {
        external: ['@medusajs/dashboard'],
      },
    },
  },
  admin: {
    backendUrl: BACKEND_URL,
    disable: SHOULD_DISABLE_ADMIN,
  },
  modules: [
    // ===== FILE MODULE (S3 / MinIO con path-style) =====
    {
      key: Modules.FILE,
      resolve: '@medusajs/file',
      options: {
        providers: HAS_S3
          ? [
              {
                resolve: '@medusajs/file-s3',
                id: 's3',
                options: {
                  endpoint: S3_ENDPOINT,                 // p.ej. http://bucket-production-xxxx.up.railway.app
                  bucket: BUCKET,                        // p.ej. "medusa-media"
                  region: process.env.S3_REGION || 'us-west-2',
                  access_key_id: ACCESS_KEY,             // MINIO_ROOT_USER o MINIO_ACCESS_KEY
                  secret_access_key: SECRET_KEY,         // MINIO_ROOT_PASSWORD o MINIO_SECRET_KEY

                  // 🔧 Forzamos path-style para evitar CN mismatch (nada de subdominio del bucket)
                  forcePathStyle: true,
                  force_path_style: true,

                  // ✅ URLs públicas tipo http(s)://endpoint/bucket/obj
                  cdn_url: `${S3_ENDPOINT.replace(/\/+$/, '')}/${BUCKET}`,
                },
              },
            ]
          : [
              // Fallback a local si faltan variables del bucket
              {
                resolve: '@medusajs/file-local',
                id: 'local',
                options: {
                  upload_dir: 'static',
                  backend_url: `${BACKEND_URL}/static`,
                },
              },
            ],
      },
    },

    // ===== SANITY (módulo local) =====
    {
      // 👇 Ruta local
      resolve: './src/modules/sanity',
      options: {
        project_id: process.env.SANITY_PROJECT_ID,
        dataset: process.env.SANITY_DATASET || 'production',
        api_token: process.env.SANITY_API_TOKEN,
        api_version: process.env.SANITY_API_VERSION || '2024-01-01',
        // studio_url: opcional si publicas el Studio
        type_map: {
          product: 'product',
          // podrás ampliar:
          // productVariant: 'productVariant',
          // collection: 'collection',
        },
      },
    },

    // ===== REDIS (event bus + workflows) =====
    ...(REDIS_URL
      ? [
          {
            key: Modules.EVENT_BUS,
            resolve: '@medusajs/event-bus-redis',
            options: {
              redisUrl: REDIS_URL,
            },
          },
          {
            key: Modules.WORKFLOW_ENGINE,
            resolve: '@medusajs/workflow-engine-redis',
            options: {
              redis: {
                url: REDIS_URL,
              },
            },
          },
        ]
      : []),

    // ===== NOTIFICATIONS (Sendgrid / Resend) =====
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
                        resolve: './backend/src/modules/email-notifications',
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

    // ===== PAYMENT (Stripe) =====
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
    // 👇 AÑADIDO: medusa-variant-images
    {
      resolve: 'medusa-variant-images',
      options: {},
    },

    // (Condicional) Meilisearch
    ...(MEILISEARCH_HOST && MEILISEARCH_ADMIN_KEY
      ? [
          {
            resolve: '@rokmohar/medusa-plugin-meilisearch',
            options: {
              config: {
                host: MEILISEARCH_HOST,
                apiKey: MEILISEARCH_ADMIN_KEY,
              },
              settings: {
                products: {
                  type: 'products',
                  enabled: true,
                  fields: ['id', 'title', 'description', 'handle', 'variant_sku', 'thumbnail'],
                  indexSettings: {
                    searchableAttributes: ['title', 'description', 'variant_sku'],
                    displayedAttributes: ['id', 'handle', 'title', 'description', 'variant_sku', 'thumbnail'],
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

console.log(JSON.stringify(medusaConfig, null, 2))
export default defineConfig(medusaConfig)
