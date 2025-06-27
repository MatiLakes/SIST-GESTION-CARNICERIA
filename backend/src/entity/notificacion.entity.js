"use strict";

import { EntitySchema } from "typeorm";

const NotificacionSchema = new EntitySchema({
  name: "Notificacion",
  tableName: "notificaciones",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    tipo: {
      type: "varchar",
      length: 50,
      nullable: false, // Ej: 'pago_pendiente', 'nuevo_pedido', etc.
    },
    mensaje: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    entityType: {
      type: "varchar",
      length: 50,
      nullable: true, // Ej: 'PagoPendiente', 'Pedido', etc.
    },
    entityId: {
      type: "int",
      nullable: true, // ID del objeto relacionado
    },
    usuarioId: {
      type: "int",
      nullable: true, // Si la notificación es para un usuario específico
    },
    fechaLimite: {
      type: "date",
      nullable: true,
    },
    leida: {
      type: "boolean",
      default: false,
    },
    creadaEn: {
      type: "timestamp",
      createDate: true,
      default: () => "CURRENT_TIMESTAMP",
    },
  },
});

export default NotificacionSchema;
