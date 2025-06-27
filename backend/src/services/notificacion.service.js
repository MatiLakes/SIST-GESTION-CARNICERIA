"use strict";

import { AppDataSource } from "../config/configDb.js";
import PagoPendiente from "../entity/PagoPendiente.entity.js";
import Pedido from "../entity/pedido.entity.js";
import Subproducto from "../entity/subproducto.entity.js";
import { Between } from "typeorm";

export const notificacionService = {
  async obtenerNotificacionesPagosProximos(dias = 3) {
    const pagoPendienteRepository = AppDataSource.getRepository(PagoPendiente);
    const hoy = new Date();
    const fechaLimite = new Date();
    fechaLimite.setDate(hoy.getDate() + dias);

    // Buscar pagos pendientes próximos a vencer
    const pagosProximos = await pagoPendienteRepository.find({
      where: {
        estado: "Pendiente",
        fechaLimite: Between(hoy, fechaLimite)
      },
      relations: ["cliente"]
    });
    // Formatear fechas
    return pagosProximos.map(pago => ({
      ...pago,
      fechaLimite: pago.fechaLimite ? new Date(pago.fechaLimite).toLocaleDateString('es-ES') : null
    }));
  },

  async obtenerNotificacionesPedidosProximos(dias = 3) {
    const pedidoRepository = AppDataSource.getRepository(Pedido);
    const hoy = new Date();
    const fechaLimite = new Date();
    fechaLimite.setDate(hoy.getDate() + dias);
    const pedidosProximos = await pedidoRepository.find({
      where: {
        fecha_entrega: Between(hoy, fechaLimite)
      }
    });
    // Formatear fechas
    return pedidosProximos.map(pedido => ({
      ...pedido,
      fecha_entrega: pedido.fecha_entrega ? new Date(pedido.fecha_entrega).toLocaleDateString('es-ES') : null
    }));
  }

}