import { and, eq, ne, sql } from 'drizzle-orm'

import db, { bingoCards, predictions } from '../../utils/db'
import { getUserId } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const userId = await getUserId(event)

  // Count filled predictions (non-empty descriptions). If logged in, exclude your own.
  const whereClause = userId
    ? and(ne(predictions.description, ''), ne(bingoCards.userId, userId))
    : ne(predictions.description, '')

  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(predictions)
    .innerJoin(bingoCards, eq(predictions.bingoCardId, bingoCards.id))
    .where(whereClause)

  return { count: Number(result[0]?.count ?? 0) }
})


