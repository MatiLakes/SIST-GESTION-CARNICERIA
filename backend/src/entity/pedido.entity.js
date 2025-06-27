"use strict";

import { EntitySchema } from "typeorm";

const PedidoSchema = new EntitySchema({
  name: "Pedido",
  tableName: "pedidos",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    cliente_nombre: {
      type: "varchar",
      length: 100,
      nullable: false,
    },
    telefono_cliente: {
      type: "varchar",
      length: 15,
      nullable: false,
    },
    carnicero_nombre: {
      type: "varchar",
      length: 100,
      nullable: false,
    },
    fecha_entrega: {
      type: "date",
      nullable: false,
      default: () => "CURRENT_DATE",
    },
    productos: {
      type: "text",
      nullable: false,
      comment: "Descripción detallada de los productos solicitados",
    },
    createdAt: {
      type: "timestamp with time zone",
      default: () => "CURRENT_TIMESTAMP",
      nullable: false,
    },
    updatedAt: {
      type: "timestamp with time zone",
      default: () => "CURRENT_TIMESTAMP",
      onUpdate: "CURRENT_TIMESTAMP",
      nullable: false,
    },
  },
});

export default PedidoSchema;
