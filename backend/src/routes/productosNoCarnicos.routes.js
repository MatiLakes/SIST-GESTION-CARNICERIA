"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAdmin } from "../middlewares/authorization.middleware.js"; 
import {
  createProductoNoCarnico,
  deleteProductoNoCarnico,
  getAllproductosNoCarnicos,
  getProductoNoCarnicoById,
  updateProductoNoCarnico,
} from "../controllers/producto.controller.js"; 

const router = Router();

// Autenticación y autorización
router.use(authenticateJwt).use(isAdmin);

// Rutas para productos no cárnicos
router
  .post("/", createProductoNoCarnico)                // Crear producto no cárnico
  .get("/", getAllproductosNoCarnicos)             // Obtener todos los productos no cárnicos
  .get("/:id", getProductoNoCarnicoById)                  // Obtener producto no cárnico por ID
  .put("/:id", updateProductoNoCarnico)        // Actualizar producto no cárnico
  .delete("/:id", deleteProductoNoCarnico);      // Eliminar producto no cárnico

export default router;