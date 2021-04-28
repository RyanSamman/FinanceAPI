/* eslint-disable jest/expect-expect */
import { ResponseData } from 'src/types'
import supertest from 'supertest'
import app from './../../api'

const api = supertest(app)

describe('Health Check API', () => {
	it('gives a 200 response code with a HEAD request', async () => {
		await api.head('/status')
			.expect(200)
	})

	it('gives a 200 response code and JSON data with a GET request', async () => {
		const res = await api.get('/status')
			.expect(200)
			.expect('Content-Type', /json/)

		const { errors, data } = <ResponseData> res.body

		expect(errors).toBeUndefined()
		expect(data).toBeDefined()

		expect(data).toContain('OK')
	})
})
