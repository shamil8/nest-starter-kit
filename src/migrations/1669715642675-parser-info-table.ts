import { MigrationInterface, QueryRunner } from 'typeorm';

export class ParserInfoTable1669715642675 implements MigrationInterface {
  name = 'parser-info-table1669715642675';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "parser_infos" ("address" character varying NOT NULL, "net" character varying NOT NULL, "last_block" numeric NOT NULL DEFAULT '0', CONSTRAINT "pk_parser_infos__address_net" PRIMARY KEY ("address", "net"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "parser_infos"`);
  }
}
