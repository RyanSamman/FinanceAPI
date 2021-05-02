import { User } from 'src/entities/User'
import { logger } from '.'

export default async function sendReminder(userId: string | number, paymentId: string | number): Promise<void> {
	const user = await User.findOne(userId)

	if (!user) {
		logger.error(`Error: Couldn't send a reminder to the user with the Id of '${userId}'`)
		return
	}

	// Place Reminder logic here
	logger.info(`Sent ${user.name} a reminder on payment #${paymentId}`)
}
