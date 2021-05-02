import { ValidationError, Result, Location } from 'express-validator'
export interface ResponseError {
	param: string
	msg: string
	location: 'body' | 'cookies' | 'headers' | 'params' | 'query'
}

export interface ServerError {
	param: string
	msg: string | Error
	location: 'error'
}


export interface ResponseData<T = string> {
	data?: T
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	errors?: Result<ValidationError>[] | ResponseError[] | ServerError[]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function oneError(param: string, msg: string, location: Location = 'body'): ResponseData<any> {
	return { errors: [{ msg, param, location }] }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function noPaymentFound(userId: string | number, paymentId: string | number): ResponseData<any> {
	const msg = `No payment exists with the User Id of '${userId}' and a Payment Id of '${paymentId}'`
	return {
		errors: [
			{ param: 'userId', msg, location: 'body' },
			{ param: 'paymentId', msg, location: 'body' },
		],
	}
}

