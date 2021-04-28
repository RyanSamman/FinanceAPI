
export interface ResponseError<E = string> {
	[name: string]: E
}

export interface ResponseData<T=string, E= string> {
	data?: T
	errors?: ResponseError<E>[]
}
