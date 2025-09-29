const checkEnvVariables = require("./check-env-variables")
checkEnvVariables()

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: {
    remotePatterns: [
      // Local dev
      { protocol: "http", hostname: "localhost" },

      // Dominio público de tu app (p/ imágenes en /public)
      {
        protocol: process.env.NEXT_PUBLIC_BASE_URL?.startsWith("https") ? "https" : "http",
        hostname: process.env.NEXT_PUBLIC_BASE_URL?.replace(/^https?:\/\//, ""),
      },

      // Medusa backend (solo si usas local-file para media)
      {
        protocol: "https",
        hostname: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL?.replace(/^https?:\/\//, ""),
      },

      // Demo media de Medusa (puedes borrarlos cuando no los uses)
      { protocol: "https", hostname: "medusa-public-images.s3.eu-west-1.amazonaws.com" },
      { protocol: "https", hostname: "medusa-server-testing.s3.amazonaws.com" },
      { protocol: "https", hostname: "medusa-server-testing.s3.us-east-1.amazonaws.com" },

      // ✅ MinIO (vía ENV) – quita protocolo si viene incluido
      ...(process.env.NEXT_PUBLIC_MINIO_ENDPOINT
        ? [{
            protocol: "https",
            hostname: process.env.NEXT_PUBLIC_MINIO_ENDPOINT.replace(/^https?:\/\//, ""),
          }]
        : []),

      // ✅ MinIO (host fijo de Railway) – por si la ENV no está presente
      {
        protocol: "https",
        hostname: "bucket-production-23c8.up.railway.app",
      },
    ],
  },
  serverRuntimeConfig: {
    port: process.env.PORT || 3000,
  },
}

module.exports = nextConfig
