import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const uploadImageRoute: FastifyPluginAsyncZod = async server => {
	server.post('/uploads', async (request, reply) => {
		return reply.status(200).send({ uploadId: 'test' })
	})
}
