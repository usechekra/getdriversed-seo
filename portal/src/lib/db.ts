import { PrismaClient } from '@prisma/client'
import path from 'path'

const RAW_URL = process.env.DATABASE_URL ?? 'file:./prisma/dev.db'
const isSQLite = RAW_URL.startsWith('file:')

// Resolve relative file: paths to absolute
const DATABASE_URL = isSQLite
  ? `file:${path.resolve(process.cwd(), RAW_URL.replace(/^file:\.?\/?/, ''))}`
  : RAW_URL

function createPrismaClient() {
  if (isSQLite) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaLibSql } = require('@prisma/adapter-libsql')
    const adapter = new PrismaLibSql({ url: DATABASE_URL })
    return new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    })
  } else {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaPg } = require('@prisma/adapter-pg')
    const adapter = new PrismaPg({ connectionString: DATABASE_URL })
    return new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    })
  }
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }
export const prisma = globalForPrisma.prisma ?? createPrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
