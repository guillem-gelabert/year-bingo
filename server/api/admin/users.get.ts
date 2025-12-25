import { eq } from "drizzle-orm";

import db, { users } from "../../utils/db";
import { requireAdmin } from "../../utils/auth";
import { generateLoginToken, getTokenExpiration } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);

  const allUsers = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      isAdmin: users.isAdmin,
      loginToken: users.loginToken,
      loginTokenExpiresAt: users.loginTokenExpiresAt,
    })
    .from(users);

  const appUrl = process.env.APP_URL || "http://localhost:3000";

  return allUsers.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    loginUrl: user.loginToken
      ? `${appUrl}/login?token=${user.loginToken}`
      : null,
    bingoUrl: `${appUrl}/admin/bingo/${user.id}`,
  }));
});

