import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { fakerPT_BR as faker } from '@faker-js/faker'

export async function makeUpload(overrides: {
	name?: string
	remoteKey?: string
	remoteUrl?: string
	createdAt?: Date
}) {
	const fileName = faker.system.fileName()

	const result = await db
		.insert(schema.uploads)
		.values({
			name: fileName,
			remoteKey: `images/${fileName}`,
			remoteUrl: `https://test.com/images/${fileName}`,
			...overrides,
		})
		.returning()

	return result[0]
}
