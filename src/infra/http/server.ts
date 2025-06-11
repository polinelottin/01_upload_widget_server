import { env } from '@/env'
import { fastifyCors } from '@fastify/cors'
import { fastify } from 'fastify'
import {
	hasZodFastifySchemaValidationErrors,
	serializerCompiler,
	validatorCompiler,
} from 'fastify-type-provider-zod'
import { uploadImageRoute } from './routes/upload-image'

const server = fastify()

server.setValidatorCompiler(validatorCompiler)
server.setSerializerCompiler(serializerCompiler)

server.setErrorHandler((error, request, reply) => {
	if (hasZodFastifySchemaValidationErrors(error)) {
		return reply.status(400).send({
			message: 'Validation error',
			details: error.validation,
		})
	}

	// sentry / datadog
	console.error(error)
	reply.status(500).send({ message: 'Internal server error' })
})

server.register(uploadImageRoute)
server.register(fastifyCors, {
	origin: '*',
})

server.listen({ port: 3333, host: '0.0.0.0' }).then(() => {
	console.log('Server is running!')
})
