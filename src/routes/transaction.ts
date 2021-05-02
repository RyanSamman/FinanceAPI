import express, { Request, Response } from 'express'
import { param } from 'express-validator'
import { PaymentRecord } from '../entities/PaymentRecord'
import { ResponseData } from '../util/routeTypes'

const router = express.Router()

interface allUserTransactionsParams {
	userId: string
}

router.get('/:userId/all',
	param('userId').isNumeric(),
	async (req: Request<allUserTransactionsParams>, res: Response<ResponseData<PaymentRecord[]>>) => {
		const { userId } = req.params
		const userPaymentHistory = await PaymentRecord.find({ where: { userId } })
		res.status(200).json({ data: userPaymentHistory })
	})

export default router
