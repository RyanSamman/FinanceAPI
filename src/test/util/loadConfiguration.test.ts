import ConfigError from 'src/util/errors'
import loadConfiguration, { loadNodeEnv, loadPort, NodeEnvState } from 'src/util/loadConfiguration'

describe('Loading NODE_ENV', () => {
	it("Loads 'test' successfully into 'test'", () => {
		const process_env = {
			NODE_ENV: 'test',
		}

		const PORT = loadNodeEnv(process_env)

		expect(PORT).not.toBeUndefined()
		expect(PORT).toBe<NodeEnvState>('test')
	})

	it("Loads 'CI' successfully into 'test'", () => {
		const process_env = {
			NODE_ENV: 'CI',
		}

		const PORT = loadNodeEnv(process_env)

		expect(PORT).not.toBeUndefined()
		expect(PORT).toBe<NodeEnvState>('test')
	})

	it("Loads 'prod' successfully into 'production'", () => {
		const process_env = {
			NODE_ENV: 'prod',
		}

		const PORT = loadNodeEnv(process_env)

		expect(PORT).not.toBeUndefined()
		expect(PORT).toBe<NodeEnvState>('production')
	})

	it("Loads 'production' successfully into 'production'", () => {
		const process_env = {
			NODE_ENV: 'production',
		}

		const PORT = loadNodeEnv(process_env)

		expect(PORT).not.toBeUndefined()
		expect(PORT).toBe<NodeEnvState>('production')
	})

	it("Loads 'dev' successfully into 'development'", () => {
		const process_env = {
			NODE_ENV: 'dev',
		}

		const PORT = loadNodeEnv(process_env)

		expect(PORT).not.toBeUndefined()
		expect(PORT).toBe<NodeEnvState>('development')
	})

	it("Loads 'development' successfully into 'development'", () => {
		const process_env = {
			NODE_ENV: 'development',
		}

		const PORT = loadNodeEnv(process_env)

		expect(PORT).not.toBeUndefined()
		expect(PORT).toBe<NodeEnvState>('development')
	})

	it('Returns null when loading an invalid string', () => {
		const process_env = {
			NODE_ENV: 'randomstring',
		}

		const PORT = loadNodeEnv(process_env)

		expect(PORT).toBeUndefined()
	})
})

describe('Loading PORT', () => {
	it('Loads a string of numbers successfully', () => {
		const process_env = {
			PORT: '6000',
		}

		const PORT = loadPort(process_env)

		expect(PORT).not.toBeUndefined()
		expect(PORT).toBe<number>(parseInt(process_env.PORT))
	})

	it('Returns null when loading an invalid string', () => {
		const process_env = {
			PORT: 'abc',
		}

		const PORT = loadPort(process_env)

		expect(PORT).toBeUndefined()
	})
})

describe('Loading all Required Enviroment Variables', () => {
	it('Works as expected', () => {
		const process_env = {
			NODE_ENV: 'test',
			PORT: '6000',
			POSTGRES_DB: 'database',
			POSTGRES_USER: 'database',
			POSTGRES_PASSWORD: 'database',
		}

		const env = loadConfiguration(process_env)

		expect(env.NODE_ENV).toBeDefined()
		expect(env.NODE_ENV).toBe<NodeEnvState>('test')

		expect(env.PORT).toBeDefined()
		expect(env.PORT).toBe<number>(parseInt(process_env.PORT))
	})

	it('Throws a ConfigError when one or more are invalid', () => {
		const process_env = {
			NODE_ENV: 'randomString',
			PORT: 'randomString',
		}

		// Throws a ConfigError
		expect(() => loadConfiguration(process_env)).toThrow(ConfigError)

		// Contains a substring of the following:
		expect(() => loadConfiguration(process_env)).toThrow(/PORT/)
		expect(() => loadConfiguration(process_env)).toThrow(RegExp(`${process_env.PORT}`))
		expect(() => loadConfiguration(process_env)).toThrow(/NODE_ENV/)
		expect(() => loadConfiguration(process_env)).toThrow(RegExp(`${process_env.NODE_ENV}`))
		expect(() => loadConfiguration(process_env)).toThrow(/POSTGRES_DB/)
		expect(() => loadConfiguration(process_env)).toThrow('undefined')
		expect(() => loadConfiguration(process_env)).toThrow(/POSTGRES_USER/)
		expect(() => loadConfiguration(process_env)).toThrow('undefined')
		expect(() => loadConfiguration(process_env)).toThrow(/POSTGRES_PASSWORD/)
		expect(() => loadConfiguration(process_env)).toThrow('undefined')

	})
})
