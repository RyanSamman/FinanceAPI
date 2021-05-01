import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { PaymentRecord } from './PaymentRecord'
import { UserPayment } from './UserPayment'

@Entity()
export class User extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number

	@Column('varchar', { length: 20, unique: true })
	name: string

	@CreateDateColumn()
	createdAt: Date

	@UpdateDateColumn()
	updatedAt: Date

	@OneToMany(
		_type => UserPayment,
		userPayment => userPayment.userId,
		{ nullable: true, cascade: true, eager: true },
	)
	userPayments?: UserPayment[]

	@OneToMany(
		_type => PaymentRecord,
		paymentRecord => paymentRecord.userId,
		{ nullable: true, cascade: true, eager: true },
	)
	paymentHistory?: PaymentRecord[]
}
