"use strict";
import { Router } from "express";
import { isAdmin } from "../middlewares/authorization.middleware.js"; 
import { authenticateJwt } from "../middlewares/authentication.middleware.js"; 
import {
  actualizarCategoria,
  crearCategoria,
  eliminarCategoria,
  obtenerCategoria,
  obtenerCategorias,
  obtenerCategoriasCarnicas,
  obtenerCategoriasNoCarnicas
} from "../controllers/categoria.controller.js"; 

const router = Router();

// Middleware para autenticar y autorizar
router.use(authenticateJwt).use(isAdmin);

// Rutas para categorías
router
  .post("/", crearCategoria)                // Crear una nueva categoría
  .get("/", obtenerCategorias)              // Obtener todas las categorías
  .get("/:id", obtenerCategoria)            // Obtener categoría por ID
  .put("/:id", actualizarCategoria)         // Actualizar una categoría
  .delete("/:id", eliminarCategoria)        // Eliminar una categoría

// Rutas específicas para obtener categorías cárnicas y no cárnicas
router
  .get("/carnicas/carnicas", obtenerCategoriasCarnicas)  // Obtener categorías cárnicas
  .get("/carnicas/no-carnicas", obtenerCategoriasNoCarnicas); // Obtener categorías no cárnicas

export default router;
