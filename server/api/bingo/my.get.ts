export default defineEventHandler(async (event) => {
  const userId = await getUserId(event)
  
  if (!userId) {
    throw createError({
      statusCode: 401,
      message: 'Not authenticated',
    })
  }

  // Find or create bingo card for user
  let bingoCard = await prisma.bingoCard.findUnique({
    where: { userId },
    include: {
      predictions: {
        orderBy: { position: 'asc' },
      },
    },
  })

  // If no bingo card exists, create one with 9 empty predictions
  if (!bingoCard) {
    bingoCard = await prisma.bingoCard.create({
      data: {
        userId,
        predictions: {
          create: Array.from({ length: 9 }, (_, i) => ({
            position: i + 1,
            description: '',
          })),
        },
      },
      include: {
        predictions: {
          orderBy: { position: 'asc' },
        },
      },
    })
  }

  return {
    ...bingoCard,
    canEdit: canEdit(),
  }
})
