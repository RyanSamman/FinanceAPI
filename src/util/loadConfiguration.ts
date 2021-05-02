/* eslint-disable prefer-destructuring */
import ConfigError from './errors'
import { TimeValues } from './getDateAfter'
import _ from 'lodash'

export type NodeEnvState = 'production' | 'test' | 'development'

export interface Config {
	PORT: number
	DOCKER: boolean
	POSTGRES_DB: string
	POSTGRES_USER: string
	NODE_ENV: NodeEnvState
	POSTGRES_PASSWORD: string
	DUE_AFTER: TimeValues
}

export interface Env {
	[name: string]: string | undefined
}

export function loadNodeEnv({ NODE_ENV }: Env): NodeEnvState | undefined {
	// Is in Production
	// True if NODE_ENV contains the substring 'prod', case insensitive
	if (NODE_ENV?.match(/prod/i)) {
		return 'production'
	}

	// Is in a Test/CI Environment
	// True if NODE_ENV contains the substrings 'test' or 'ci', case insensitive
	if (NODE_ENV?.match(/test|ci/i)) {
		return 'test'
	}

	// Is in a Development Environment
	// True if NODE_ENV contains the substring 'dev', case insensitive
	if (NODE_ENV?.match(/dev/i)) {
		return 'development'
	}

	return undefined
}

export function loadPort({ PORT }: Env): number | undefined {
	// If the port is number, parse it and return
	if (PORT?.match(/^\d+$/)) {
		return parseInt(PORT.trim())
	}

	return undefined
}

export default function loadConfiguration(env: Env): Config {

	const PORT = loadPort(env)
	const NODE_ENV = loadNodeEnv(env)
	const DOCKER = !!env.DOCKER

	const POSTGRES_PASSWORD = env.POSTGRES_PASSWORD
	const POSTGRES_USER = env.POSTGRES_USER
	const POSTGRES_DB = env.POSTGRES_DB

	const config = {
		PORT,
		DOCKER,
		NODE_ENV,
		POSTGRES_DB,
		POSTGRES_USER,
		POSTGRES_PASSWORD,
	}

	const errors = Object.entries(config)
		.filter(([, value]) => _.isUndefined(value))
		.map(([name]) => `Invalid ${name}: ${env[name]}`)


	if (errors.length) {
		throw new ConfigError(`Invalid .env configuration:\n${errors.join('\n')}`)
	}

	// Configure when the payments are due at
	const DUE_AFTER: TimeValues = config.NODE_ENV !== 'test'
		// Due after the time below in Production
		? { days: 7 }
		// Due after below in Testing
		: { seconds: 1 }

	return <Config>{ ...config, DUE_AFTER }
}
