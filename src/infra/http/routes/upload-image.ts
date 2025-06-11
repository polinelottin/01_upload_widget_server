import type { FastifyInstance } from 'fastify'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'

export const uploadImageRoute: FastifyPluginAsyncZod = async server => {
	server.post('/uploads', () => {
		return {
			message: 'Hello World',
		}
	})
}
