"use strict";

import { Router } from "express";
import { marcaProductoController } from "../controllers/marcaProducto.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAdmin } from "../middlewares/authorization.middleware.js";

const router = Router();

router.use(authenticateJwt).use(isAdmin);

router.post("/", marcaProductoController.crearMarcaProducto);
router.get("/", marcaProductoController.obtenerMarcasProductos);
router.delete("/:id", marcaProductoController.eliminarMarcaProducto);
router.put("/:id", marcaProductoController.actualizarMarcaProducto);

export default router;
