"use strict";

import { EntitySchema } from "typeorm";

const ProductoSchema = new EntitySchema({
  name: "Producto",
  tableName: "productos",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    nombre: {
      type: "varchar",
      length: 100,
      nullable: false,
    },
    variante: {
      type: "varchar",
      length: 100,
      nullable: true,
    },
    precioVenta: {
      type: "int",
      nullable: false,
    },
    tipoMedida: {
      type: "enum",
      enum: ["kilos", "unidades"],
      default: "unidades",
      nullable: false,
    },
  },
  relations: {
    tipo: {
      type: "many-to-one",
      target: "TipoProducto",
      joinColumn: true,
      nullable: false,
    },
    marca: {
      type: "many-to-one",
      target: "MarcaProducto",
      joinColumn: true,
      nullable: false,
    },
  },
});

export default ProductoSchema;
