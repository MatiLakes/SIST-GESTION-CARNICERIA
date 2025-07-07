"use strict";

import { pagoPendienteService } from "../services/pagoPendiente.service.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";
import { pagoPendienteValidation } from "../validations/pagopendiente.validation.js";
import path from "path";

export const pagoPendienteController = {
  async crearPagoPendiente(req, res) {
    try {
      const { id_cliente, ...pagoData } = req.body;

      console.log(`📄 Creando pago pendiente para cliente ${id_cliente}`);
      console.log(`📎 Archivo recibido:`, req.file ? `${req.file.filename} (${req.file.size} bytes)` : 'No se subió archivo');
      
      // DEBUGGING: Información completa del request
      console.log(`📋 [DEBUG] Content-Type:`, req.headers['content-type']);
      console.log(`📋 [DEBUG] Body:`, req.body);
      console.log(`📋 [DEBUG] Files:`, req.files);
      console.log(`📋 [DEBUG] File (single):`, req.file);
      
      if (req.file) {
        console.log(`📎 [DEBUG] Detalles del archivo:`, {
          originalname: req.file.originalname,
          filename: req.file.filename,
          path: req.file.path,
          size: req.file.size,
          mimetype: req.file.mimetype
        });
      }

      // Preparar datos para validación
      const datosParaValidar = {
        ...pagoData,
        cliente: { id: parseInt(id_cliente) }
      };

      // Limpiar campos vacíos, null, undefined o objetos vacíos que pueden causar problemas de validación
      Object.keys(datosParaValidar).forEach(key => {
        if (key !== 'cliente') { // No eliminar el objeto cliente requerido
          const value = datosParaValidar[key];
          if (value === null || 
              value === undefined || 
              value === '' ||
              (typeof value === 'object' && value !== null && Object.keys(value).length === 0)) {
            delete datosParaValidar[key];
          }
        }
      });

      // Solo agregar factura si existe el archivo
      if (req.file) {
        // Normalizar la ruta para usar forward slashes
        datosParaValidar.factura = req.file.path.replace(/\\/g, '/');
      }

      // Validar los datos usando el esquema
      const { error } = pagoPendienteValidation.create.validate(datosParaValidar);
      if (error) {
        return handleErrorClient(res, 400, error.details[0].message);
      }

      const [pago, err] = await pagoPendienteService.crearPagoPendiente(datosParaValidar);
      if (err) return handleErrorClient(res, 400, err);

      console.log(`✅ Pago pendiente creado exitosamente con ID: ${pago.id}`);
      handleSuccess(res, 201, "Pago pendiente creado exitosamente.", pago);
    } catch (error) {
      console.error(`❌ Error al crear pago pendiente: ${error.message}`);
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

      console.log(`📝 Modificando pago pendiente con ID: ${id}`);
      console.log(`📎 Archivo recibido:`, req.file ? `${req.file.filename} (${req.file.size} bytes)` : 'No se subió archivo');
      console.log(`📋 Body recibido:`, req.body);

      // Preparar datos para validación
      const datosParaValidar = {
        ...pagoData,
        ...(id_cliente && { cliente: { id: parseInt(id_cliente) } })
      };

      // Limpiar campos vacíos, null, undefined o objetos vacíos que pueden causar problemas de validación
      Object.keys(datosParaValidar).forEach(key => {
        const value = datosParaValidar[key];
        if (value === null || 
            value === undefined || 
            value === '' ||
            (typeof value === 'object' && value !== null && Object.keys(value).length === 0)) {
          delete datosParaValidar[key];
        }
      });

      // Solo agregar factura si existe el archivo
      if (req.file) {
        // Normalizar la ruta para usar forward slashes
        datosParaValidar.factura = req.file.path.replace(/\\/g, '/');
        console.log(`📎 [Controlador] Agregando factura a datos: ${datosParaValidar.factura}`);
      }

      console.log(`📋 [Controlador] Datos preparados para validación:`, {
        ...datosParaValidar,
        cliente: datosParaValidar.cliente ? `ID: ${datosParaValidar.cliente.id}` : 'sin cliente'
      });

      // Validar los datos usando el esquema de actualización
      const { error } = pagoPendienteValidation.update.validate(datosParaValidar);
      if (error) {
        console.error(`❌ [Controlador] Error de validación:`, error.details[0].message);
        console.error(`📋 [Controlador] Datos que fallaron la validación:`, datosParaValidar);
        return handleErrorClient(res, 400, error.details[0].message);
      }

      const [pago, err] = await pagoPendienteService.modificarPagoPendiente(id, datosParaValidar);
      if (err) {
        console.error(`❌ [Controlador] Error del servicio:`, err);
        return handleErrorClient(res, 400, err);
      }

      console.log(`✅ Pago pendiente modificado exitosamente con ID: ${id}`);
      handleSuccess(res, 200, "Pago pendiente modificado correctamente.", pago);
    } catch (error) {
      console.error(`❌ Error al modificar pago pendiente: ${error.message}`);
      handleErrorServer(res, 500, error.message);
    }
  },

  async eliminarPagoPendiente(req, res) {
    try {
      const { id } = req.params;

      console.log(`🗑️ Eliminando pago pendiente con ID: ${id}`);

      const [_, err] = await pagoPendienteService.eliminarPagoPendiente(id);
      if (err) return handleErrorClient(res, 404, err);

      console.log(`✅ Pago pendiente eliminado exitosamente con ID: ${id}`);
      handleSuccess(res, 200, "Pago pendiente eliminado correctamente.");
    } catch (error) {
      console.error(`❌ Error al eliminar pago pendiente: ${error.message}`);
      handleErrorServer(res, 500, error.message);
    }
  }
};
