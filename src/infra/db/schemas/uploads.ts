import { randomUUID } from 'node:crypto'
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const uploads = pgTable('uploads', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => randomUUID()),
	name: text('name').notNull(),
	remoteKey: text('remote_key').notNull().unique(),
	remoteUrl: text('remote_url'),
	createdAt: timestamp('created_at', { withTimezone: true })
		.notNull()
		.defaultNow(),
})
