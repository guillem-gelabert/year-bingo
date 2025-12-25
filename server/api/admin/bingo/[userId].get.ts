import { asc, eq } from "drizzle-orm";
import { randomUUID } from "crypto";

import db, { bingoCards, predictions, users } from "../../../utils/db";
import { requireAdmin } from "../../../utils/auth";
import { canEdit } from "../../../utils/deadline";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);

  const userId = getRouterParam(event, "userId");
  if (!userId) {
    throw createError({
      statusCode: 400,
      message: "User ID is required",
    });
  }

  // Verify user exists
  const user = (
    await db.select().from(users).where(eq(users.id, userId)).limit(1)
  )[0];

  if (!user) {
    throw createError({
      statusCode: 404,
      message: "User not found",
    });
  }

  // Find or create bingo card for user
  let bingoCard = (
    await db
      .select()
      .from(bingoCards)
      .where(eq(bingoCards.userId, userId))
      .limit(1)
  )[0];

  // If no bingo card exists, create one with 9 empty predictions
  if (!bingoCard) {
    const now = new Date();
    const cardId = randomUUID();
    
    await db.insert(bingoCards).values({
      id: cardId,
      userId,
      createdAt: now,
      updatedAt: now,
    });
    
    await db.insert(predictions).values(
      Array.from({ length: 9 }, (_, i) => ({
        id: randomUUID(),
        bingoCardId: cardId,
        position: i + 1,
        description: "",
        createdAt: now,
        updatedAt: now,
      }))
    );
    
    bingoCard = (await db.select().from(bingoCards).where(eq(bingoCards.id, cardId)).limit(1))[0];
  }

  const bingoCardPredictions = await db
    .select()
    .from(predictions)
    .where(eq(predictions.bingoCardId, bingoCard.id))
    .orderBy(asc(predictions.position));

  return {
    ...bingoCard,
    predictions: bingoCardPredictions,
    canEdit: canEdit(),
    userName: user.name,
    userEmail: user.email,
  };
});
