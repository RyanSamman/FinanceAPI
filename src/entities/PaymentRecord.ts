import { availableCurrencies, currencyNames } from '../util/currencies'
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from './User'
import { Payment } from './Payment'

export type paymentRecordKind = 'creation' | 'payment' | 'completion'
export const paymentRecordValues = ['creation', 'payment', 'completion']

@Entity()
export class PaymentRecord extends BaseEntity {
	@PrimaryGeneratedColumn()
	paymentRecordId: number

	@Column('enum', { enum: paymentRecordValues })
	recordKind: paymentRecordKind

	@Column('decimal', { scale: 10, precision: 20 })
	amount: number

	@Column('enum', { enum: currencyNames, nullable: false })
	currency: availableCurrencies

	@ManyToOne(_type => User, user => user.paymentHistory, { nullable: false })
	userId: number

	@ManyToOne(_type => Payment, userPayment => userPayment, { nullable: false })
	paymentId: number

	@CreateDateColumn()
	createdAt: Date
}
