"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAdmin } from "../middlewares/authorization.middleware.js"; 
import {
  createProductoCarnico,
  deleteProductoCarnico,
  getAllProductosCarnicos,
  getProductoCarnicoById,
  updateProductoCarnico,
} from "../controllers/producto.controller.js"; 

const router = Router();

// Autenticación y autorización
router.use(authenticateJwt).use(isAdmin);

// Rutas para productos cárnicos
router
  .post("", createProductoCarnico)                // Crear producto cárnico
  .get("/", getAllProductosCarnicos)             // Obtener todos los productos cárnicos
  .get("/:id", getProductoCarnicoById)                  // Obtener producto cárnico por ID
  .put("/:id", updateProductoCarnico)        // Actualizar producto cárnico
  .delete("/:id", deleteProductoCarnico);      // Eliminar producto cárnico

export default router;
