import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { currencyNames, availableCurrencies } from '../util/currencies'
import { User } from './User'
import { PaymentRecord } from './PaymentRecord'

@Entity()
export class UserPayment extends BaseEntity {

	@PrimaryGeneratedColumn()
	id: number

	@ManyToOne(_type => User, user => user.userPayments, { nullable: false })
	userId: number

	@OneToMany(_type => PaymentRecord, history => history.userPaymentId)
	paymentHistory?: PaymentRecord[]

	@Column('enum', { enum: currencyNames })
	currency: availableCurrencies

	@Column('decimal', { scale: 10, precision: 20 })
	amount: number

	@Column('enum', { enum: ['due', 'paid', 'underway'], nullable: false })
	paymentStatus: 'underway' | 'due' | 'paid'

	@CreateDateColumn({ update: false })
	createdAt: Date

	@UpdateDateColumn()
	updatedAt: Date

	@Column({ type: 'date', update: false })
	dueAt: Date

	@Column({ type: 'date', nullable: true })
	paidAt: Date | undefined
}
