import express, { Request, Response } from 'express'
import { User } from '../entities/User'
import { ResponseData, oneError } from '../util/routeTypes'
import { body, param } from 'express-validator'
import _ from 'lodash'
import { handleErrors } from '../util/middleware'

const router = express.Router()

interface newUserBody {
	name?: string
}

router.post('/new',
	body('name')
		.isString()
		.isLength({ min: 3, max: 20 }),
	handleErrors,
	async (
		req: Request<unknown, unknown, newUserBody>,
		res: Response<ResponseData<User>>,
	) => {
		const { name }: newUserBody = req.body

		try {
			const user = User.create({ name })
			await user.save()
			res.status(201).json({ data: user })
		} catch (e) {
			if (e?.detail.match('name')) {
				res.status(400)
					.json(oneError('name', `A User with the 'name' ${name} already exists`))
			}
		}
	})


router.get('/all', async (_req, res: Response<ResponseData<User[]>>) => {
	const users = await User.find({})
	res.status(200).json({ data: users })
})


interface UserParams {
	userId?: string
}

router.get('/:userId',
	param('userId').isNumeric(),
	handleErrors,
	async (
		req: Request<UserParams>,
		res: Response<ResponseData<User>>,
	) => {
		const { userId } = req.params
		const user = await User.findOne(userId)

		if (!user) {
			res.status(404)
				.json(oneError('userId', `No user with an 'id' of ${userId} exists.`, 'params'))
			return
		}

		res.status(200).json({ data: user })
	})

export default router
