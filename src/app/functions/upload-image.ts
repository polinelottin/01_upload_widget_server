import { Readable } from 'node:stream'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeLeft, makeRight } from '@/infra/shared/either'
import { uploadFileToStorage } from '@/infra/storage/upload-file-to-storage'
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

	const { key, url } = await uploadFileToStorage({
		folder: 'images',
		fileName,
		contentType,
		contentStream,
	})

	const result = await db.insert(schema.uploads).values({
		name: fileName,
		remoteKey: key,
		remoteUrl: url,
	})

	return makeRight({ url })
}
