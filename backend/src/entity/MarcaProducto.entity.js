"use strict";

import { EntitySchema } from "typeorm";

const MarcaProductoSchema = new EntitySchema({
  name: "MarcaProducto",
  tableName: "marcas_productos",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    nombre: {
      type: "varchar",
      length: 50,
      unique: true,
      nullable: false,
    },
  },
});

export default MarcaProductoSchema;
