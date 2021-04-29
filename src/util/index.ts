/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-empty-function */
import chalk from 'chalk'
import loadConfiguration from './loadConfiguration'
import Logger from './Logger'

const config = loadConfiguration(process.env)

// Function that does nothing (No Operation)
const noop = (..._data: unknown[]) => { }

const logger = new Logger({
	onLog: config.NODE_ENV === 'production' ? noop : console.log,
	onInfo: (...data) => console.log(chalk.bgGreen.black(...data)),
	onError: (...data) => console.error(chalk.bgRed.black(...data)),
})

logger.info(config)

export {
	logger,
	config,
}
