import { drizzle } from 'drizzle-orm/mysql2'
import mysql from 'mysql2/promise'

import * as schema from '../db/schema'

function poolSingleton() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set')
  }
  return mysql.createPool(connectionString)
}

function dbSingleton() {
  return drizzle(poolSingleton(), { schema, mode: 'default' })
}

declare const globalThis: {
  __dbGlobal?: ReturnType<typeof dbSingleton>
  __poolGlobal?: ReturnType<typeof poolSingleton>
} & typeof global

const pool = globalThis.__poolGlobal ?? poolSingleton()
const db = globalThis.__dbGlobal ?? drizzle(pool, { schema, mode: 'default' })

export default db
export { pool }
export * from '../db/schema'

if (process.env.NODE_ENV !== 'production') {
  globalThis.__poolGlobal = pool
  globalThis.__dbGlobal = db
}

