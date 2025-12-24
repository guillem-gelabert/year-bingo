import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'

import * as schema from '../db/schema'

function poolSingleton() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set')
  }
  return new Pool({ connectionString })
}

function dbSingleton() {
  return drizzle(poolSingleton(), { schema })
}

declare const globalThis: {
  __dbGlobal?: ReturnType<typeof dbSingleton>
  __poolGlobal?: Pool
} & typeof global

const pool = globalThis.__poolGlobal ?? poolSingleton()
const db = globalThis.__dbGlobal ?? drizzle(pool, { schema })

export default db
export { pool }
export * from '../db/schema'

if (process.env.NODE_ENV !== 'production') {
  globalThis.__poolGlobal = pool
  globalThis.__dbGlobal = db
}

