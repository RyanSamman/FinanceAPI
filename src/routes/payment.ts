import express, { Request, Response } from 'express'
import { param, body } from 'express-validator'
import { PaymentRecord } from '../entities/PaymentRecord'
import { User } from '../entities/User'
import { Payment, paymentStatus } from '../entities/Payment'
import { config } from '../util'
import currencyData, { availableCurrencies, isCurrencyName } from '../util/currencies'
import { getDateAfter } from '../util/getDateAfter'
import { noPaymentFound, oneError, ResponseData } from '../util/routeTypes'
import { handleErrors } from '../util/middleware'

const router = express.Router()

interface UserParams {
	userId?: string
}

router.get('/:userId/all',
	param('userId').isNumeric(),
	handleErrors,
	async (
		req: Request<UserParams>,
		res: Response<ResponseData<Payment[]>>,
	) => {
		const { userId } = req.params

		const payments = await Payment.find({ where: { userId, deleted: false } })

		res.status(200).json({ data: payments })
	})

interface newPaymentBody {
	userId: number,
	amount: number,
	currency: availableCurrencies,
}


router.post('/new',
	body('userId').isNumeric(),
	body('amount').isNumeric(),
	body('currency').custom(isCurrencyName),
	handleErrors,
	async (
		req: Request<unknown, unknown, newPaymentBody>,
		res: Response<ResponseData<string>>,
	) => {
		const { userId, amount, currency } = req.body

		// Find the User
		const user = await User.findOne(userId)

		// If no user exists, return an error
		if (!user) {
			res.status(404).json(oneError('userId', `No user with the Id of ${userId} exists.`))
			return
		}

		// Create the Payment
		let userPayment = Payment.create({
			amount,
			currency,
			paymentStatus: 'underway',
			dueAt: getDateAfter(config.DUE_AFTER),
			userId,
		})

		userPayment = await userPayment.save()

		// Save a record of the payment creation
		const userPaymentRecord = PaymentRecord.create({
			amount,
			recordKind: 'creation',
			currency: userPayment.currency,
			userId,
			paymentId: userPayment.paymentId,
		})

		await userPaymentRecord.save()

		res.status(201).json({ data: 'Successfully created a new Payment' })
	})

interface payPaymentBody {
	userId: number,
	paymentId: number,
	amount: number,
	currency: availableCurrencies,
}

interface payPaymentResponseBody {
	message: string
	balance: number
	overcharge: number
	paymentStatus: paymentStatus,
}

router.put('/pay',
	body('userId').isNumeric(),
	body('paymentId').isNumeric(),
	body('amount').isNumeric(),
	body('currency').custom(isCurrencyName),
	handleErrors,
	async (
		req: Request<unknown, unknown, payPaymentBody>,
		res: Response<ResponseData<payPaymentResponseBody>>,
	) => {
		const { userId, paymentId, amount, currency } = req.body
		const payment = await Payment.findOne({ where: { userId, paymentId, deleted: false } })

		if (!payment) {
			res.status(404).json(noPaymentFound(userId, paymentId))
			return
		}

		if (payment.paymentStatus === 'paid') {
			res.status(400).json(oneError('paymentId', `Payment #${paymentId} is already fulfilled.`))
			return
		}

		if (payment.currency !== currency) {
			res.status(400).json(oneError('currency', `Your payment is in ${payment.currency}. It does not accept ${currency}.`))
			return
		}

		if (!payment.paymentHistory) {
			payment.paymentHistory = []
		}

		let overcharge = 0

		if (payment.amount > amount) {
			payment.amount -= amount
			// await PaymentRecord.create({ userId, paymentId, amount, currency, recordKind: 'payment' }).save()
			const userPaymentRecord = PaymentRecord.create({
				amount,
				recordKind: 'payment',
				currency: payment.currency,
				userId,
				paymentId: payment.paymentId,
			})

			payment.paymentHistory.push(userPaymentRecord)
		} else {
			overcharge = amount - payment.amount
			payment.paymentStatus = 'paid'

			const userPaymentRecord = PaymentRecord.create({
				amount: payment.amount,
				recordKind: 'completion',
				currency: payment.currency,
				userId,
				paymentId,
			})

			payment.paymentHistory.push(userPaymentRecord)
			payment.amount = 0
			payment.paidAt = new Date()
		}

		await payment.save()

		res.status(200).json({
			data: {
				message: payment.paymentStatus === 'paid'
					? `Paid off Payment #${paymentId}.`
					: `Made a payment of ${currencyData[currency]?.code}${amount} to Payment #${paymentId}.`,
				balance: payment.amount,
				overcharge,
				paymentStatus: payment.paymentStatus,
			},
		})
	})

interface deletePaymentBody {
	userId: number
	paymentId: number
}

router.delete('/delete',
	body('userId').isNumeric(),
	body('paymentId').isNumeric(),
	handleErrors,
	async (
		req: Request<unknown, unknown, deletePaymentBody>,
		res: Response<ResponseData<string>>,
	) => {
		const { userId, paymentId } = req.body
		const payment = await Payment.findOne({ where: { userId, paymentId, deleted: false } })

		if (!payment) {
			res.status(404).json(noPaymentFound(userId, paymentId))
			return
		}

		if (payment.paymentStatus !== 'paid') {
			res.status(400).json(oneError('paymendId', `Payment #${paymentId} has not been paid off yet.`))
			return
		}

		payment.deleted = true
		await payment.save()

		res.status(200).json({ data: 'This payment has been deleted.' })
	})

export default router
