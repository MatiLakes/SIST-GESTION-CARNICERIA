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
    const resultado = await gananciaEstimadaService.calcularGananciaEstimada();
    
    return handleSuccess(res, 200, "Ganancia estimada calculada exitosamente", resultado);
  } catch (error) {
    console.error("Error al obtener ganancia estimada completa:", error);
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
    const resumen = await gananciaEstimadaService.obtenerResumenGanancia();
    
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
    const detalle = await gananciaEstimadaService.obtenerDetalleCompleto();
    
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
    const gananciaAnimalVara = await gananciaEstimadaService.calcularGananciaAnimalVara();
    
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
    const gananciaProductos = await gananciaEstimadaService.calcularGananciaProductos();
    
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
    const gananciaSubproductos = await gananciaEstimadaService.calcularGananciaSubproductos();
    
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
    const perdidasMermas = await gananciaEstimadaService.calcularPerdidasMermas();
    
    return handleSuccess(res, 200, "Pérdidas por mermas obtenidas exitosamente", perdidasMermas);
  } catch (error) {
    console.error("Error al obtener pérdidas por mermas:", error);
    return handleErrorServer(res, 500, "Error interno del servidor al obtener pérdidas por mermas");
  }
};
