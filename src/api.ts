import 'express-async-errors'
import express, { Response } from 'express'
import { ResponseData } from './util/routeTypes'
import user from './routes/user'
import payment from './routes/payment'
import reminder from './routes/reminder'
import transaction from './routes/transaction'
import { routeLogger, errorHandler, speedLimiter } from './util/middleware'

const app = express()


// Speed Limiter
//  Gradually Slow down requests if too many are being made at once
app.enable('trust proxy')
app.use(speedLimiter)

// JSON Body parser
app.use(express.json())

// Logger
app.use(routeLogger)

// Health Check API
app.head('/status', (_req, res) => res.sendStatus(200))
app.get('/status', (_req, res: Response<ResponseData>) => {
	res.status(200).json({ data: 'OK' })
})

// Error Handler
app.use(errorHandler)

// 404 Route catching any remaining routes
app.use('*', (_req, res: Response<ResponseData>) => {
	res.status(404).json({
		errors: [
			{ location: 'error', msg: '404 - Route not found', param: 'error' },
		],
	})
})

export default app
