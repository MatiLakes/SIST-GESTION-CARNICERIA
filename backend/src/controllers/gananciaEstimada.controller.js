"use strict";

import gananciaEstimadaService from "../services/gananciaEstimada.service.js";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../handlers/responseHandlers.js";

/**
 * Controlador para el módulo de ganancia estimada
 */

/**
 * Obtiene el cálculo completo de ganancia estimada
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
export const getGananciaEstimadaCompleta = async (req, res) => {
  try {
    console.log("🔍 Iniciando cálculo de ganancia estimada...");
    const { fechaInicio, fechaFin } = req.query;
    console.log("📅 Parámetros recibidos:", { fechaInicio, fechaFin });
    
    // Validar fechas si se proporcionan
    if ((fechaInicio && !fechaFin) || (!fechaInicio && fechaFin)) {
      console.log("❌ Error de validación: Faltan fechas");
      return handleErrorClient(res, 400, "Debe proporcionar ambas fechas (fechaInicio y fechaFin) o ninguna");
    }

    if (fechaInicio && fechaFin && new Date(fechaInicio) > new Date(fechaFin)) {
      console.log("❌ Error de validación: Fecha inicio mayor que fecha fin");
      return handleErrorClient(res, 400, "La fecha de inicio no puede ser mayor a la fecha de fin");
    }

    const filtroFechas = fechaInicio && fechaFin ? { fechaInicio, fechaFin } : null;
    console.log("🔧 Filtro aplicado:", filtroFechas);
    
    const resultado = await gananciaEstimadaService.calcularGananciaEstimada(filtroFechas);
    console.log("✅ Cálculo completado exitosamente");
    
    return handleSuccess(res, 200, "Ganancia estimada calculada exitosamente", resultado);
  } catch (error) {
    console.error("💥 Error detallado en controlador:", error);
    console.error("Stack trace:", error.stack);
    return handleErrorServer(res, 500, "Error interno del servidor al calcular ganancia estimada");
  }
};

/**
 * Obtiene solo el resumen de la ganancia estimada
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
export const getResumenGanancia = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;
    
    // Validar fechas si se proporcionan
    if ((fechaInicio && !fechaFin) || (!fechaInicio && fechaFin)) {
      return handleErrorClient(res, 400, "Debe proporcionar ambas fechas (fechaInicio y fechaFin) o ninguna");
    }

    if (fechaInicio && fechaFin && new Date(fechaInicio) > new Date(fechaFin)) {
      return handleErrorClient(res, 400, "La fecha de inicio no puede ser mayor a la fecha de fin");
    }

    const filtroFechas = fechaInicio && fechaFin ? { fechaInicio, fechaFin } : null;
    const resumen = await gananciaEstimadaService.obtenerResumenGanancia(filtroFechas);
    
    return handleSuccess(res, 200, "Resumen de ganancia obtenido exitosamente", resumen);
  } catch (error) {
    console.error("Error al obtener resumen de ganancia:", error);
    return handleErrorServer(res, 500, "Error interno del servidor al obtener resumen de ganancia");
  }
};

/**
 * Obtiene el detalle de ganancias por categoría
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
export const getDetalleGanancias = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;
    
    // Validar fechas si se proporcionan
    if ((fechaInicio && !fechaFin) || (!fechaInicio && fechaFin)) {
      return handleErrorClient(res, 400, "Debe proporcionar ambas fechas (fechaInicio y fechaFin) o ninguna");
    }

    if (fechaInicio && fechaFin && new Date(fechaInicio) > new Date(fechaFin)) {
      return handleErrorClient(res, 400, "La fecha de inicio no puede ser mayor a la fecha de fin");
    }

    const filtroFechas = fechaInicio && fechaFin ? { fechaInicio, fechaFin } : null;
    const detalle = await gananciaEstimadaService.obtenerDetalleCompleto(filtroFechas);
    
    return handleSuccess(res, 200, "Detalle de ganancias obtenido exitosamente", detalle);
  } catch (error) {
    console.error("Error al obtener detalle de ganancias:", error);
    return handleErrorServer(res, 500, "Error interno del servidor al obtener detalle de ganancias");
  }
};

/**
 * Obtiene las ganancias específicas de animales en vara
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
export const getGananciasAnimalVara = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;
    
    // Validar fechas si se proporcionan
    if ((fechaInicio && !fechaFin) || (!fechaInicio && fechaFin)) {
      return handleErrorClient(res, 400, "Debe proporcionar ambas fechas (fechaInicio y fechaFin) o ninguna");
    }

    const filtroFechas = fechaInicio && fechaFin ? { fechaInicio, fechaFin } : null;
    const gananciaAnimalVara = await gananciaEstimadaService.calcularGananciaAnimalVara(filtroFechas);
    
    return handleSuccess(res, 200, "Ganancias de animal vara obtenidas exitosamente", gananciaAnimalVara);
  } catch (error) {
    console.error("Error al obtener ganancias de animal vara:", error);
    return handleErrorServer(res, 500, "Error interno del servidor al obtener ganancias de animal vara");
  }
};

/**
 * Obtiene las ganancias específicas de productos
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
export const getGananciasProductos = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;
    
    // Validar fechas si se proporcionan
    if ((fechaInicio && !fechaFin) || (!fechaInicio && fechaFin)) {
      return handleErrorClient(res, 400, "Debe proporcionar ambas fechas (fechaInicio y fechaFin) o ninguna");
    }

    const filtroFechas = fechaInicio && fechaFin ? { fechaInicio, fechaFin } : null;
    const gananciaProductos = await gananciaEstimadaService.calcularGananciaProductos(filtroFechas);
    
    return handleSuccess(res, 200, "Ganancias de productos obtenidas exitosamente", gananciaProductos);
  } catch (error) {
    console.error("Error al obtener ganancias de productos:", error);
    return handleErrorServer(res, 500, "Error interno del servidor al obtener ganancias de productos");
  }
};

/**
 * Obtiene las ganancias específicas de subproductos
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
export const getGananciasSubproductos = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;
    
    // Validar fechas si se proporcionan
    if ((fechaInicio && !fechaFin) || (!fechaInicio && fechaFin)) {
      return handleErrorClient(res, 400, "Debe proporcionar ambas fechas (fechaInicio y fechaFin) o ninguna");
    }

    const filtroFechas = fechaInicio && fechaFin ? { fechaInicio, fechaFin } : null;
    const gananciaSubproductos = await gananciaEstimadaService.calcularGananciaSubproductos(filtroFechas);
    
    return handleSuccess(res, 200, "Ganancias de subproductos obtenidas exitosamente", gananciaSubproductos);
  } catch (error) {
    console.error("Error al obtener ganancias de subproductos:", error);
    return handleErrorServer(res, 500, "Error interno del servidor al obtener ganancias de subproductos");
  }
};

/**
 * Obtiene las pérdidas por mermas
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
export const getPerdidasMermas = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;
    
    // Validar fechas si se proporcionan
    if ((fechaInicio && !fechaFin) || (!fechaInicio && fechaFin)) {
      return handleErrorClient(res, 400, "Debe proporcionar ambas fechas (fechaInicio y fechaFin) o ninguna");
    }

    const filtroFechas = fechaInicio && fechaFin ? { fechaInicio, fechaFin } : null;
    const perdidasMermas = await gananciaEstimadaService.calcularPerdidasMermas(filtroFechas);
    
    return handleSuccess(res, 200, "Pérdidas por mermas obtenidas exitosamente", perdidasMermas);
  } catch (error) {
    console.error("Error al obtener pérdidas por mermas:", error);
    return handleErrorServer(res, 500, "Error interno del servidor al obtener pérdidas por mermas");
  }
};
