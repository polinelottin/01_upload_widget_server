import { jsonSchemaTransform } from 'fastify-type-provider-zod'

type TransformSwaggerSchema = Parameters<typeof jsonSchemaTransform>[0]

export function transformSwaggerSchema(data: TransformSwaggerSchema) {
	const { schema, url } = jsonSchemaTransform(data)

	if (schema.consumes?.includes('multipart/form-data')) {
		if (schema.body === undefined) {
			schema.body = {
				type: 'object',
				properties: {},
				required: ['file'],
			}
		}

		schema.body.properties.file = {
			type: 'string',
			format: 'binary',
		}

		schema.body.required.push('file')
	}

	return { schema, url }
}
