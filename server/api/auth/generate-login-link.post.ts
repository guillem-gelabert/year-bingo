import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

import db, { users } from "../../utils/db";
import { generateLoginToken, getTokenExpiration } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  // Check API key
  const apiKey = getHeader(event, "x-api-key");
  const expectedApiKey = process.env.API_KEY;

  if (!expectedApiKey) {
    throw createError({
      statusCode: 500,
      message: "API_KEY not configured",
    });
  }

  if (!apiKey || apiKey !== expectedApiKey) {
    throw createError({
      statusCode: 401,
      message: "Invalid or missing API key",
    });
  }

  // Parse request body
  const body = await readBody<{
    name: string;
    email?: string;
    days?: number;
  }>(event);

  if (!body.name) {
    throw createError({
      statusCode: 400,
      message: "name is required",
    });
  }

  const expirationDays = body.days || 7;
  const loginToken = generateLoginToken();
  const loginTokenExpiresAt = getTokenExpiration(expirationDays);

  // Check if this will be the first user (they become admin)
  const existingUsersCount = await db.select().from(users).limit(1);
  const isFirstUser = existingUsersCount.length === 0;

  // Create or update user
  let user:
    | {
        id: string;
        name: string;
        email: string | null;
      }
    | undefined;

  if (body.email) {
    const existing = (
      await db.select().from(users).where(eq(users.email, body.email)).limit(1)
    )[0];
    if (existing) {
      await db
        .update(users)
        .set({
          name: body.name,
          loginToken,
          loginTokenExpiresAt,
          updatedAt: new Date(),
        })
        .where(eq(users.id, existing.id));
      user = { id: existing.id, name: body.name, email: existing.email };
    } else {
      const newId = randomUUID();
      await db.insert(users).values({
        id: newId,
        name: body.name,
        email: body.email,
        loginToken,
        loginTokenExpiresAt,
        isAdmin: isFirstUser,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      user = { id: newId, name: body.name, email: body.email };
    }
  } else {
    const newId = randomUUID();
    await db.insert(users).values({
      id: newId,
      name: body.name,
      email: null,
      loginToken,
      loginTokenExpiresAt,
      isAdmin: isFirstUser,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    user = { id: newId, name: body.name, email: null };
  }

  const appUrl = process.env.APP_URL || "http://localhost:3000";
  const loginUrl = `${appUrl}/login?token=${loginToken}`;

  return {
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    loginUrl,
    expiresAt: loginTokenExpiresAt.toISOString(),
  };
});
