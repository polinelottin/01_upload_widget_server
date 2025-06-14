import { randomUUID } from 'node:crypto'
import { Readable } from 'node:stream'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { isLeft, isRight, unwrapEither } from '@/infra/shared/either'
import { eq } from 'drizzle-orm'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { InvalidFileFormat } from './errors/invalid-file-format'
import { uploadImage } from './upload-image'

describe('upload image', () => {
	beforeAll(() => {
		vi.mock('@/infra/storage/upload-file-to-storage', () => ({
			uploadFileToStorage: vi.fn().mockImplementation(() => ({
				key: `${randomUUID()}.png`,
				url: 'https://test.com/test.png',
			})),
		}))
	})

	it('should be able to upload an image', async () => {
		const fileName = `${randomUUID()}.png`

		const result = await uploadImage({
			fileName,
			contentType: 'image/png',
			contentStream: Readable.from([]),
		})

		expect(isRight(result)).toBe(true)

		const dbResult = await db
			.select()
			.from(schema.uploads)
			.where(eq(schema.uploads.name, fileName))

		expect(dbResult).toHaveLength(1)
	})

	it('should not be able to upload an image with an invalid file format', async () => {
		const result = await uploadImage({
			fileName: `${randomUUID()}.pdf`,
			contentType: 'image/pdf',
			contentStream: Readable.from([]),
		})

		expect(isLeft(result)).toBe(true)
		expect(unwrapEither(result)).toBeInstanceOf(InvalidFileFormat)
	})
})
