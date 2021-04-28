/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-console */
import Logger from './../../util/Logger'

const text1 = 'Hello Jest'
const text2 = 'Hello Tamara'
const text3 = 'Hello World'

const texts = [text1, text2, text3]

const logMethod = 'log'
const infoMethod = 'log'
const errorMethod = 'error'

describe('Logger with a default constructor', () => {

	// Remove logging
	beforeAll(() => {
		jest.spyOn(console, 'log').mockImplementation(() => { })
		jest.spyOn(console, 'warn').mockImplementation(() => { })
		jest.spyOn(console, 'error').mockImplementation(() => { })
	})

	describe('Functions with one parameter', () => {
		it('logger.log adds one parameter to console.log', () => {
			const logSpy = jest.spyOn(console, logMethod)
			const logger = new Logger()

			logger.log(text1)

			expect(logSpy).toHaveBeenCalled()
			expect(logSpy).toHaveBeenCalledWith(text1)
		})

		it('logger.info adds one parameter to console.log', () => {
			const logSpy = jest.spyOn(console, infoMethod)
			const logger = new Logger()

			logger.info(text1)

			expect(logSpy).toHaveBeenCalled()
			expect(logSpy).toHaveBeenCalledWith(text1)
		})

		it('logger.error adds one parameter to console.error', () => {
			const logSpy = jest.spyOn(console, errorMethod)

			const logger = new Logger()

			logger.error(text1)

			expect(logSpy).toHaveBeenCalled()
			expect(logSpy).toHaveBeenCalledWith(text1)
		})
	})

	describe('Functions with multiple parameters', () => {

		it('logger.log adds multiple things to console.log', () => {
			const logSpy = jest.spyOn(console, logMethod)
			const logger = new Logger()

			logger.log(...texts)

			expect(logSpy).toHaveBeenCalled()
			expect(logSpy).toHaveBeenCalledWith(...texts)
		})

		it('logger.info adds multiple things to console.log', () => {
			const logSpy = jest.spyOn(console, infoMethod)
			const logger = new Logger()

			logger.info(...texts)

			expect(logSpy).toHaveBeenCalled()
			expect(logSpy).toHaveBeenCalledWith(...texts)
		})

		it('logger.error adds multiple things to console.error', () => {
			const logSpy = jest.spyOn(console, errorMethod)
			const logger = new Logger()

			logger.error(...texts)

			expect(logSpy).toHaveBeenCalled()
			expect(logSpy).toHaveBeenCalledWith(...texts)
		})
	})

	describe('Functions being called more than once', () => {
		it('logger.log works when called more than once', () => {
			const logSpy = jest.spyOn(console, logMethod)
			const logger = new Logger()

			texts.forEach(text => logger.log(text))

			expect(logSpy).toHaveBeenCalledTimes(texts.length)
			texts.forEach(text => expect(logSpy).toHaveBeenCalledWith(text))
		})
		it('logger.info works when called more than once', () => {
			const logSpy = jest.spyOn(console, infoMethod)
			const logger = new Logger()

			texts.forEach(text => logger.info(text))

			expect(logSpy).toHaveBeenCalledTimes(texts.length)
			texts.forEach(text => expect(logSpy).toHaveBeenCalledWith(text))
		})

		it('logger.error works when called more than once', () => {
			const logSpy = jest.spyOn(console, errorMethod)
			const logger = new Logger()

			texts.forEach(text => logger.error(text))

			expect(logSpy).toHaveBeenCalledTimes(texts.length)
			texts.forEach(text => expect(logSpy).toHaveBeenCalledWith(text))
		})
	})
})

describe('Logger with custom callback functions', () => {
	it('logger.log works with a custom callback function', () => {
		const callbackSpy = jest.fn((..._data) => {})
		const logger = new Logger({
			onLog: callbackSpy
		})

		logger.log(...texts)

		expect(callbackSpy).toHaveBeenCalled()
		expect(callbackSpy).toHaveBeenCalledWith(...texts)
	})
	it('logger.info works with a custom callback function', () => {
		const callbackSpy = jest.fn((..._data) => {})
		const logger = new Logger({
			onInfo: callbackSpy
		})

		logger.info(...texts)

		expect(callbackSpy).toHaveBeenCalled()
		expect(callbackSpy).toHaveBeenCalledWith(...texts)
	})
	it('logger.error works with a custom callback function', () => {
		const callbackSpy = jest.fn((..._data) => {})
		const logger = new Logger({
			onError: callbackSpy
		})

		logger.error(...texts)

		expect(callbackSpy).toHaveBeenCalled()
		expect(callbackSpy).toHaveBeenCalledWith(...texts)
	})
})
