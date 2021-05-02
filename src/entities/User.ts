import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { PaymentRecord } from './PaymentRecord'
import { Payment } from './Payment'

@Entity()
export class User extends BaseEntity {
	@PrimaryGeneratedColumn()
	userId: number

	@Column('varchar', { length: 20, unique: true })
	name: string

	@CreateDateColumn()
	createdAt: Date

	@UpdateDateColumn()
	updatedAt: Date

	@OneToMany(
		_type => Payment,
		payment => payment.userId,
		{ nullable: true, cascade: true, eager: true },
	)
	payments?: Payment[]

	@OneToMany(
		_type => PaymentRecord,
		paymentRecord => paymentRecord.userId,
		{ nullable: true, cascade: true, eager: true },
	)
	paymentHistory?: PaymentRecord[]
}
