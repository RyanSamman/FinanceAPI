import { createConnection } from 'typeorm'
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions'

export default async function createDatabase(config: PostgresConnectionOptions): Promise<void> {
	// Connect to the 'postgres' database, which is always defined
	const postgresConnection = await createConnection({ ...config, database: 'postgres', migrationsRun: false, synchronize: false })

	// Create the test database
	await postgresConnection
		.query(`CREATE DATABASE ${config.database}`)
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		.catch(() => { })

	// Close the connection to the default 'postgres' database
	await postgresConnection.close()
}
