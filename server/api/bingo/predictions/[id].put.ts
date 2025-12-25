import { eq } from 'drizzle-orm'

import db, { bingoCards, predictions } from '../../../utils/db'

export default defineEventHandler(async (event) => {
  const userId = await getUserId(event)
  
  if (!userId) {
    throw createError({
      statusCode: 401,
      message: 'Not authenticated',
    })
  }

  // Check if editing is allowed
  if (!canEdit()) {
    throw createError({
      statusCode: 403,
      message: 'Editing is not allowed after the deadline',
    })
  }

  const predictionId = getRouterParam(event, 'id')
  const body = await readBody<{ description: string }>(event)

  if (!predictionId) {
    throw createError({
      statusCode: 400,
      message: 'Prediction ID is required',
    })
  }

  if (typeof body.description !== 'string') {
    throw createError({
      statusCode: 400,
      message: 'Description must be a string',
    })
  }

  // Validate description length (max 500 characters)
  if (body.description.length > 500) {
    throw createError({
      statusCode: 400,
      message: 'Description cannot exceed 500 characters',
    })
  }

  // Find the prediction and verify ownership
  const prediction = (
    await db
      .select({
        id: predictions.id,
        bingoCardId: predictions.bingoCardId,
        description: predictions.description,
        position: predictions.position,
        createdAt: predictions.createdAt,
        updatedAt: predictions.updatedAt,
        ownerUserId: bingoCards.userId,
      })
      .from(predictions)
      .innerJoin(bingoCards, eq(predictions.bingoCardId, bingoCards.id))
      .where(eq(predictions.id, predictionId))
      .limit(1)
  )[0]

  if (!prediction) {
    throw createError({
      statusCode: 404,
      message: 'Prediction not found',
    })
  }

  if (prediction.ownerUserId !== userId) {
    throw createError({
      statusCode: 403,
      message: 'You do not have permission to edit this prediction',
    })
  }

  // Update the prediction (MySQL doesn't support .returning())
  await db
    .update(predictions)
    .set({ description: body.description, updatedAt: new Date() })
    .where(eq(predictions.id, predictionId))

  // Fetch the updated prediction
  const updatedPrediction = (
    await db
      .select()
      .from(predictions)
      .where(eq(predictions.id, predictionId))
      .limit(1)
  )[0]

  return updatedPrediction
})
