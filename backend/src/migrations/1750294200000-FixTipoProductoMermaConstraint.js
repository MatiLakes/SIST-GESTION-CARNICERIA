"use strict";

/**
 * Migration to fix the tipo_producto_merma_valido constraint
 * to allow subproducts without recepcionStock
 */
export class FixTipoProductoMermaConstraint1750294200000 {
  async up(queryRunner) {
    // Drop the existing constraint
    await queryRunner.query(`
      ALTER TABLE "mermas" 
      DROP CONSTRAINT IF EXISTS "tipo_producto_merma_valido"
    `);

    // Add the new constraint that allows subproducts without recepcionStockId
    await queryRunner.query(`
      ALTER TABLE "mermas" 
      ADD CONSTRAINT "tipo_producto_merma_valido" CHECK (
        (
          "tipoProductoMerma" = 'carne' AND 
          "animalCorteId" IS NOT NULL AND 
          "productoId" IS NULL AND 
          "subproductoId" IS NULL AND 
          "recepcionStockId" IS NULL
        ) OR (
          "tipoProductoMerma" = 'producto' AND 
          "productoId" IS NOT NULL AND 
          "recepcionStockId" IS NOT NULL AND 
          "animalCorteId" IS NULL AND 
          "animalVaraId" IS NULL AND 
          "subproductoId" IS NULL
        ) OR (
          "tipoProductoMerma" = 'subproducto' AND 
          "subproductoId" IS NOT NULL AND 
          "tipoSubproducto" IS NOT NULL AND
          "recepcionStockId" IS NULL AND 
          "animalCorteId" IS NULL AND 
          "animalVaraId" IS NULL AND 
          "productoId" IS NULL
        )
      )
    `);
  }

  async down(queryRunner) {
    // Drop the new constraint
    await queryRunner.query(`
      ALTER TABLE "mermas" 
      DROP CONSTRAINT IF EXISTS "tipo_producto_merma_valido"
    `);

    // Restore the original constraint
    await queryRunner.query(`
      ALTER TABLE "mermas" 
      ADD CONSTRAINT "tipo_producto_merma_valido" CHECK (
        (
          "tipoProductoMerma" = 'carne' AND 
          "animalCorteId" IS NOT NULL AND 
          "productoId" IS NULL AND 
          "subproductoId" IS NULL AND 
          "recepcionStockId" IS NULL
        ) OR (
          "tipoProductoMerma" = 'producto' AND 
          "productoId" IS NOT NULL AND 
          "recepcionStockId" IS NOT NULL AND 
          "animalCorteId" IS NULL AND 
          "animalVaraId" IS NULL AND 
          "subproductoId" IS NULL
        ) OR (
          "tipoProductoMerma" = 'subproducto' AND 
          "subproductoId" IS NOT NULL AND 
          "recepcionStockId" IS NOT NULL AND 
          "animalCorteId" IS NULL AND 
          "animalVaraId" IS NULL AND 
          "productoId" IS NULL
        )
      )
    `);
  }
}
