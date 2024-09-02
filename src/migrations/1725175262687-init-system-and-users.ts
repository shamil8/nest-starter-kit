import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSystemAndUsers1725175262687 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    /** Create users and system schemas */
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "users";`);
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "system";`);

    await queryRunner.query(
      `CREATE TABLE "system"."countries" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, "code" character varying(15) NOT NULL, "sign" character varying, "is_available" boolean NOT NULL DEFAULT false, CONSTRAINT "pk_countries__id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_countries__created_at_id" ON "system"."countries" ("created_at", "id") `,
    );

    await queryRunner.query(
      `CREATE TABLE "users"."users" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "email" character varying NOT NULL, "username" character varying NOT NULL, "first_name" character varying, "last_name" character varying, "role" character varying(55) NOT NULL, "lang_code" character varying(3) NOT NULL DEFAULT 'EN', "is_email_verified" boolean NOT NULL DEFAULT false, "password" character varying NOT NULL, "country_id" character varying, CONSTRAINT "uq_users__email" UNIQUE ("email"), CONSTRAINT "uq_users__username" UNIQUE ("username"), CONSTRAINT "pk_users__id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_users__created_at_id" ON "users"."users" ("created_at", "id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "system"."fcm_tokens" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "token" text NOT NULL, "type" character varying(15) NOT NULL, "device_id" character varying(255) NOT NULL, "user_id" character varying NOT NULL, CONSTRAINT "uq_fcm_tokens__user_id_device_id" UNIQUE ("user_id", "device_id"), CONSTRAINT "pk_fcm_tokens__id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_fcm_tokens__created_at_id" ON "system"."fcm_tokens" ("created_at", "id") `,
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
      `DROP INDEX "system"."idx_fcm_tokens__created_at_id"`,
    );
    await queryRunner.query(`DROP TABLE "system"."fcm_tokens"`);
    await queryRunner.query(`DROP INDEX "users"."idx_users__created_at_id"`);
    await queryRunner.query(`DROP TABLE "users"."users"`);
    await queryRunner.query(
      `DROP INDEX "system"."idx_countries__created_at_id"`,
    );
    await queryRunner.query(`DROP TABLE "system"."countries"`);

    /** Drop users and system schemas */
    await queryRunner.query(`DROP SCHEMA "users" CASCADE;`);
    await queryRunner.query(`DROP SCHEMA "system" CASCADE;`);
  }
}
