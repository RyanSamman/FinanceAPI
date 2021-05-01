import path from 'path'
import { ConnectionOptions } from 'typeorm'
import { config as envConfig, logger } from './util'

const isProduction = envConfig.NODE_ENV === 'production'

logger.log(path.join(__dirname, 'entities', '**', '*.ts'))

const config: ConnectionOptions = {
	type: 'postgres',
	port: 5432,
	host: envConfig.DOCKER ? 'db' : 'localhost',
	username: envConfig.POSTGRES_USER,
	password: envConfig.POSTGRES_PASSWORD,
	database: envConfig.POSTGRES_DB,
	logging: !isProduction,
	synchronize: false,
	migrationsRun: true,
	entities: [
		path.join(__dirname, 'entities', '**', '*.ts'),
	],
	migrations: [
		path.join(__dirname, 'migrations', '**', '*.ts'),
	],
	cli: {
		'entitiesDir': 'dist/entities',
		'migrationsDir': 'src/migrations',
	},
}

export default config
