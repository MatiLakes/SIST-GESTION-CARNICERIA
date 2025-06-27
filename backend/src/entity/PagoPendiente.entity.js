"use strict";

import { EntitySchema } from "typeorm";
import Cliente from "./Cliente.entity.js";

const PagoPendienteSchema = new EntitySchema({
  name: "PagoPendiente",
  tableName: "pagos_pendientes",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    monto: {
      type: "int",
      nullable: false,
    },
    fechaPedido: {
      type: "date",
      nullable: false,
    },
    fechaLimite: {
      type: "date",
      nullable: false,
    },
    estado: {
      type: "enum",
      enum: ["Pendiente", "Pagado", "Vencido"],
      nullable: false,
    },
    factura: {
        type: "varchar",
        length: 255,
        nullable: true,
    }

  },
  relations: {
    cliente: {
      type: "many-to-one",
      target: "Cliente",
      joinColumn: {
        name: "clienteId",
        referencedColumnName: "id",
      },
      nullable: false,
      eager: true,  
    }
  }
});

export default PagoPendienteSchema;
