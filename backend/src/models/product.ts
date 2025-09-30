/**
 * Medusa v2 usa MikroORM y el módulo de producto no exporta una clase de entidad
 * extendible como en TypeORM. No intentes extender `Product` aquí.
 *
 * Opciones soportadas:
 * - Usar metadata del producto (recomendado) para campos personalizados.
 * - Mantener la columna vía migración y leer/escribir con SQL/QueryBuilder
 *   desde rutas/servicios personalizados.
 * - (Avanzado) Sobrescribir el módulo de producto del core.
 */
export {}
