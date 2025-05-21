import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFulltextIndexToBooks1746593516238 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE book ADD FULLTEXT(title, author)
          `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
