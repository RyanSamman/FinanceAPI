import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { currencyNames, availableCurrencies } from '../util/currencies'
import { User } from './User'
import { PaymentRecord } from './PaymentRecord'

export type paymentStatus = 'underway' | 'due' | 'paid'
export const paymentStatusValues = ['due', 'paid', 'underway']

@Entity()
export class Payment extends BaseEntity {

	@PrimaryGeneratedColumn()
	paymentId: number

	@ManyToOne(_type => User, user => user.payments, { nullable: false })
	userId: number

	@OneToMany(_type => PaymentRecord, history => history.paymentId, { eager: true, cascade: true })
	paymentHistory?: PaymentRecord[]

	@Column('enum', { enum: currencyNames })
	currency: availableCurrencies

	@Column('decimal', { scale: 10, precision: 20 })
	amount: number

	@Column('enum', { enum: paymentStatusValues, nullable: false })
	paymentStatus: paymentStatus

	@CreateDateColumn({ update: false })
	createdAt: Date

	@UpdateDateColumn()
	updatedAt: Date

	@Column({ type: 'timestamp without time zone', update: false })
	dueAt: Date

	@Column({ type: 'timestamp without time zone', nullable: true })
	paidAt: Date | undefined

	@Column({ default: false })
	deleted: boolean

	@Column({ default: false })
	sentDueReminder: boolean
}
