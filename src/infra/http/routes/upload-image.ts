import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
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
					201: z.object({
						uploadId: z.string(),
					}),
					409: z
						.object({
							message: z.string(),
						})
						.describe('Upload already exists'),
				},
			},
		},
		async (request, reply) => {
			const uploadedFile = await request.file({
				limits: {
					fileSize: 1024 * 1024 * 5, // 5MB
				},
			})

			console.log(uploadedFile)

			const upload = await db.insert(schema.uploads).values({
				name: 'test',
				remoteKey: 'test',
				remoteUrl: 'test',
			})

			return reply.status(200).send({ uploadId: 'test' })
		}
	)
}
