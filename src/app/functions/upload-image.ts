import { Readable } from 'node:stream'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeLeft, makeRight } from '@/infra/shared/either'
import { z } from 'zod'
import { InvalidFileFormat } from './errors/invalid-file-format'

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

export async function uploadImage(
	input: UploadImageInput
): Promise<Either<InvalidFileFormat, { url: string }>> {
	const { fileName, contentType, contentStream } = uploadImageInput.parse(input)

	if (!allowedContentTypes.includes(contentType)) {
		return makeLeft(new InvalidFileFormat())
	}

	// TODO: Upload to Cloudflare R2

	const result = await db.insert(schema.uploads).values({
		name: fileName,
		remoteKey: fileName,
		remoteUrl: fileName,
	})

	return makeRight({ url: '' })
}
