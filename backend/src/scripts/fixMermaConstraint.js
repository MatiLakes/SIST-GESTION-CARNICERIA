import { AppDataSource } from "../config/configDb.js";

async function fixMermaConstraint() {
  try {
    await AppDataSource.initialize();
    console.log("Conexión a la base de datos establecida");

    const queryRunner = AppDataSource.createQueryRunner();
    
    // Eliminar la restricción existente
    console.log("Eliminando restricción existente...");
    await queryRunner.query(`
      ALTER TABLE mermas 
      DROP CONSTRAINT IF EXISTS tipo_producto_merma_valido;
    `);

    // Crear la nueva restricción corregida
    console.log("Creando nueva restricción...");
    await queryRunner.query(`
      ALTER TABLE mermas 
      ADD CONSTRAINT tipo_producto_merma_valido 
      CHECK (
        (tipo_producto_merma = 'producto' AND producto_id IS NOT NULL AND recepcion_stock_id IS NOT NULL AND animal_corte_id IS NULL AND subproducto_id IS NULL AND tipo_corte_carne IS NULL AND tipo_subproducto IS NULL) OR
        (tipo_producto_merma = 'carne' AND animal_corte_id IS NOT NULL AND tipo_corte_carne IS NOT NULL AND producto_id IS NULL AND recepcion_stock_id IS NULL AND subproducto_id IS NULL AND tipo_subproducto IS NULL) OR
        (tipo_producto_merma = 'subproducto' AND subproducto_id IS NOT NULL AND tipo_subproducto IS NOT NULL AND producto_id IS NULL AND recepcion_stock_id IS NULL AND animal_corte_id IS NULL AND tipo_corte_carne IS NULL)
      );
    `);

    await queryRunner.release();
    console.log("Restricción actualizada exitosamente");
    
    await AppDataSource.destroy();
    console.log("Conexión cerrada");
  } catch (error) {
    console.error("Error al actualizar la restricción:", error);
    process.exit(1);
  }
}

fixMermaConstraint();
