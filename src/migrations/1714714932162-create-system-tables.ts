import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSystemTables1714714932162 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    /** Create system schema and table */
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "system";`);
    await queryRunner.query(
      `CREATE TABLE "system"."countries" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, "code" character varying(15) NOT NULL, "sign" character varying, "is_available" boolean DEFAULT false, CONSTRAINT "pk_countries__id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "system"."fcm_tokens" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "token" character varying(4096) NOT NULL, "type" character varying(15) NOT NULL, "device_id" character varying(255) NOT NULL, "user_id" character varying NOT NULL, CONSTRAINT "uq_fcm_tokens__user_id_device_id" UNIQUE ("user_id", "device_id"), CONSTRAINT "pk_fcm_tokens__id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "users"."users" ADD "country_id" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "users"."users" ADD CONSTRAINT "fk_users__countries__country_id__id" FOREIGN KEY ("country_id") REFERENCES "system"."countries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "system"."fcm_tokens" ADD CONSTRAINT "fk_fcm_tokens__users__user_id__id" FOREIGN KEY ("user_id") REFERENCES "users"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "system"."fcm_tokens" DROP CONSTRAINT "fk_fcm_tokens__users__user_id__id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users"."users" DROP CONSTRAINT "fk_users__countries__country_id__id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users"."users" DROP COLUMN "country_id"`,
    );
    await queryRunner.query(`DROP TABLE "system"."fcm_tokens"`);
    await queryRunner.query(`DROP TABLE "system"."countries"`);
    await queryRunner.query(`DROP SCHEMA "system" CASCADE;`);
  }
}
