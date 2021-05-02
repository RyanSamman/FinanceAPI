/* eslint-disable prefer-const */
/* eslint-disable jest/expect-expect */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Connection } from 'typeorm'
import { connectToDatabase, clearDatabase } from '../connectToDatabase'

import supertest from 'supertest'
import app from '../../api'

import { User } from 'src/entities/User'
import { Payment } from 'src/entities/Payment'
import { PaymentRecord } from 'src/entities/PaymentRecord'
import { ResponseData } from 'src/util/routeTypes'
import { userData } from '../mockData'

let connection: Connection
const api = supertest(app)

beforeAll(async () => {
	connection = await connectToDatabase()
})

afterAll(async () => {
	await clearDatabase(connection)
})

beforeEach(async () => {
	await User.delete({})
	await Payment.delete({})
	await PaymentRecord.delete({})
})

describe('POST /user/new - Create new User', () => {
	const route = '/user/new'
	it('Successfully creates a new user', async () => {

		const res = await api
			.post(route)
			.send(userData[0])
			.expect(201)
			.expect('Content-Type', /json/)

		let { errors, data } = <ResponseData<User>>res.body

		expect(errors).toBeUndefined()

		expect(data).toBeDefined()
		// Force data to be defined
		data = <User>data
		expect(data.userId).toBeDefined()
		expect(data.userId).toBe(1)

		expect(data.name).toBeDefined()
		expect(data.name).toBe(userData[0].name)
		expect(data.createdAt).toBeDefined()
		expect(data.updatedAt).toBeDefined()

	})
})

describe('GET /user/all - Retrieve All Users', () => {
	const route = '/user/all'
	it('Retrieves no users', async () => {

		const res = await api
			.get(route)
			.expect(200)
			.expect('Content-Type', /json/)

		let { errors, data } = <ResponseData<User[]>>res.body

		expect(errors).toBeUndefined()

		expect(data).toBeDefined()
		expect(data).toHaveLength(0)
	})

	it('Retrieves many users', async () => {

		const users = userData
			.map(u => User.create(u))
			.map(u => u.save())

		await Promise.all(users)

		const res = await api
			.get(route)
			.expect(200)
			.expect('Content-Type', /json/)

		let { errors, data } = <ResponseData<User[]>>res.body

		expect(errors).toBeUndefined()

		expect(data).toBeDefined()
		expect(data).toHaveLength(users.length)
	})
})

describe('GET /user/:userId - Retrieve a Users', () => {
	const route = '/user'
	it('Successfully finds a user', async () => {
		const user = User.create(userData[0])
		await user.save()

		const res = await api
			.get(`${route}/${user.userId}`)
			.expect(200)
			.expect('Content-Type', /json/)

		let { errors, data } = <ResponseData<User>>res.body

		expect(errors).toBeUndefined()

		expect(data).toBeDefined()
		// Force data to be defined
		data = <User>data
		expect(data.userId).toBeDefined()
		expect(data.userId).toBeGreaterThanOrEqual(1)

		expect(data.name).toBeDefined()
		expect(data.name).toBe(userData[0].name)
		expect(data.createdAt).toBeDefined()
		expect(data.updatedAt).toBeDefined()
	})

	it('No user found', async () => {
		const res = await api
			.get(`${route}/0`)
			.expect(404)
			.expect('Content-Type', /json/)

		let { errors, data } = <ResponseData<User>>res.body

		expect(errors).toBeDefined()
		expect(data).toBeUndefined()
	})
})
