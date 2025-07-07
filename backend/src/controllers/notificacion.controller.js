"use strict";

import { AppDataSource } from "../config/configDb.js";
import Notificacion from "../entity/notificacion.entity.js";
import PagoPendiente from "../entity/PagoPendiente.entity.js";
import Pedido from "../entity/pedido.entity.js";
import RecepcionStock from "../entity/RecepcionStock.entity.js";
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

// Utilidad para calcular días hasta fecha de vencimiento
function diasHastaVencimiento(fecha) {
  if (!fecha) return null;
  
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  
  let fechaVenc;
  if (typeof fecha === 'string' && /^\d{4}-\d{2}-\d{2}/.test(fecha)) {
    const [year, month, day] = fecha.split('T')[0].split('-');
    fechaVenc = new Date(Number(year), Number(month) - 1, Number(day));
  } else {
    fechaVenc = new Date(fecha);
    fechaVenc.setHours(0, 0, 0, 0);
  }
  
  const diferencia = fechaVenc - hoy;
  return Math.ceil(diferencia / (1000 * 60 * 60 * 24));
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
      
      // Buscar productos próximos a vencer (próximos 3 días)
      const recepcionStockRepository = AppDataSource.getRepository(RecepcionStock);
      const tresDiasProductos = new Date();
      tresDiasProductos.setDate(hoy.getDate() + 3);
      
      const productosProximosVencer = await recepcionStockRepository.find({
        where: {
          fechaVencimiento: Between(hoy, tresDiasProductos)
        },
        relations: ["producto"]
      });

      // Notificaciones de pedidos próximos a entregar
      let notificacionesPedidos = pedidosProximos.map(pedido => {
        const diasHasta = diasHastaVencimiento(pedido.fecha_entrega);
        let mensaje;
        
        if (diasHasta === 0) {
          mensaje = `El pedido para ${pedido.cliente_nombre} debe entregarse hoy`;
        } else if (diasHasta === 1) {
          mensaje = `El pedido para ${pedido.cliente_nombre} debe entregarse mañana`;
        } else {
          mensaje = `El pedido para ${pedido.cliente_nombre} debe entregarse el ${formatearFechaLocal(pedido.fecha_entrega)}`;
        }
        
        return {
          tipo: "pedido_entrega",
          mensaje: mensaje,
          entityType: "Pedido",
          entityId: pedido.id,
          fechaEntrega: formatearFechaLocal(pedido.fecha_entrega),
          leida: false,
          creadaEn: new Date(),
        };
      });

      // Ordenar: primero los pedidos que vencen hoy
      notificacionesPedidos = [
        ...notificacionesPedidos.filter(n => esHoy(pedidosProximos.find(p => p.id === n.entityId)?.fecha_entrega)),
        ...notificacionesPedidos.filter(n => !esHoy(pedidosProximos.find(p => p.id === n.entityId)?.fecha_entrega))
      ];

      // Notificaciones de productos próximos a vencer
      const notificacionesProductos = productosProximosVencer.map(recepcion => {
        const dias = diasHastaVencimiento(recepcion.fechaVencimiento);
        let mensaje;
        
        if (dias < 0) {
          mensaje = `El producto ${recepcion.producto?.nombre || 'Producto'} venció hace ${Math.abs(dias)} día(s)`;
        } else if (dias === 0) {
          mensaje = `El producto ${recepcion.producto?.nombre || 'Producto'} vence hoy`;
        } else if (dias === 1) {
          mensaje = `El producto ${recepcion.producto?.nombre || 'Producto'} vence mañana`;
        } else {
          mensaje = `El producto ${recepcion.producto?.nombre || 'Producto'} vence en ${dias} días`;
        }
        
        return {
          tipo: "producto_vencimiento",
          mensaje: mensaje,
          entityType: "RecepcionStock",
          entityId: recepcion.id,
          fechaVencimiento: formatearFechaLocal(recepcion.fechaVencimiento),
          cantidad: recepcion.cantidad,
          productoId: recepcion.producto?.id,
          productoNombre: recepcion.producto?.nombre,
          leida: false,
          creadaEn: new Date(),
        };
      });
      
      // Ordenar: primero los productos que vencen hoy
      const productosPrioritarios = notificacionesProductos.filter(n => 
        esHoy(productosProximosVencer.find(p => p.id === n.entityId)?.fechaVencimiento)
      );
      const productosNoHoy = notificacionesProductos.filter(n => 
        !esHoy(productosProximosVencer.find(p => p.id === n.entityId)?.fechaVencimiento)
      );
      
      const notificacionesProductosOrdenadas = [...productosPrioritarios, ...productosNoHoy];

      // Generar notificaciones en memoria (no guardar en BD, solo devolver)
      // Unir notificaciones de pagos, pedidos y productos
      const notificaciones = [
        ...pagosProximos.map(pago => {
          const diasHasta = diasHastaVencimiento(pago.fechaLimite);
          let mensaje;
          
          if (diasHasta === 0) {
            mensaje = `El pago de ${pago.cliente?.razonSocial || pago.cliente?.nombre || 'Cliente'} vence hoy`;
          } else if (diasHasta === 1) {
            mensaje = `El pago de ${pago.cliente?.razonSocial || pago.cliente?.nombre || 'Cliente'} vence mañana`;
          } else {
            mensaje = `El pago de ${pago.cliente?.razonSocial || pago.cliente?.nombre || 'Cliente'} vence el ${formatearFechaLocal(pago.fechaLimite)}`;
          }
          
          return {
            tipo: "pago_pendiente",
            mensaje: mensaje,
            entityType: "PagoPendiente",
            entityId: pago.id,
            fechaLimite: formatearFechaLocal(pago.fechaLimite),
            leida: false,
            creadaEn: new Date(),
          };
        }),
        ...notificacionesPedidos,
        ...notificacionesProductosOrdenadas
      ];

      handleSuccess(res, 200, "Notificaciones generadas correctamente.", notificaciones);
    } catch (error) {
      handleErrorServer(res, 500, error.message);
    }
  },
};
