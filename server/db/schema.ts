import { boolean, char, int, mysqlTable, text, timestamp, uniqueIndex, varchar } from 'drizzle-orm/mysql-core'

// IMPORTANT:
// These table + column names intentionally match Prisma's defaults
// (e.g. "User", "BingoCard", "Prediction" and camelCase columns),
// so existing databases created by Prisma keep working.

export const users = mysqlTable(
  'User',
  {
    id: char('id', { length: 36 }).primaryKey(),
    name: text('name').notNull(),
    // NOTE: In MySQL/MariaDB, TEXT columns can't be indexed without a prefix length.
    // These are uniquely indexed, so use VARCHAR.
    email: varchar('email', { length: 191 }),
    loginToken: varchar('loginToken', { length: 191 }),
    loginTokenExpiresAt: timestamp('loginTokenExpiresAt', { mode: 'date' }),
    isAdmin: boolean('isAdmin').notNull().default(false),
    createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow(),
  },
  (t) => ({
    emailUnique: uniqueIndex('User_email_key').on(t.email),
    loginTokenUnique: uniqueIndex('User_loginToken_key').on(t.loginToken),
  }),
)

export const bingoCards = mysqlTable(
  'BingoCard',
  {
    id: char('id', { length: 36 }).primaryKey(),
    userId: char('userId', { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow(),
  },
  (t) => ({
    userIdUnique: uniqueIndex('BingoCard_userId_key').on(t.userId),
  }),
)

export const predictions = mysqlTable(
  'Prediction',
  {
    id: char('id', { length: 36 }).primaryKey(),
    bingoCardId: char('bingoCardId', { length: 36 })
      .notNull()
      .references(() => bingoCards.id, { onDelete: 'cascade' }),
    description: text('description').notNull(),
    position: int('position').notNull(), // 1-9 for 3x3 grid
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

