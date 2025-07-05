"use strict";

export class FixMermaConstraint1750294200000 {
  async up(queryRunner) {
    // Eliminar la restricción existente
    await queryRunner.query(`
      ALTER TABLE mermas 
      DROP CONSTRAINT IF EXISTS tipo_producto_merma_valido;
    `);

    // Crear la nueva restricción corregida
    await queryRunner.query(`
      ALTER TABLE mermas 
      ADD CONSTRAINT tipo_producto_merma_valido 
      CHECK (
        (tipo_producto_merma = 'producto' AND producto_id IS NOT NULL AND recepcion_stock_id IS NOT NULL AND animal_corte_id IS NULL AND subproducto_id IS NULL AND tipo_corte_carne IS NULL AND tipo_subproducto IS NULL) OR
        (tipo_producto_merma = 'carne' AND animal_corte_id IS NOT NULL AND tipo_corte_carne IS NOT NULL AND producto_id IS NULL AND recepcion_stock_id IS NULL AND subproducto_id IS NULL AND tipo_subproducto IS NULL) OR
        (tipo_producto_merma = 'subproducto' AND subproducto_id IS NOT NULL AND tipo_subproducto IS NOT NULL AND producto_id IS NULL AND recepcion_stock_id IS NULL AND animal_corte_id IS NULL AND tipo_corte_carne IS NULL)
      );
    `);
  }

  async down(queryRunner) {
    // Revertir a la restricción anterior
    await queryRunner.query(`
      ALTER TABLE mermas 
      DROP CONSTRAINT IF EXISTS tipo_producto_merma_valido;
    `);

    await queryRunner.query(`
      ALTER TABLE mermas 
      ADD CONSTRAINT tipo_producto_merma_valido 
      CHECK (
        (tipo_producto_merma = 'producto' AND producto_id IS NOT NULL AND recepcion_stock_id IS NOT NULL) OR
        (tipo_producto_merma = 'carne' AND animal_corte_id IS NOT NULL AND tipo_corte_carne IS NOT NULL) OR
        (tipo_producto_merma = 'subproducto' AND subproducto_id IS NOT NULL AND recepcion_stock_id IS NOT NULL)
      );
    `);
  }
}
