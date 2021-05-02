/* eslint-disable no-console */
import { Connection, createConnection } from 'typeorm'
import { PaymentRecord } from '../entities/PaymentRecord'
import { User } from '../entities/User'
import { Payment } from '../entities/Payment'
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions'
import createDatabase from 'src/createDatabase'

export async function connectToDatabase(): Promise<Connection> {
	const config: PostgresConnectionOptions = {
		type: 'postgres',
		username: 'postgres',
		password: 'test',
		database: 'test',
		port: 5433,
		logging: false,
		entities: [User, Payment, PaymentRecord],
	}

	try {
		await createDatabase(config)

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
