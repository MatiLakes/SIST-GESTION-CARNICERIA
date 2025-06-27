"use strict";

import { pagoPendienteService } from "../services/pagoPendiente.service.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";
import { pagoPendienteValidation } from "../validations/pagopendiente.validation.js";
import path from "path";

export const pagoPendienteController = {  async crearPagoPendiente(req, res) {
    try {
      const { id_cliente, ...pagoData } = req.body;

      // Preparar datos para validación
      const datosParaValidar = {
        ...pagoData,
        factura: req.file ? req.file.path : undefined,
        cliente: { id: id_cliente }
      };

      // Validar los datos usando el esquema
      const { error } = pagoPendienteValidation.create.validate(datosParaValidar);
      if (error) {
        return handleErrorClient(res, 400, error.details[0].message);
      }

      const [pago, err] = await pagoPendienteService.crearPagoPendiente(datosParaValidar);
      if (err) return handleErrorClient(res, 400, err);

      handleSuccess(res, 201, "Pago pendiente creado exitosamente.", pago);
    } catch (error) {
      handleErrorServer(res, 500, error.message);
    }
  },
  async obtenerPagosPendientes(req, res) {
    try {
      console.log("[PagoPendiente] Obteniendo lista de pagos pendientes");
      
      // Verificar que el usuario existe en la solicitud (middleware de autenticación lo coloca)
      if (!req.user) {
        console.error("[PagoPendiente Error] Se intentó obtener pagos pendientes sin autenticación");
        return handleErrorClient(res, 401, "Autenticación requerida para obtener pagos pendientes");
      }
      
      // Verificar rol del usuario (aunque el middleware isAdmin ya debería haberlo hecho)
      console.log(`[PagoPendiente] Usuario ${req.user.email} con rol ${req.user.rol} solicitando pagos pendientes`);
      
      const [pagos, err] = await pagoPendienteService.obtenerPagosPendientes();
      
      if (err) {
        console.error(`[PagoPendiente Error] Error al obtener pagos pendientes: ${err}`);
        return handleErrorClient(res, 500, err);
      }
      
      console.log(`[PagoPendiente] ${pagos.length} pagos pendientes obtenidos correctamente`);
      handleSuccess(res, 200, "Pagos pendientes obtenidos correctamente.", pagos);
    } catch (error) {
      console.error(`[PagoPendiente Error] Error no controlado: ${error.message}`);
      handleErrorServer(res, 500, error.message);
    }
  },
  async modificarPagoPendiente(req, res) {
    try {
      const { id } = req.params;
      const { id_cliente, ...pagoData } = req.body;

      // Preparar datos para validación
      const datosParaValidar = {
        ...pagoData,
        factura: req.file ? req.file.path : undefined,
        ...(id_cliente && { cliente: { id: id_cliente } })
      };

      // Validar los datos usando el esquema de actualización
      const { error } = pagoPendienteValidation.update.validate(datosParaValidar);
      if (error) {
        return handleErrorClient(res, 400, error.details[0].message);
      }

      const [pago, err] = await pagoPendienteService.modificarPagoPendiente(id, datosParaValidar);
      if (err) return handleErrorClient(res, 400, err);

      handleSuccess(res, 200, "Pago pendiente modificado correctamente.", pago);
    } catch (error) {
      handleErrorServer(res, 500, error.message);
    }
  },

  async eliminarPagoPendiente(req, res) {
    try {
      const { id } = req.params;

      const [_, err] = await pagoPendienteService.eliminarPagoPendiente(id);
      if (err) return handleErrorClient(res, 404, err);

      handleSuccess(res, 200, "Pago pendiente eliminado correctamente.");
    } catch (error) {
      handleErrorServer(res, 500, error.message);
    }
  }
};
