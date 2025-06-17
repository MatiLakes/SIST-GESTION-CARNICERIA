"use strict";

import { AppDataSource } from "../config/configDb.js";
import PagoPendiente from "../entity/PagoPendiente.entity.js";
import Cliente from "../entity/Cliente.entity.js";

export const pagoPendienteService = {  async crearPagoPendiente(data) {
    try {
      const clienteRepository = AppDataSource.getRepository(Cliente);
      const pagoPendienteRepository = AppDataSource.getRepository(PagoPendiente);

      // Verificar si el cliente existe
      const cliente = await clienteRepository.findOneBy({ id: data.cliente.id });
      if (!cliente) {
        return [null, `El cliente con ID ${data.cliente.id} no existe.`];
      }

      const nuevoPago = pagoPendienteRepository.create(data);
      await pagoPendienteRepository.save(nuevoPago);
      return [nuevoPago, null];
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

      // Si se está actualizando el cliente, verificar que existe
      if (data.cliente && data.cliente.id) {
        const cliente = await clienteRepository.findOneBy({ id: data.cliente.id });
        if (!cliente) {
          return [null, `El cliente con ID ${data.cliente.id} no existe.`];
        }
      }

      Object.assign(pago, data);
      await pagoPendienteRepository.save(pago);

      return [pago, null];
    } catch (error) {
      console.error("Error en modificarPagoPendiente:", error);
      
      // Manejo específico de errores de clave foránea
      if (error.code === '23503' && error.constraint && error.constraint.includes('cliente')) {
        return [null, `El cliente especificado no existe.`];
      }
      
      return [null, "No se pudo modificar el pago pendiente."];
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
