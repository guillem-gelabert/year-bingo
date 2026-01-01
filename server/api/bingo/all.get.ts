import { sql } from 'drizzle-orm'

import db, { predictions } from '../../utils/db'

type AnonymousPrediction = {
  id: string
  description: string
  position: number
}

export default defineEventHandler(async () => {
  // Get all non-empty predictions without any author info for privacy
  const rows = await db
    .select({
      id: predictions.id,
      description: predictions.description,
      position: predictions.position,
    })
    .from(predictions)
    .where(sql`LENGTH(TRIM(${predictions.description})) > 0`)

  return rows.map((row): AnonymousPrediction => ({
    id: row.id,
    description: row.description ?? '',
    position: row.position ?? 0,
  }))
})
