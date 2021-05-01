
// 1 milisecond
const milli = 1

// 1 second is 1000 milliseconds
const second = 1000 * milli

/// 1 minute is 60 seconds
const minute = 60 * second

// 1 hour is 60 minutes
const hour = 60 * minute

// 1 day is 24 hours
const day = 24 * hour

interface ICalculateMilliseconds {
	millis?: number
	seconds?: number
	minutes?: number
	hours?: number
	days?: number
}

export function calculateMilliseconds({ millis = 0, seconds = 0, minutes = 0, hours = 0, days = 0 }: ICalculateMilliseconds): number {
	return millis * milli
		+ seconds * second
		+ minutes * minute
		+ hours * hour
		+ days * day
}

function getDateAfter(millisecondsPassed: number): Date
function getDateAfter(timePassed: ICalculateMilliseconds): Date
function getDateAfter(timePassed: number | ICalculateMilliseconds): Date {
	const now = new Date()

	// Convert Object into milliseconds
	if (typeof timePassed === 'object') {
		timePassed = calculateMilliseconds(timePassed)
	}

	return new Date(now.getTime() + timePassed)
}

export {
	milli,
	second,
	minute,
	hour,
	day,
	getDateAfter,
}
