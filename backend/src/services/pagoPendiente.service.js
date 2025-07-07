"use strict";

import { AppDataSource } from "../config/configDb.js";
import PagoPendiente from "../entity/PagoPendiente.entity.js";
import Cliente from "../entity/Cliente.entity.js";

export const pagoPendienteService = {
  async crearPagoPendiente(data) {
    try {
      const clienteRepository = AppDataSource.getRepository(Cliente);
      const pagoPendienteRepository = AppDataSource.getRepository(PagoPendiente);

      // Verificar si el cliente existe
      const cliente = await clienteRepository.findOneBy({ id: data.cliente.id });
      if (!cliente) {
        return [null, `El cliente con ID ${data.cliente.id} no existe.`];
      }

      // Limpiar data para evitar campos undefined que se conviertan en null
      const datosPago = {
        monto: data.monto,
        fechaPedido: data.fechaPedido,
        fechaLimite: data.fechaLimite,
        estado: data.estado,
        cliente: cliente
      };

      // Solo agregar factura si existe
      if (data.factura) {
        datosPago.factura = data.factura;
      }

      console.log(`📋 Creando pago con datos:`, {
        ...datosPago,
        cliente: `${cliente.nombres} ${cliente.apellidos}`
      });

      const nuevoPago = pagoPendienteRepository.create(datosPago);
      const pagoGuardado = await pagoPendienteRepository.save(nuevoPago);
      
      console.log(`✅ Pago creado con ID: ${pagoGuardado.id}, factura: ${pagoGuardado.factura || 'sin factura'}`);
      return [pagoGuardado, null];
    } catch (error) {
      console.error("Error en crearPagoPendiente:", error);
      
      // Manejo específico de errores de clave foránea
      if (error.code === '23503' && error.constraint && error.constraint.includes('cliente')) {
        return [null, `El cliente especificado no existe.`];
      }
      
      return [null, "No se pudo crear el pago pendiente."];
    }
  },
  async obtenerPagosPendientes() {
    try {
      console.log("[PagoPendienteService] Consultando pagos pendientes en la base de datos");
      const pagoPendienteRepository = AppDataSource.getRepository(PagoPendiente);
      
      // Verificar que el repositorio esté disponible
      if (!pagoPendienteRepository) {
        console.error("[PagoPendienteService] Error: No se pudo obtener el repositorio de pagos pendientes");
        return [null, "Error interno: Repositorio no disponible"];
      }
      
      // Consultar pagos con relación a cliente
      const pagos = await pagoPendienteRepository.find({ relations: ["cliente"] });
      
      console.log(`[PagoPendienteService] Se encontraron ${pagos.length} pagos pendientes`);
      
      // Log detallado para debugging
      if (pagos.length === 0) {
        console.log("[PagoPendienteService] No se encontraron pagos pendientes en la base de datos");
      } else {
        console.log(`[PagoPendienteService] Primer pago pendiente ID: ${pagos[0].id}, Cliente: ${pagos[0].cliente?.nombres || 'Sin nombre'}`);
      }
      
      return [pagos, null];
    } catch (error) {
      console.error(`[PagoPendienteService] Error en obtenerPagosPendientes: ${error.message}`);
      console.error(error.stack);
      return [null, "Error al obtener los pagos pendientes."];
    }
  },  async modificarPagoPendiente(id, data) {
    try {
      const pagoPendienteRepository = AppDataSource.getRepository(PagoPendiente);
      const clienteRepository = AppDataSource.getRepository(Cliente);

      // Buscar el pago pendiente con sus relaciones
      const pago = await pagoPendienteRepository.findOne({
        where: { id },
        relations: ["cliente"]
      });

      if (!pago) return [null, "Pago pendiente no encontrado."];

      console.log(`📝 [Servicio] Modificando pago ${id} con datos:`, {
        ...data,
        factura: data.factura ? `archivo: ${data.factura}` : 'sin archivo'
      });

      console.log(`📋 [Servicio] Pago actual antes de modificar:`, {
        id: pago.id,
        factura: pago.factura || 'sin factura'
      });

      // Si se está actualizando el cliente, verificar que existe
      if (data.cliente && data.cliente.id) {
        const cliente = await clienteRepository.findOneBy({ id: data.cliente.id });
        if (!cliente) {
          return [null, `El cliente con ID ${data.cliente.id} no existe.`];
        }
        pago.cliente = cliente;
      }

      // Actualizar solo los campos que vienen en data, evitando undefined
      if (data.monto !== undefined) {
        pago.monto = parseInt(data.monto);
        console.log(`💰 [Servicio] Actualizando monto a: ${pago.monto}`);
      }
      if (data.fechaPedido !== undefined) {
        pago.fechaPedido = data.fechaPedido;
        console.log(`📅 [Servicio] Actualizando fechaPedido a: ${pago.fechaPedido}`);
      }
      if (data.fechaLimite !== undefined) {
        pago.fechaLimite = data.fechaLimite;
        console.log(`⏰ [Servicio] Actualizando fechaLimite a: ${pago.fechaLimite}`);
      }
      if (data.estado !== undefined) {
        pago.estado = data.estado;
        console.log(`📊 [Servicio] Actualizando estado a: ${pago.estado}`);
      }
      if (data.factura !== undefined) {
        console.log(`📎 [Servicio] Actualizando factura de '${pago.factura}' a '${data.factura}'`);
        pago.factura = data.factura;
      }

      console.log(`� [Servicio] Pago después de modificar pero antes de guardar:`, {
        id: pago.id,
        factura: pago.factura || 'sin factura'
      });

      const pagoActualizado = await pagoPendienteRepository.save(pago);
      
      console.log(`✅ [Servicio] Pago guardado en BD:`, {
        id: pagoActualizado.id,
        factura: pagoActualizado.factura || 'sin factura'
      });
      return [pagoActualizado, null];
    } catch (error) {
      console.error("❌ [Servicio] Error en modificarPagoPendiente:", error);
      console.error("Stack trace:", error.stack);
      
      // Manejo específico de errores de clave foránea
      if (error.code === '23503' && error.constraint && error.constraint.includes('cliente')) {
        return [null, `El cliente especificado no existe.`];
      }
      
      return [null, "No se pudo modificar el pago pendiente."];
    }
  },

  async obtenerPagoPendientePorId(id) {
    try {
      const pagoPendienteRepository = AppDataSource.getRepository(PagoPendiente);
      const pago = await pagoPendienteRepository.findOne({
        where: { id },
        relations: ["cliente"]
      });

      if (!pago) return [null, "Pago pendiente no encontrado."];
      return [pago, null];
    } catch (error) {
      console.error("Error en obtenerPagoPendientePorId:", error);
      return [null, "Error al obtener el pago pendiente."];
    }
  },

  async eliminarPagoPendiente(id) {
    try {
      const pagoPendienteRepository = AppDataSource.getRepository(PagoPendiente);
      const pago = await pagoPendienteRepository.findOneBy({ id });

      if (!pago) return [null, "Pago pendiente no encontrado."];

      await pagoPendienteRepository.remove(pago);
      return [null, null];
    } catch (error) {
      console.error("Error en eliminarPagoPendiente:", error);
      return [null, "No se pudo eliminar el pago pendiente."];
    }
  }
};