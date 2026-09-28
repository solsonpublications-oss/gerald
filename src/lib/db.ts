import { PrismaClient } from '@prisma/client'

// A versioned cache key so that schema changes (new models) bust the
// stale PrismaClient instance held on globalThis across hot reloads.
const PRISMA_CACHE_VERSION = 'v10-reactions'

const globalForPrisma = globalThis as unknown as {
  __prismaCache?: { version: string; client: PrismaClient }
}

function getClient(): PrismaClient {
  const cached = globalForPrisma.__prismaCache
  if (cached && cached.version === PRISMA_CACHE_VERSION) {
    return cached.client
  }
  // Only log errors (not every query) to reduce memory/log pressure.
  const client = new PrismaClient({
    log: ['error', 'warn'],
  })
  globalForPrisma.__prismaCache = { version: PRISMA_CACHE_VERSION, client }
  return client
}

export const db = getClient()