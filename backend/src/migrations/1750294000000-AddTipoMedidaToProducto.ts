import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTipoMedidaToProducto1750294000000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE productos
            ADD COLUMN tipoMedida ENUM('kilos', 'unidades') NOT NULL DEFAULT 'unidades'
            COMMENT 'Tipo de medida del producto: kilos o unidades'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE productos
            DROP COLUMN tipoMedida
        `);
    }
}
