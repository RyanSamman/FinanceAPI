import 'express-async-errors'
import express, { Response } from 'express'
import { ResponseData } from './types'

const app = express()

app.use(express.json())

app.head('/status', (_req, res) => res.sendStatus(200))
app.get('/status', (_req, res: Response<ResponseData>) => {
	res.status(200).json({ data: 'OK' })
})

app.use('*', (_req, res: Response<ResponseData>) => {
	res.status(404).json({ errors: [
		{ 'error': '404 - Route not found' }
	] })
})

export default app
