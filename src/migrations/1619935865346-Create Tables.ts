import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateTables1619935865346 implements MigrationInterface {
    name = 'CreateTables1619935865346'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "payment_record_recordkind_enum" AS ENUM('creation', 'payment', 'completion')`);
        await queryRunner.query(`CREATE TYPE "payment_record_currency_enum" AS ENUM('USD', 'CAD', 'EUR', 'AED', 'AFN', 'ALL', 'AMD', 'ARS', 'AUD', 'AZN', 'BAM', 'BDT', 'BGN', 'BHD', 'BIF', 'BND', 'BOB', 'BRL', 'BWP', 'BYN', 'BZD', 'CDF', 'CHF', 'CLP', 'CNY', 'COP', 'CRC', 'CVE', 'CZK', 'DJF', 'DKK', 'DOP', 'DZD', 'EEK', 'EGP', 'ERN', 'ETB', 'GBP', 'GEL', 'GHS', 'GNF', 'GTQ', 'HKD', 'HNL', 'HRK', 'HUF', 'IDR', 'ILS', 'INR', 'IQD', 'IRR', 'ISK', 'JMD', 'JOD', 'JPY', 'KES', 'KHR', 'KMF', 'KRW', 'KWD', 'KZT', 'LBP', 'LKR', 'LTL', 'LVL', 'LYD', 'MAD', 'MDL', 'MGA', 'MKD', 'MMK', 'MOP', 'MUR', 'MXN', 'MYR', 'MZN', 'NAD', 'NGN', 'NIO', 'NOK', 'NPR', 'NZD', 'OMR', 'PAB', 'PEN', 'PHP', 'PKR', 'PLN', 'PYG', 'QAR', 'RON', 'RSD', 'RUB', 'RWF', 'SAR', 'SDG', 'SEK', 'SGD', 'SOS', 'SYP', 'THB', 'TND', 'TOP', 'TRY', 'TTD', 'TWD', 'TZS', 'UAH', 'UGX', 'UYU', 'UZS', 'VEF', 'VND', 'XAF', 'XOF', 'YER', 'ZAR', 'ZMK', 'ZWL')`);
        await queryRunner.query(`CREATE TABLE "payment_record" ("paymentRecordId" SERIAL NOT NULL, "recordKind" "payment_record_recordkind_enum" NOT NULL, "amount" numeric(20,10) NOT NULL, "currency" "payment_record_currency_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userIdUserId" integer NOT NULL, "paymentIdPaymentId" integer NOT NULL, CONSTRAINT "PK_1ac63691701e076a127f067c236" PRIMARY KEY ("paymentRecordId"))`);
        await queryRunner.query(`CREATE TABLE "user" ("userId" SERIAL NOT NULL, "name" character varying(20) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_065d4d8f3b5adb4a08841eae3c8" UNIQUE ("name"), CONSTRAINT "PK_d72ea127f30e21753c9e229891e" PRIMARY KEY ("userId"))`);
        await queryRunner.query(`CREATE TYPE "payment_currency_enum" AS ENUM('USD', 'CAD', 'EUR', 'AED', 'AFN', 'ALL', 'AMD', 'ARS', 'AUD', 'AZN', 'BAM', 'BDT', 'BGN', 'BHD', 'BIF', 'BND', 'BOB', 'BRL', 'BWP', 'BYN', 'BZD', 'CDF', 'CHF', 'CLP', 'CNY', 'COP', 'CRC', 'CVE', 'CZK', 'DJF', 'DKK', 'DOP', 'DZD', 'EEK', 'EGP', 'ERN', 'ETB', 'GBP', 'GEL', 'GHS', 'GNF', 'GTQ', 'HKD', 'HNL', 'HRK', 'HUF', 'IDR', 'ILS', 'INR', 'IQD', 'IRR', 'ISK', 'JMD', 'JOD', 'JPY', 'KES', 'KHR', 'KMF', 'KRW', 'KWD', 'KZT', 'LBP', 'LKR', 'LTL', 'LVL', 'LYD', 'MAD', 'MDL', 'MGA', 'MKD', 'MMK', 'MOP', 'MUR', 'MXN', 'MYR', 'MZN', 'NAD', 'NGN', 'NIO', 'NOK', 'NPR', 'NZD', 'OMR', 'PAB', 'PEN', 'PHP', 'PKR', 'PLN', 'PYG', 'QAR', 'RON', 'RSD', 'RUB', 'RWF', 'SAR', 'SDG', 'SEK', 'SGD', 'SOS', 'SYP', 'THB', 'TND', 'TOP', 'TRY', 'TTD', 'TWD', 'TZS', 'UAH', 'UGX', 'UYU', 'UZS', 'VEF', 'VND', 'XAF', 'XOF', 'YER', 'ZAR', 'ZMK', 'ZWL')`);
        await queryRunner.query(`CREATE TYPE "payment_paymentstatus_enum" AS ENUM('due', 'paid', 'underway')`);
        await queryRunner.query(`CREATE TABLE "payment" ("paymentId" SERIAL NOT NULL, "currency" "payment_currency_enum" NOT NULL, "amount" numeric(20,10) NOT NULL, "paymentStatus" "payment_paymentstatus_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "dueAt" TIMESTAMP NOT NULL, "paidAt" TIMESTAMP, "deleted" boolean NOT NULL DEFAULT false, "sentDueReminder" boolean NOT NULL DEFAULT false, "userIdUserId" integer NOT NULL, CONSTRAINT "PK_67ee4523b649947b6a7954dc673" PRIMARY KEY ("paymentId"))`);
        await queryRunner.query(`ALTER TABLE "payment_record" ADD CONSTRAINT "FK_5b3bacfd5464809640c445f6041" FOREIGN KEY ("userIdUserId") REFERENCES "user"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment_record" ADD CONSTRAINT "FK_8eb4b14034af189b703b7059613" FOREIGN KEY ("paymentIdPaymentId") REFERENCES "payment"("paymentId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "FK_28e1573412bdd5009714ac2952e" FOREIGN KEY ("userIdUserId") REFERENCES "user"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_28e1573412bdd5009714ac2952e"`);
        await queryRunner.query(`ALTER TABLE "payment_record" DROP CONSTRAINT "FK_8eb4b14034af189b703b7059613"`);
        await queryRunner.query(`ALTER TABLE "payment_record" DROP CONSTRAINT "FK_5b3bacfd5464809640c445f6041"`);
        await queryRunner.query(`DROP TABLE "payment"`);
        await queryRunner.query(`DROP TYPE "payment_paymentstatus_enum"`);
        await queryRunner.query(`DROP TYPE "payment_currency_enum"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "payment_record"`);
        await queryRunner.query(`DROP TYPE "payment_record_currency_enum"`);
        await queryRunner.query(`DROP TYPE "payment_record_recordkind_enum"`);
    }

}
