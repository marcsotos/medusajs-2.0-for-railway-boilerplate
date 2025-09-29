import { loadEnv, Modules, defineConfig } from '@medusajs/utils';
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
  // MINIO (mantenemos estos nombres pero los mapeamos a S3 options)
  MINIO_ENDPOINT,        // opcional: si lo usabas ya
  MINIO_ACCESS_KEY,      // opcional
  MINIO_SECRET_KEY,      // opcional
  MINIO_BUCKET,          // **define este en Railway**
  MEILISEARCH_HOST,
  MEILISEARCH_ADMIN_KEY
} from 'lib/constants';

loadEnv(process.env.NODE_ENV, process.cwd());

// ---- Helpers (protocolo y host limpios) ----
const ensureHttpsUrl = (val) => {
  if (!val) return '';
  const clean = String(val).trim().replace(/^https?:\/\//, '');
  return `https://${clean}`;
};

// ----- Lee las variables reales del bucket de Railway -----
// Si NO usas MINIO_* “antiguas”, cogeremos las de Railway si existen:
const RAW_PUBLIC_ENDPOINT =
  process.env.MINIO_PUBLIC_ENDPOINT || process.env.MINIO_ENDPOINT || MINIO_ENDPOINT;

// Claves: usa ROOT_USER/PASSWORD de Railway si no tienes MINIO_ACCESS/SECRET
const ACCESS_KEY =
  process.env.MINIO_ACCESS_KEY || process.env.MINIO_ROOT_USER || MINIO_ACCESS_KEY;

const SECRET_KEY =
  process.env.MINIO_SECRET_KEY || process.env.MINIO_ROOT_PASSWORD || MINIO_SECRET_KEY;

// Bucket (OBLIGATORIO para S3 provider)
const BUCKET = process.env.MINIO_BUCKET || MINIO_BUCKET;

// Endpoint final con https://
const S3_ENDPOINT = RAW_PUBLIC_ENDPOINT ? ensureHttpsUrl(RAW_PUBLIC_ENDPOINT) : '';

// ¿Tenemos todo para S3?
const HAS_S3 = Boolean(S3_ENDPOINT && ACCESS_KEY && SECRET_KEY && BUCKET);

const medusaConfig = {
  projectConfig: {
    databaseUrl: DATABASE_URL,
    databaseLogging: false,
    redisUrl:       REDIS_URL,
    workerMode:     WORKER_MODE,
    http: {
      adminCors:   ADMIN_CORS,
      authCors:    AUTH_CORS,
      storeCors:   STORE_CORS,
      jwtSecret:   JWT_SECRET,
      cookieSecret: COOKIE_SECRET
    },
    build: {
      rollupOptions: {
        external: ["@medusajs/dashboard"]
      }
    }
  },
  admin: {
    backendUrl: BACKEND_URL,
    disable: SHOULD_DISABLE_ADMIN,
  },
  modules: [
    // ===== FILE MODULE =====
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
                  // Opciones S3/MinIO
                  endpoint: S3_ENDPOINT,            // ej: https://bucket-production-23c8.up.railway.app
                  bucket: BUCKET,                   // ej: medusa-media
                  region: process.env.S3_REGION || 'us-east-1',
                  access_key_id: ACCESS_KEY,        // MINIO_ROOT_USER o MINIO_ACCESS_KEY
                  secret_access_key: SECRET_KEY,    // MINIO_ROOT_PASSWORD o MINIO_SECRET_KEY
                  force_path_style: true,           // **CRÍTICO** para MinIO
                  // (opcional) cdn_url: si sirves por CDN distinto del endpoint
                }
              }
            ]
          : [
              // Fallback a local si faltan variables del bucket
              {
                resolve: '@medusajs/file-local',
                id: 'local',
                options: {
                  upload_dir: 'static',
                  backend_url: `${BACKEND_URL}/static`
                }
              }
            ]
      }
    },

    // ===== REDIS (event bus + workflows) =====
    ...(REDIS_URL ? [
      {
        key: Modules.EVENT_BUS,
        resolve: '@medusajs/event-bus-redis',
        options: { redisUrl: REDIS_URL }
      },
      {
        key: Modules.WORKFLOW_ENGINE,
        resolve: '@medusajs/workflow-engine-redis',
        options: { redis: { url: REDIS_URL } }
      }
    ] : []),

    // ===== NOTIFICATIONS (Sendgrid / Resend) =====
    ...((SENDGRID_API_KEY && SENDGRID_FROM_EMAIL) || (RESEND_API_KEY && RESEND_FROM_EMAIL) ? [{
      key: Modules.NOTIFICATION,
      resolve: '@medusajs/notification',
      options: {
        providers: [
          ...(SENDGRID_API_KEY && SENDGRID_FROM_EMAIL ? [{
            resolve: '@medusajs/notification-sendgrid',
            id: 'sendgrid',
            options: {
              channels: ['email'],
              api_key: SENDGRID_API_KEY,
              from: SENDGRID_FROM_EMAIL,
            }
          }] : []),
          ...(RESEND_API_KEY && RESEND_FROM_EMAIL ? [{
            resolve: './src/modules/email-notifications',
            id: 'resend',
            options: {
              channels: ['email'],
              api_key: RESEND_API_KEY,
              from: RESEND_FROM_EMAIL,
            },
          }] : []),
        ]
      }
    }] : []),

    // ===== PAYMENT (Stripe) =====
    ...(STRIPE_API_KEY && STRIPE_WEBHOOK_SECRET ? [{
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
    }] : []),
  ],

  plugins: [
    ...(MEILISEARCH_HOST && MEILISEARCH_ADMIN_KEY ? [{
      resolve: '@rokmohar/medusa-plugin-meilisearch',
      options: {
        config: {
          host: MEILISEARCH_HOST,
          apiKey: MEILISEARCH_ADMIN_KEY
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
          }
        }
      }
    }] : [])
  ]
};

console.log(JSON.stringify(medusaConfig, null, 2));
export default defineConfig(medusaConfig);
