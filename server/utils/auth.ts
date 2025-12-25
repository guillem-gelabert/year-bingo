import { randomBytes } from "crypto";
import {
  useSession,
  clearSession as h3ClearSession,
  type H3Event,
  createError,
} from "h3";
import { eq } from "drizzle-orm";
import db, { users } from "./db";

function sessionOptions() {
  const password =
    process.env.SESSION_SECRET || "change-this-to-a-secure-random-string";

  // Persist session across browser restarts (requested behavior)
  const maxAgeSeconds = 60 * 60 * 24 * 365; // 1 year

  return {
    password,
    cookie: {
      httpOnly: true,
      sameSite: "lax" as const,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: maxAgeSeconds,
    },
  };
}

/**
 * Generate a secure random token for login links
 */
export function generateLoginToken(): string {
  return randomBytes(32).toString("hex");
}

/**
 * Calculate expiration date for login token
 * @param days Number of days until expiration
 */
export function getTokenExpiration(days: number = 7): Date {
  const expiration = new Date();
  expiration.setDate(expiration.getDate() + days);
  return expiration;
}

/**
 * Get the current user ID from session
 */
export async function getUserId(event: H3Event): Promise<string | null> {
  const session = await useSession<{ userId?: string }>(
    event,
    sessionOptions()
  );
  return session.data.userId || null;
}

/**
 * Set the current user ID in session
 */
export async function setUserId(event: H3Event, userId: string): Promise<void> {
  const session = await useSession<{ userId?: string }>(
    event,
    sessionOptions()
  );
  await session.update({ userId });
}

/**
 * Clear the session (logout)
 * Uses h3's built-in clearSession function
 */
export async function clearSession(event: H3Event): Promise<void> {
  await h3ClearSession(event, sessionOptions());
}

/**
 * Get whether the current user is an admin
 */
export async function getIsAdmin(event: H3Event): Promise<boolean> {
  const userId = await getUserId(event);
  if (!userId) {
    return false;
  }

  const user = (
    await db
      .select({ isAdmin: users.isAdmin })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)
  )[0];

  return user?.isAdmin ?? false;
}

/**
 * Require admin access - throws 403 if user is not admin
 */
export async function requireAdmin(event: H3Event): Promise<void> {
  const isAdmin = await getIsAdmin(event);
  if (!isAdmin) {
    throw createError({
      statusCode: 403,
      message: "Admin access required",
    });
  }
}
