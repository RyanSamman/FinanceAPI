import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from './User'
import { UserPayment } from './UserPayment'

@Entity()
export class PaymentRecord extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number

	@Column('enum', { enum: ['creation', 'payment', 'completion'] })
	recordKind: 'creation' | 'payment' | 'completion'

	@Column('decimal', { scale: 10, precision: 20 })
	amount: number

	@ManyToOne(_type => User, user => user.paymentHistory, { nullable: false })
	userId: number

	@ManyToOne(_type => UserPayment, userPayment => userPayment, { nullable: false })
	userPaymentId: number
}
