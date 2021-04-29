import ConfigError from './errors'

export type NodeEnvState = 'production' | 'test' | 'development'

export interface Config {
	NODE_ENV: NodeEnvState
	PORT: number,
}

export interface Env {
	[name: string]: string | undefined
}

export function loadNodeEnv({ NODE_ENV }: Env): NodeEnvState | null {
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

	return null
}

export function loadPort({ PORT }: Env): number | null {
	// If the port is number, parse it and return
	if (PORT?.match(/^\d+$/)) {
		return parseInt(PORT.trim())
	}

	return null
}

export default function loadConfiguration(env: Env): Config {

	const PORT = loadPort(env)
	const NODE_ENV = loadNodeEnv(env)

	const config = {
		PORT,
		NODE_ENV,
	}

	const errors = Object.entries(config)
		.filter(([, value]) => value === null)
		.map(([name]) => `Invalid ${name}: ${env[name]}`)

	if (errors.length) {
		throw new ConfigError(`Invalid .env configuration:\n${errors.join('\n')}`)
	}

	return <Config> config
}
