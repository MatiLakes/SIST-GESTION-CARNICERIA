import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddTipoSubproductoToMerma1750294100000 {
    name = 'AddTipoSubproductoToMerma1750294100000'

    async up(queryRunner) {
        await queryRunner.addColumn("mermas", new TableColumn({
            name: "tipoSubproducto",
            type: "varchar",
            length: "100",
            isNullable: true
        }));
    }

    async down(queryRunner) {
        await queryRunner.dropColumn("mermas", "tipoSubproducto");
    }
}
