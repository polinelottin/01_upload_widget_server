import { Readable } from 'node:stream'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { z } from 'zod'

export const uploadImageInput = z.object({
	fileName: z.string(),
	contentType: z.string(),
	contentStream: z.instanceof(Readable),
})

type UploadImageInput = z.input<typeof uploadImageInput>

const allowedContentTypes = [
	'image/jpg',
	'image/jpeg',
	'image/png',
	'image/webp',
]

export async function uploadImage(input: UploadImageInput) {
	const { fileName, contentType, contentStream } = uploadImageInput.parse(input)

	if (!allowedContentTypes.includes(contentType)) {
		throw new Error('Invalid content type')
	}

	// TODO: Upload to Cloudflare R2

	await db.insert(schema.uploads).values({
		name: fileName,
		remoteKey: fileName,
		remoteUrl: fileName,
	})
}
