import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const uploadImageRoute: FastifyPluginAsyncZod = async server => {
	server.post(
		'/uploads',
		{
			schema: {
				summary: 'Upload an image',
				description: 'Upload an image to the server',
				body: z.object({
					name: z.string(),
					password: z.string().optional(),
				}),
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
			return reply.status(200).send({ uploadId: 'test' })
		}
	)
}
