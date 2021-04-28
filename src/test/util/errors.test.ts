import ConfigError, { ServerError } from '../../util/errors'

const message = 'Hello World'

describe('ServerError', () => {
	it('throws a ServerError with message', () => {
		const fn = () => { throw new ServerError(message) }
		expect(fn).toThrow(message)
		expect(fn).toThrow(ServerError)
	})
})

describe('ConfigError', () => {
	const fn = () => { throw new ConfigError(message) }
	it('throws a ConfigError with a message', () => {
		expect(fn).toThrow(message)
		expect(fn).toThrow(ConfigError)
	})

	it('Is a subclass of ServerError', () => {
		expect(fn).toThrow(ServerError)
	})
})
