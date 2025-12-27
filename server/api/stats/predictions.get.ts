import { and, eq, ne, sql } from 'drizzle-orm'

import db, { bingoCards, predictions } from '../../utils/db'
import { getUserId } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const userId = await getUserId(event)

  // Count filled predictions (non-empty descriptions with length > 0 after trim).
  // If logged in, exclude your own.
  const descriptionNotEmpty = sql`LENGTH(TRIM(${predictions.description})) > 0`
  const whereClause = userId
    ? and(descriptionNotEmpty, ne(bingoCards.userId, userId))
    : descriptionNotEmpty

  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(predictions)
    .innerJoin(bingoCards, eq(predictions.bingoCardId, bingoCards.id))
    .where(whereClause)

  return { count: Number(result[0]?.count ?? 0) }
})


