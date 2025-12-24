import { integer, pgTable, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core'

// IMPORTANT:
// These table + column names intentionally match Prisma's defaults
// (e.g. "User", "BingoCard", "Prediction" and camelCase columns),
// so existing databases created by Prisma keep working.

export const users = pgTable(
  'User',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    email: text('email'),
    loginToken: text('loginToken'),
    loginTokenExpiresAt: timestamp('loginTokenExpiresAt', { mode: 'date' }),
    createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow(),
  },
  (t) => ({
    emailUnique: uniqueIndex('User_email_key').on(t.email),
    loginTokenUnique: uniqueIndex('User_loginToken_key').on(t.loginToken),
  }),
)

export const bingoCards = pgTable(
  'BingoCard',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow(),
  },
  (t) => ({
    userIdUnique: uniqueIndex('BingoCard_userId_key').on(t.userId),
  }),
)

export const predictions = pgTable(
  'Prediction',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    bingoCardId: uuid('bingoCardId')
      .notNull()
      .references(() => bingoCards.id, { onDelete: 'cascade' }),
    description: text('description').notNull(),
    position: integer('position').notNull(), // 1-9 for 3x3 grid
    createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow(),
  },
  (t) => ({
    bingoCardIdPositionUnique: uniqueIndex('Prediction_bingoCardId_position_key').on(
      t.bingoCardId,
      t.position,
    ),
  }),
)

