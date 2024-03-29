/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Connection } from 'typeorm'
import { connectToDatabase, clearDatabase } from './connectToDatabase'

import { User } from 'src/entities/User'
import { Payment } from 'src/entities/Payment'
import { PaymentRecord } from 'src/entities/PaymentRecord'
import { getDateAfter } from 'src/util/getDateAfter'

let connection: Connection

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


describe('Test Database Functions', () => {

	it('Creates a User', async () => {
		let users = await User.find({})
		expect(users).toHaveLength(0)

		const newUser = new User()

		newUser.name = 'Joe'
		await newUser.save()

		users = await User.find({})
		expect(users).toHaveLength(1)
		const [user] = users
		expect(user.name).toBe(newUser.name)
	})

	it('Creates a User with a Payment & Payment Record', async () => {
		let users = await User.find({})
		expect(users).toHaveLength(0)

		const newUser = new User()

		newUser.name = 'Joe'

		const newPayment = new Payment()
		newPayment.amount = 50
		newPayment.currency = 'USD'
		newPayment.paymentStatus = 'underway'
		newPayment.dueAt = getDateAfter({ days: 2 })

		const newPaymentRecord = new PaymentRecord()
		newPaymentRecord.amount = newPayment.amount
		newPaymentRecord.recordKind = 'creation'
		newPaymentRecord.currency = newPayment.currency

		newPayment.paymentHistory = [newPaymentRecord]
		newUser.payments = [newPayment]
		newUser.paymentHistory = [newPaymentRecord]

		await newUser.save()

		users = await User.find({})
		expect(users).toHaveLength(1)

		const [user] = await User.find({})
		expect(user.name).toBe(newUser.name)
		expect(user.payments).toBeDefined()
		expect(user.paymentHistory).toBeDefined()

		expect(user.payments).toHaveLength(1)
		expect(user.paymentHistory).toHaveLength(1)

	})


})
