import { asc, eq } from 'drizzle-orm'

import db, { bingoCards, predictions, users } from '../../utils/db'

type PublicBingoCard = {
  id: string
  userId: string
  createdAt: Date
  updatedAt: Date
  user: { id: string; name: string }
  predictions: Array<{
    id: string
    bingoCardId: string
    description: string
    position: number
    createdAt: Date
    updatedAt: Date
  }>
}

export default defineEventHandler(async (event) => {
  // Get all bingo cards with predictions and user info
  const rows = await db
    .select({
      cardId: bingoCards.id,
      cardUserId: bingoCards.userId,
      cardCreatedAt: bingoCards.createdAt,
      cardUpdatedAt: bingoCards.updatedAt,
      userId: users.id,
      userName: users.name,
      predictionId: predictions.id,
      predictionDescription: predictions.description,
      predictionPosition: predictions.position,
      predictionCreatedAt: predictions.createdAt,
      predictionUpdatedAt: predictions.updatedAt,
    })
    .from(bingoCards)
    .innerJoin(users, eq(bingoCards.userId, users.id))
    .leftJoin(predictions, eq(predictions.bingoCardId, bingoCards.id))
    .orderBy(asc(users.name), asc(predictions.position))

  const byCardId = new Map<string, PublicBingoCard>()

  for (const row of rows) {
    const existing =
      byCardId.get(row.cardId) ??
      ({
        id: row.cardId,
        userId: row.cardUserId,
        createdAt: row.cardCreatedAt,
        updatedAt: row.cardUpdatedAt,
        user: { id: row.userId, name: row.userName },
        predictions: [],
      } satisfies PublicBingoCard)

    if (row.predictionId) {
      existing.predictions.push({
        id: row.predictionId,
        bingoCardId: row.cardId,
        description: row.predictionDescription ?? '',
        position: row.predictionPosition ?? 0,
        createdAt: row.predictionCreatedAt ?? existing.createdAt,
        updatedAt: row.predictionUpdatedAt ?? existing.updatedAt,
      })
    }

    byCardId.set(row.cardId, existing)
  }

  return Array.from(byCardId.values())
})
