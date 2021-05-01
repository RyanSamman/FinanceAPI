/* eslint-disable no-console */
import { Connection, createConnection, ConnectionOptions } from 'typeorm'
import { PaymentRecord } from '../entities/PaymentRecord'
import { User } from '../entities/User'
import { UserPayment } from '../entities/UserPayment'

export async function connectToDatabase(): Promise<Connection> {
	const config: ConnectionOptions = {
		type: 'postgres',
		username: 'postgres',
		password: 'test',
		database: 'test',
		port: 5433,
		logging: false,
		entities: [User, UserPayment, PaymentRecord],
	}

	try {
		// Connect to the 'postgres' database, which is always defined
		const postgresConnection = await createConnection({ ...config, database: 'postgres' })

		// Create the test database
		await postgresConnection
			.query('CREATE DATABASE test')
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			.catch(() => { })

		// Close the connection to the default 'postgres' database
		await postgresConnection.close()

		// Create connection to the 'test' database
		const connection = await createConnection(config)

		// Create Tables
		await connection.synchronize()

		return connection
	} catch (e) {
		console.error('Could not connect to the Testing Database: ', e)
		process.exit(1)
	}
}

export async function clearDatabase(connection: Connection): Promise<void> {
	await connection.dropDatabase()
	await connection.close()
}
