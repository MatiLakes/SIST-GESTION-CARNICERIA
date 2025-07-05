"use strict";

import { Router } from "express";
import {
  getGananciaEstimadaCompleta,
  getResumenGanancia,
  getDetalleGanancias,
  getGananciasAnimalVara,
  getGananciasProductos,
  getGananciasSubproductos,
  getPerdidasMermas
} from "../controllers/gananciaEstimada.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAdmin } from "../middlewares/authorization.middleware.js";
import { 
  logGananciaEstimadaRequest, 
  validateGananciaEstimadaQuery,
  cacheGananciaEstimadaMiddleware 
} from "../middlewares/gananciaEstimada.middleware.js";

const router = Router();

// Middleware de autenticación para todas las rutas
router.use(authenticateJwt);

// Middleware de logging para todas las rutas
router.use(logGananciaEstimadaRequest);

/**
 * @route GET /api/ganancia-estimada
 * @desc Obtiene el cálculo completo de ganancia estimada
 * @access Private (Admin)
 */
router.get("/", isAdmin, validateGananciaEstimadaQuery, cacheGananciaEstimadaMiddleware, getGananciaEstimadaCompleta);

/**
 * @route GET /api/ganancia-estimada/resumen
 * @desc Obtiene solo el resumen de ganancia estimada
 * @access Private (Admin)
 */
router.get("/resumen", isAdmin, validateGananciaEstimadaQuery, getResumenGanancia);

/**
 * @route GET /api/ganancia-estimada/detalle
 * @desc Obtiene el detalle completo por categorías
 * @access Private (Admin)
 */
router.get("/detalle", isAdmin, validateGananciaEstimadaQuery, getDetalleGanancias);

/**
 * @route GET /api/ganancia-estimada/animal-vara
 * @desc Obtiene las ganancias específicas de animales en vara
 * @access Private (Admin)
 */
router.get("/animal-vara", isAdmin, validateGananciaEstimadaQuery, getGananciasAnimalVara);

/**
 * @route GET /api/ganancia-estimada/productos
 * @desc Obtiene las ganancias específicas de productos
 * @access Private (Admin)
 */
router.get("/productos", isAdmin, validateGananciaEstimadaQuery, getGananciasProductos);

/**
 * @route GET /api/ganancia-estimada/subproductos
 * @desc Obtiene las ganancias específicas de subproductos
 * @access Private (Admin)
 */
router.get("/subproductos", isAdmin, validateGananciaEstimadaQuery, getGananciasSubproductos);

/**
 * @route GET /api/ganancia-estimada/mermas
 * @desc Obtiene las pérdidas por mermas
 * @access Private (Admin)
 */
router.get("/mermas", isAdmin, validateGananciaEstimadaQuery, getPerdidasMermas);

export default router;
