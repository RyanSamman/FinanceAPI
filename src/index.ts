import 'reflect-metadata'

import http from 'http'
import api from './api'
import { createConnection } from 'typeorm'

import typeormConfig from './typeormConfig'
import { config, logger } from './util'
import { ServerError } from './util/errors'
import createDatabase from './createDatabase'

export default async function main(): Promise<http.Server> {
	const server = http.createServer(api)

	logger.info(`Attempting to connect to the Database...'`)

	await createDatabase(typeormConfig)

	const connection = await createConnection(typeormConfig)
		.catch(err => {
			throw new ServerError(`Failed to connect to the Database. ${err.message}\n`)
		})

	logger.info('Connection successfully established with the Database!')

	await connection.runMigrations()

	server.listen(config.PORT, () => logger.info(`Server Started on port ${config.PORT}`))

	return server
}

if (require?.main === module) {
	main()
}
