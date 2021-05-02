import slowDown from 'express-slow-down'
import { validationResult } from 'express-validator'
import { Request, Response, RequestHandler } from 'express'
import { config, logger } from '.'
import { ResponseData } from './routeTypes'

export const routeLogger: RequestHandler = (req, _res, next) => {
	logger.log(`${req.method} ${req.path} ${JSON.stringify(req.body)}`)
	next()
}

export const speedLimiter = slowDown({
	windowMs: 15 * 60 * 1000, // 15 minutes
	delayAfter: 100, // allow 100 requests per 15 minutes, then...
	delayMs: 500,
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleErrors: RequestHandler = (req: Request<any, any, any, any, any>, res, next) => {

	const errors = validationResult(<Request> req)
	if (!errors.isEmpty()) {
		res.status(400).json({ errors: errors.array() })
		return
	}

	next()
}

function errorRoute(err: Error, req: Request, res: Response<ResponseData>, _next: never): void {
	logger.error(err)

	if (config.NODE_ENV !== 'production') {
		res.status(500).json({ errors: [{ param: 'error', msg: err, location: 'error' }] })
		return
	}
	res.status(500).json({ errors: [{ param: 'error', msg: 'Server Error.', location: 'error' }] })
}

// Valid middleware, however Express does not handle it
// Therefore, Type cast it to unknown, and to a valid RequestHandler
// to be used as middleware
export const errorHandler: RequestHandler = <RequestHandler><unknown>errorRoute
