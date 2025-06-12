import { fastifyCors } from '@fastify/cors'
import { fastifyMultipart } from '@fastify/multipart'
import { fastifySwagger } from '@fastify/swagger'
import { fastifySwaggerUi } from '@fastify/swagger-ui'
import { fastify } from 'fastify'
import {
	hasZodFastifySchemaValidationErrors,
	jsonSchemaTransform,
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

server.register(fastifyCors, {
	origin: '*',
})

// PLUGINS
server.register(fastifyMultipart)
server.register(fastifySwagger, {
	openapi: {
		info: {
			title: 'Upload Server',
			description: 'API for uploading images',
			version: '1.0.0',
		},
	},
	transform: jsonSchemaTransform,
})

server.register(fastifySwaggerUi, {
	routePrefix: '/docs',
})

// ROUTES
server.register(uploadImageRoute)

server.listen({ port: 3333, host: '0.0.0.0' }).then(() => {
	console.log('Server is running!')
})
