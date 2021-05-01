import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateTables1619886639093 implements MigrationInterface {
	name = 'CreateTables1619886639093'

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`CREATE TYPE "user_payment_currency_enum" AS ENUM('USD', 'CAD', 'EUR', 'AED', 'AFN', 'ALL', 'AMD', 'ARS', 'AUD', 'AZN', 'BAM', 'BDT', 'BGN', 'BHD', 'BIF', 'BND', 'BOB', 'BRL', 'BWP', 'BYN', 'BZD', 'CDF', 'CHF', 'CLP', 'CNY', 'COP', 'CRC', 'CVE', 'CZK', 'DJF', 'DKK', 'DOP', 'DZD', 'EEK', 'EGP', 'ERN', 'ETB', 'GBP', 'GEL', 'GHS', 'GNF', 'GTQ', 'HKD', 'HNL', 'HRK', 'HUF', 'IDR', 'ILS', 'INR', 'IQD', 'IRR', 'ISK', 'JMD', 'JOD', 'JPY', 'KES', 'KHR', 'KMF', 'KRW', 'KWD', 'KZT', 'LBP', 'LKR', 'LTL', 'LVL', 'LYD', 'MAD', 'MDL', 'MGA', 'MKD', 'MMK', 'MOP', 'MUR', 'MXN', 'MYR', 'MZN', 'NAD', 'NGN', 'NIO', 'NOK', 'NPR', 'NZD', 'OMR', 'PAB', 'PEN', 'PHP', 'PKR', 'PLN', 'PYG', 'QAR', 'RON', 'RSD', 'RUB', 'RWF', 'SAR', 'SDG', 'SEK', 'SGD', 'SOS', 'SYP', 'THB', 'TND', 'TOP', 'TRY', 'TTD', 'TWD', 'TZS', 'UAH', 'UGX', 'UYU', 'UZS', 'VEF', 'VND', 'XAF', 'XOF', 'YER', 'ZAR', 'ZMK', 'ZWL')`)
		await queryRunner.query(`CREATE TYPE "user_payment_paymentstatus_enum" AS ENUM('due', 'paid', 'underway')`)
		await queryRunner.query(`CREATE TABLE "user_payment" ("id" SERIAL NOT NULL, "currency" "user_payment_currency_enum" NOT NULL, "amount" numeric(20,10) NOT NULL, "paymentStatus" "user_payment_paymentstatus_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "dueAt" date NOT NULL, "paidAt" date, "userIdId" integer NOT NULL, CONSTRAINT "PK_57db108902981ff1f5fcc2f2336" PRIMARY KEY ("id"))`)
		await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "name" character varying(20) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_065d4d8f3b5adb4a08841eae3c8" UNIQUE ("name"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`)
		await queryRunner.query(`CREATE TYPE "payment_record_recordkind_enum" AS ENUM('creation', 'payment', 'completion')`)
		await queryRunner.query(`CREATE TABLE "payment_record" ("id" SERIAL NOT NULL, "recordKind" "payment_record_recordkind_enum" NOT NULL, "amount" numeric(20,10) NOT NULL, "userIdId" integer NOT NULL, "userPaymentIdId" integer NOT NULL, CONSTRAINT "PK_d0ffdac274576b592e87ebc3b28" PRIMARY KEY ("id"))`)
		await queryRunner.query(`ALTER TABLE "user_payment" ADD CONSTRAINT "FK_506c84ef37a2eb36afe357cd8e1" FOREIGN KEY ("userIdId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
		await queryRunner.query(`ALTER TABLE "payment_record" ADD CONSTRAINT "FK_55dc2a71bcc5534e9fd7f15e4f8" FOREIGN KEY ("userIdId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
		await queryRunner.query(`ALTER TABLE "payment_record" ADD CONSTRAINT "FK_c3c614695af75b42d7ad6552aa7" FOREIGN KEY ("userPaymentIdId") REFERENCES "user_payment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "payment_record" DROP CONSTRAINT "FK_c3c614695af75b42d7ad6552aa7"`)
		await queryRunner.query(`ALTER TABLE "payment_record" DROP CONSTRAINT "FK_55dc2a71bcc5534e9fd7f15e4f8"`)
		await queryRunner.query(`ALTER TABLE "user_payment" DROP CONSTRAINT "FK_506c84ef37a2eb36afe357cd8e1"`)
		await queryRunner.query(`DROP TABLE "payment_record"`)
		await queryRunner.query(`DROP TYPE "payment_record_recordkind_enum"`)
		await queryRunner.query(`DROP TABLE "user"`)
		await queryRunner.query(`DROP TABLE "user_payment"`)
		await queryRunner.query(`DROP TYPE "user_payment_paymentstatus_enum"`)
		await queryRunner.query(`DROP TYPE "user_payment_currency_enum"`)
	}

}
