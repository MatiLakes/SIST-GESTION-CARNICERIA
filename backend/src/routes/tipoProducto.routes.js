"use strict";

import { Router } from "express";
import { tipoProductoController } from "../controllers/tipoProducto.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAdmin } from "../middlewares/authorization.middleware.js";

const router = Router();

router.use(authenticateJwt).use(isAdmin);

router.post("/", tipoProductoController.crearTipoProducto);
router.get("/", tipoProductoController.obtenerTiposProductos);
router.delete("/:id", tipoProductoController.eliminarTipoProducto);
router.put("/:id", tipoProductoController.actualizarTipoProducto);

export default router;
