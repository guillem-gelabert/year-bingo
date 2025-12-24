export default defineEventHandler(async (event) => {
  // Check if public view is enabled (after deadline)
  if (!isPublicViewEnabled()) {
    throw createError({
      statusCode: 403,
      message: 'Bingo cards will be publicly visible after December 31st',
    })
  }

  // Get all bingo cards with predictions and user info
  const bingoCards = await prisma.bingoCard.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
      predictions: {
        orderBy: { position: 'asc' },
      },
    },
  })

  return bingoCards
})
