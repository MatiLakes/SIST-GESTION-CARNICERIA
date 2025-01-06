"use strict";

import { Router } from "express";
import { productoController } from "../controllers/productoCarnico.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAdmin } from "../middlewares/authorization.middleware.js";


const router = Router();

router.use(authenticateJwt).use(isAdmin);

router.post("/", productoController.crearProducto);
router.get("/", productoController.obtenerProductos);
router.get("/filtrar/nombre/:nombre", productoController.filtrarProductosPorNombre);
router.get("/filtrar/marca/:marca", productoController.filtrarProductosPorMarca);
router.get("/filtrar/tipo/:tipo", productoController.filtrarProductosPorTipo);
router.put("/:id", productoController.modificarProducto); // Modificar producto
router.delete("/:id", productoController.eliminarProducto); // Eliminar producto
router.get("/exportar/excel", productoController.exportarExcelProductos);

export default router;
