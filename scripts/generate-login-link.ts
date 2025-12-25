#!/usr/bin/env tsx
import "dotenv/config";
import { randomBytes, randomUUID } from "crypto";
import { eq } from "drizzle-orm";

import db, { users } from "../server/utils/db";

interface Args {
  name?: string;
  email?: string;
  days?: number;
}

function parseArgs(): Args {
  const args: Args = {};

  for (let i = 2; i < process.argv.length; i++) {
    const arg = process.argv[i];

    if (arg === "--name" && i + 1 < process.argv.length) {
      // Collect all arguments after --name until next flag or end
      // This handles multi-word names like "John Doe"
      const nameParts: string[] = [];
      i++; // Move past --name
      while (i < process.argv.length && !process.argv[i].startsWith("--")) {
        nameParts.push(process.argv[i]);
        i++;
      }
      args.name = nameParts.join(" ");
      i--; // Adjust for loop increment
    } else if (arg === "--email" && i + 1 < process.argv.length) {
      args.email = process.argv[++i];
    } else if (arg === "--days" && i + 1 < process.argv.length) {
      args.days = parseInt(process.argv[++i], 10);
    }
  }

  return args;
}

function generateLoginToken(): string {
  return randomBytes(32).toString("hex");
}

function getTokenExpiration(days: number = 7): Date {
  const expiration = new Date();
  expiration.setDate(expiration.getDate() + days);
  return expiration;
}

async function main() {
  const args = parseArgs();

  if (!args.name) {
    console.error("Error: --name is required");
    console.log("\nUsage:");
    console.log(
      '  npm run generate-login-link -- --name "John Doe" [--email "john@example.com"] [--days 7]'
    );
    process.exit(1);
  }

  const expirationDays = args.days || 7;
  const loginToken = generateLoginToken();
  const loginTokenExpiresAt = getTokenExpiration(expirationDays);

  // Create or update user
  let user:
    | {
        id: string;
        name: string;
        email: string | null;
      }
    | undefined;

  if (args.email) {
    const existing = (
      await db.select().from(users).where(eq(users.email, args.email)).limit(1)
    )[0];
    if (existing) {
      await db
        .update(users)
        .set({
          name: args.name,
          loginToken,
          loginTokenExpiresAt,
          updatedAt: new Date(),
        })
        .where(eq(users.id, existing.id));
      user = { id: existing.id, name: args.name, email: existing.email };
    } else {
      const newId = randomUUID();
      await db.insert(users).values({
        id: newId,
        name: args.name,
        email: args.email,
        loginToken,
        loginTokenExpiresAt,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      user = { id: newId, name: args.name, email: args.email };
    }
  } else {
    const newId = randomUUID();
    await db.insert(users).values({
      id: newId,
      name: args.name,
      email: null,
      loginToken,
      loginTokenExpiresAt,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    user = { id: newId, name: args.name, email: null };
  }

  const appUrl = process.env.APP_URL || "http://localhost:3000";
  const loginUrl = `${appUrl}/login?token=${loginToken}`;

  console.log("\n✅ Login link generated successfully!\n");
  console.log("User:", user.name);
  if (user.email) console.log("Email:", user.email);
  console.log("Expires:", loginTokenExpiresAt.toLocaleString());
  console.log("\n🔗 Login URL:");
  console.log(loginUrl);
  console.log("");
}

main().catch((error) => {
  console.error("Error generating login link:", error);
  process.exit(1);
});
