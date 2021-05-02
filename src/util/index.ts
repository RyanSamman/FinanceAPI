/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-empty-function */
import dotenv from 'dotenv'
import loadConfiguration from './loadConfiguration'
import Logger from './Logger'

dotenv.config()

const config = loadConfiguration(process.env)

// Function that does nothing (No Operation)
const noop = (..._data: unknown[]) => { }

const logger = new Logger({
	onLog: config.NODE_ENV !== 'development' ? noop : console.log,
	onInfo: config.NODE_ENV === 'test' ? noop : (...data) => console.log(...data),
	onError: (...data) => console.error(...data),
})

logger.info('Loaded Config:')
logger.info(JSON.stringify(config, null, 2))

export {
	logger,
	config,
}
