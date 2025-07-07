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
      // Buscar pagos pendientes próximos a vencer (hoy y mañana)
      const pagoPendienteRepository = AppDataSource.getRepository(PagoPendiente);
      const hoy = new Date();
      const mañana = new Date();
      mañana.setDate(hoy.getDate() + 1);

      const pagosProximos = await pagoPendienteRepository.find({
        where: {
          estado: "Pendiente",
          fechaLimite: Between(hoy, mañana)
        },
        relations: ["cliente"]
      });

      // Buscar pedidos próximos a entregar (hoy y mañana)
      const pedidoRepository = AppDataSource.getRepository(Pedido);
      const pedidosProximos = await pedidoRepository.find({
        where: {
          fecha_entrega: Between(hoy, mañana)
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

      // Generar notificaciones de pagos pendientes
      const notificacionesPagos = pagosProximos.map(pago => {
        const diasHasta = diasHastaVencimiento(pago.fechaLimite);
        
        // Obtener el nombre del cliente con múltiples opciones
        let nombreCliente = 'Cliente sin nombre';
        if (pago.cliente) {
          // Para personas: combinar nombres y apellidos
          if (pago.cliente.nombres && pago.cliente.nombres.trim()) {
            const nombres = pago.cliente.nombres.trim();
            const apellidos = pago.cliente.apellidos ? pago.cliente.apellidos.trim() : '';
            nombreCliente = apellidos ? `${nombres} ${apellidos}` : nombres;
          } 
          // Para empresas: usar razón social
          else if (pago.cliente.razonSocial && pago.cliente.razonSocial.trim()) {
            nombreCliente = pago.cliente.razonSocial.trim();
          } 
          // Como último recurso: usar RUT
          else if (pago.cliente.rut && pago.cliente.rut.trim()) {
            nombreCliente = pago.cliente.rut.trim();
          } 
          // Si no hay nada: usar ID
          else {
            nombreCliente = `Cliente ID: ${pago.cliente.id}`;
          }
        } else {
          nombreCliente = `Pago ID: ${pago.id}`;
        }
        
        let mensaje;
        
        if (diasHasta === 0) {
          mensaje = `El pago de ${nombreCliente} vence hoy`;
        } else if (diasHasta === 1) {
          mensaje = `El pago de ${nombreCliente} vence mañana`;
        } else {
          mensaje = `El pago de ${nombreCliente} vence el ${formatearFechaLocal(pago.fechaLimite)}`;
        }
        
        return {
          tipo: "pago_pendiente",
          mensaje: mensaje,
          entityType: "PagoPendiente",
          entityId: pago.id,
          fechaLimite: formatearFechaLocal(pago.fechaLimite),
          leida: false,
          creadaEn: new Date(),
          prioridad: diasHasta === 0 ? 1 : (diasHasta === 1 ? 2 : 3),
          fechaOrden: pago.fechaLimite
        };
      });

      // Notificaciones de pedidos próximos a entregar
      const notificacionesPedidos = pedidosProximos.map(pedido => {
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
          prioridad: diasHasta === 0 ? 1 : (diasHasta === 1 ? 2 : 3),
          fechaOrden: pedido.fecha_entrega
        };
      });

      // Notificaciones de productos próximos a vencer (solo RecepcionStock a 3 días)
      const notificacionesProductos = productosProximosVencer.map(recepcion => {
        const dias = diasHastaVencimiento(recepcion.fechaVencimiento);
        let mensaje;
        let prioridad;
        
        if (dias < 0) {
          mensaje = `El producto ${recepcion.producto?.nombre || 'Producto'} venció hace ${Math.abs(dias)} día(s)`;
          prioridad = 1; // Vencido = máxima prioridad
        } else if (dias === 0) {
          mensaje = `El producto ${recepcion.producto?.nombre || 'Producto'} vence hoy`;
          prioridad = 1;
        } else if (dias === 1) {
          mensaje = `El producto ${recepcion.producto?.nombre || 'Producto'} vence mañana`;
          prioridad = 2;
        } else {
          mensaje = `El producto ${recepcion.producto?.nombre || 'Producto'} vence en ${dias} días`;
          prioridad = 3;
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
          prioridad: prioridad,
          fechaOrden: recepcion.fechaVencimiento
        };
      });

      // Combinar todas las notificaciones
      const todasNotificaciones = [
        ...notificacionesPagos,
        ...notificacionesPedidos,
        ...notificacionesProductos
      ];

      // Ordenar por prioridad y luego por tipo (pagos primero dentro de cada prioridad)
      todasNotificaciones.sort((a, b) => {
        // Primero ordenar por prioridad (1=hoy, 2=mañana, 3=3días)
        if (a.prioridad !== b.prioridad) {
          return a.prioridad - b.prioridad;
        }
        
        // Dentro de la misma prioridad, pagos pendientes van primero
        const tipoOrden = {
          "pago_pendiente": 1,
          "pedido_entrega": 2,
          "producto_vencimiento": 3
        };
        
        if (tipoOrden[a.tipo] !== tipoOrden[b.tipo]) {
          return tipoOrden[a.tipo] - tipoOrden[b.tipo];
        }
        
        // Si son pagos pendientes del mismo día, ordenar por fecha de vencimiento
        if (a.tipo === "pago_pendiente" && b.tipo === "pago_pendiente" && a.fechaOrden && b.fechaOrden) {
          return new Date(a.fechaOrden) - new Date(b.fechaOrden);
        }
        
        return 0;
      });

      handleSuccess(res, 200, "Notificaciones generadas correctamente.", todasNotificaciones);
    } catch (error) {
      handleErrorServer(res, 500, error.message);
    }
  },
};
