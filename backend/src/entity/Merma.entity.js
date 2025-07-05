"use strict";
import { EntitySchema } from "typeorm";

const MermaSchema = new EntitySchema({
  name: "Merma",
  tableName: "mermas",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
      unique: true,
    },
    fechaRegistro: {
      type: "date",
      nullable: false,
      default: () => "CURRENT_DATE",
    },
    tipoProductoMerma: {
      type: "enum",
      enum: ["carne", "producto", "subproducto"],
      nullable: false,
    },
    cantidadPerdida: {
      type: "double precision",
      nullable: false,
    },
    causa: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    detalles: {
      type: "text",
      nullable: true,
    },
    tipoCorteCarne: {
      type: "varchar",
      length: 100,
      nullable: true,
    },
    tipoSubproducto: {
      type: "varchar",
      length: 100,
      nullable: true,
    },
  },
  relations: {
    producto: {
      type: "many-to-one",
      target: "Producto",
      joinColumn: {
        name: "productoId",
        referencedColumnName: "id",
      },
      nullable: true,
    },
    subproducto: {
      type: "many-to-one",
      target: "Subproducto",  // Cambiado de "SubProducto" a "Subproducto"
      joinColumn: {
        name: "subproductoId",
        referencedColumnName: "id",
      },
      nullable: true,
    },
    animalCorte: {
      type: "many-to-one",
      target: "AnimalCorte",
      joinColumn: {
        name: "animalCorteId",
        referencedColumnName: "id",
      },
      nullable: true,
    },
    animalVara: {
      type: "many-to-one",
      target: "AnimalVara",
      joinColumn: {
        name: "animalVaraId",
        referencedColumnName: "id",
      },
      nullable: true,
    },
    recepcionStock: {
      type: "many-to-one",
      target: "RecepcionStock",
      joinColumn: {
        name: "recepcionStockId",
        referencedColumnName: "id",
      },
      nullable: true,
      eager: true,
    },
    personal: {
      type: "many-to-one",
      target: "Personal",
      joinColumn: {
        name: "personalId",
        referencedColumnName: "id",
      },
      nullable: false,
      eager: true,
    },
  },
  checks: [
    {
      expression: "\"cantidadPerdida\" > 0",
      name: "cantidad_perdida_positiva",
    },
    {
      expression: "\"fechaRegistro\" <= CURRENT_DATE",
      name: "fecha_registro_valida",
    },
    {
      expression: "(\"tipoProductoMerma\" = 'carne' AND \"animalCorteId\" IS NOT NULL AND \"productoId\" IS NULL AND \"subproductoId\" IS NULL AND \"recepcionStockId\" IS NULL) OR " +
                "(\"tipoProductoMerma\" = 'producto' AND \"productoId\" IS NOT NULL AND \"recepcionStockId\" IS NOT NULL AND \"animalCorteId\" IS NULL AND \"animalVaraId\" IS NULL AND \"subproductoId\" IS NULL) OR " +
                "(\"tipoProductoMerma\" = 'subproducto' AND \"subproductoId\" IS NOT NULL AND \"tipoSubproducto\" IS NOT NULL AND \"recepcionStockId\" IS NULL AND \"animalCorteId\" IS NULL AND \"animalVaraId\" IS NULL AND \"productoId\" IS NULL)",
      name: "tipo_producto_merma_valido",
    },
  ],
});

export default MermaSchema;