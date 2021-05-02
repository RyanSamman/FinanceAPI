import express, { Request, Response } from 'express'
import { param } from 'express-validator'
import { Payment } from 'src/entities/Payment'
import { User } from 'src/entities/User'
import { handleErrors } from 'src/util/middleware'
import { oneError, ResponseData } from '../util/routeTypes'

const router = express.Router()

interface paymentReminderParams {
	userId?: string
}

router.get('/:userId',
	param('userId').isNumeric(),
	handleErrors,
	async (
		req: Request<paymentReminderParams>,
		res: Response<ResponseData<Payment[]>>,
	) => {
		const { userId }: paymentReminderParams = req.params

		const user = await User.findOne(userId)

		if (!user) {
			res.status(404).json(oneError('userId', `No User with an Id of ${userId} was found.`, 'params'))
			return
		}

		if (!user.payments) {
			res.status(404).json(oneError('userId', `The User ${user.name} with an Id of ${userId} has no payments.`, 'params'))
			return
		}

		const duePayments = user.payments
			// The payment has not been 'deleted'
			.filter(payment => !payment.deleted)
			// The payment has not been paid off
			.filter(payment => payment.paymentStatus !== 'paid')
			// The payment is due
			.filter(payment => payment.dueAt <= new Date())
			// The payment has not had a reminder sent of it before
			.filter(payment => !payment.sentDueReminder)
		user.payments.forEach(payment => {
			if ()
		})


		res.status(200).json({ data: duePayments })
	})


export default router

