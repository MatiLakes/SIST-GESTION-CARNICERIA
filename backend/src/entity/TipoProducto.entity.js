"use strict";

import { EntitySchema } from "typeorm";

const TipoProductoSchema = new EntitySchema({
  name: "TipoProducto",
  tableName: "tipos_productos",
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

export default TipoProductoSchema;
