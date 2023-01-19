import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1669715141350 implements MigrationInterface {
  name = 'create-user-table1669715141350';

  public async up(queryRunner: QueryRunner): Promise<void> {
    /** Create users schema and table */
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "users";`);
    await queryRunner.query(
      `CREATE TABLE "users"."users" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "id" character varying NOT NULL, "email" character varying NOT NULL, "first_name" character varying, "last_name" character varying, "role" character varying(55) NOT NULL, "password" character varying NOT NULL, CONSTRAINT "pk_users__id" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"."users"`);
    await queryRunner.query(`DROP SCHEMA "users" CASCADE;`);
  }
}
