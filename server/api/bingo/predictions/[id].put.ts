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
  const prediction = await prisma.prediction.findUnique({
    where: { id: predictionId },
    include: {
      bingoCard: true,
    },
  })

  if (!prediction) {
    throw createError({
      statusCode: 404,
      message: 'Prediction not found',
    })
  }

  if (prediction.bingoCard.userId !== userId) {
    throw createError({
      statusCode: 403,
      message: 'You do not have permission to edit this prediction',
    })
  }

  // Update the prediction
  const updatedPrediction = await prisma.prediction.update({
    where: { id: predictionId },
    data: { description: body.description },
  })

  return updatedPrediction
})
