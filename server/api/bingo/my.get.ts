import { asc, eq } from 'drizzle-orm'
import { randomUUID } from 'crypto'

import db, { bingoCards, predictions } from '../../utils/db'

export default defineEventHandler(async (event) => {
  const userId = await getUserId(event)
  
  if (!userId) {
    throw createError({
      statusCode: 401,
      message: 'Not authenticated',
    })
  }

  // Find or create bingo card for user
  let bingoCard = (await db.select().from(bingoCards).where(eq(bingoCards.userId, userId)).limit(1))[0]

  // If no bingo card exists, create one with 9 empty predictions
  if (!bingoCard) {
    const now = new Date()
    const cardId = randomUUID()
    
    await db.insert(bingoCards).values({
      id: cardId,
      userId,
      createdAt: now,
      updatedAt: now,
    })
    
    await db.insert(predictions).values(
      Array.from({ length: 9 }, (_, i) => ({
        id: randomUUID(),
        bingoCardId: cardId,
        position: i + 1,
        description: '',
        createdAt: now,
        updatedAt: now,
      })),
    )
    
    bingoCard = (await db.select().from(bingoCards).where(eq(bingoCards.id, cardId)).limit(1))[0]
  }

  const bingoCardPredictions = await db
    .select()
    .from(predictions)
    .where(eq(predictions.bingoCardId, bingoCard.id))
    .orderBy(asc(predictions.position))

  return {
    ...bingoCard,
    predictions: bingoCardPredictions,
    canEdit: canEdit(),
  }
})
