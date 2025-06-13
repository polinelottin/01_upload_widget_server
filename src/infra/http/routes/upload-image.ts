import { uploadImage } from '@/app/functions/upload-image'
import { isRight, unwrapEither } from '@/infra/shared/either'

import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const uploadImageRoute: FastifyPluginAsyncZod = async server => {
	server.post(
		'/uploads',
		{
			schema: {
				summary: 'Upload an image',
				consumes: ['multipart/form-data'],
				description: 'Upload an image to the server',
				response: {
					201: z.null().describe('Uploaded successfully'),
					400: z.object({
						message: z.string(),
					}),
				},
			},
		},
		async (request, reply) => {
			const uploadedFile = await request.file({
				limits: {
					fileSize: 1024 * 1024 * 5, // 5MB
				},
			})

			if (uploadedFile === undefined) {
				return reply.status(400).send({
					message: 'No file uploaded',
				})
			}

			const result = await uploadImage({
				fileName: uploadedFile.filename,
				contentType: uploadedFile.mimetype,
				contentStream: uploadedFile.file,
			})

			if (isRight(result)) {
				return reply.status(201).send()
			}

			const error = unwrapEither(result)

			switch (error.constructor.name) {
				case 'InvalidFileFormat':
					return reply.status(400).send({
						message: error.message,
					})
			}
		}
	)
}
