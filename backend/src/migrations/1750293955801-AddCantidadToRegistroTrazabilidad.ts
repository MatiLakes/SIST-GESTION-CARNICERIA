import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCantidadToRegistroTrazabilidad1750293955801 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE registros_trazabilidad
            ADD COLUMN cantidad FLOAT NOT NULL DEFAULT 0
            COMMENT 'Cantidad en kilos de carne molida'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE registros_trazabilidad
            DROP COLUMN cantidad
        `);
    }
}
