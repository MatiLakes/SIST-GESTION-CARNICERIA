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
    },    precioVenta: {
      type: "decimal",
      precision: 10,
      scale: 2,
      nullable: false,
    },
    fechaVencimiento: {
      type: "date",
      nullable: true,
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
