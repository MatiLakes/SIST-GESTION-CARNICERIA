"use strict";

import { AppDataSource } from "../config/configDb.js";
import Notificacion from "../entity/notificacion.entity.js";
import PagoPendiente from "../entity/PagoPendiente.entity.js";
import Pedido from "../entity/pedido.entity.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";
import { Between } from "typeorm";

// Utilidad para formatear fechas sin desfase de zona horaria
function formatearFechaLocal(fecha) {
  if (!fecha) return '';
  // Si es string tipo 'YYYY-MM-DD', parsear manualmente
  if (typeof fecha === 'string' && /^\d{4}-\d{2}-\d{2}/.test(fecha)) {
    const [year, month, day] = fecha.split('T')[0].split('-');
    return `${day}-${month}-${year}`;
  }
  // Si es Date o timestamp
  const d = new Date(fecha);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${day}-${month}-${year}`;
}

// Utilidad para comparar si dos fechas son el mismo día (ignorando hora)
function esHoy(fecha) {
  if (!fecha) return false;
  // Si es string tipo 'YYYY-MM-DD', parsear manualmente
  let year, month, day;
  if (typeof fecha === 'string' && /^\d{4}-\d{2}-\d{2}/.test(fecha)) {
    [year, month, day] = fecha.split('T')[0].split('-');
    year = Number(year);
    month = Number(month);
    day = Number(day);
  } else {
    const d = new Date(fecha);
    year = d.getFullYear();
    month = d.getMonth() + 1;
    day = d.getDate();
  }
  const hoy = new Date();
  return (
    hoy.getFullYear() === year &&
    hoy.getMonth() + 1 === month &&
    hoy.getDate() === day
  );
}

export const notificacionController = {
  async obtenerNotificaciones(req, res) {
    try {
      // Buscar pagos pendientes próximos a vencer (ejemplo: próximos 3 días)
      const pagoPendienteRepository = AppDataSource.getRepository(PagoPendiente);
      const hoy = new Date();
      const tresDiasDespues = new Date();
      tresDiasDespues.setDate(hoy.getDate() + 1);

      const pagosProximos = await pagoPendienteRepository.find({
        where: {
          estado: "Pendiente",
          fechaLimite: Between(hoy, tresDiasDespues)
        },
        relations: ["cliente"]
      });

      // Buscar pedidos próximos a entregar (próximos 3 días)
      const pedidoRepository = AppDataSource.getRepository(Pedido);
      const pedidosProximos = await pedidoRepository.find({
        where: {
          fecha_entrega: Between(hoy, tresDiasDespues)
        }
      });

      // Notificaciones de pedidos próximos a entregar
      let notificacionesPedidos = pedidosProximos.map(pedido => ({
        tipo: "pedido_entrega",
        mensaje: esHoy(pedido.fecha_entrega)
          ? `El pedido para ${pedido.cliente_nombre} debe entregarse hoy`
          : `El pedido para ${pedido.cliente_nombre} debe entregarse el ${formatearFechaLocal(pedido.fecha_entrega)}`,
        entityType: "Pedido",
        entityId: pedido.id,
        fechaEntrega: formatearFechaLocal(pedido.fecha_entrega),
        leida: false,
        creadaEn: new Date(),
      }));

      // Ordenar: primero los pedidos que vencen hoy
      notificacionesPedidos = [
        ...notificacionesPedidos.filter(n => esHoy(pedidosProximos.find(p => p.id === n.entityId)?.fecha_entrega)),
        ...notificacionesPedidos.filter(n => !esHoy(pedidosProximos.find(p => p.id === n.entityId)?.fecha_entrega))
      ];

      // Generar notificaciones en memoria (no guardar en BD, solo devolver)
      // Unir notificaciones de pagos y pedidos
      const notificaciones = [
        ...pagosProximos.map(pago => ({
          tipo: "pago_pendiente",
          mensaje: esHoy(pago.fechaLimite)
            ? `El pago de ${pago.cliente?.razonSocial || pago.cliente?.nombre || 'Cliente'} vence hoy`
            : `El pago de ${pago.cliente?.razonSocial || pago.cliente?.nombre || 'Cliente'} vence el ${formatearFechaLocal(pago.fechaLimite)}`,
          entityType: "PagoPendiente",
          entityId: pago.id,
          fechaLimite: formatearFechaLocal(pago.fechaLimite),
          leida: false,
          creadaEn: new Date(),
        })),
        ...notificacionesPedidos
      ];

      handleSuccess(res, 200, "Notificaciones generadas correctamente.", notificaciones);
    } catch (error) {
      handleErrorServer(res, 500, error.message);
    }
  },
};
