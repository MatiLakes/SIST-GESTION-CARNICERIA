"use strict";

import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAdmin } from "../middlewares/authorization.middleware.js";
import { pedidoController } from "../controllers/pedido.controller.js";

const router = Router();

router.use(authenticateJwt).use(isAdmin);

router.post("/", pedidoController.crearPedido);
router.get("/", pedidoController.obtenerPedidos);
router.delete("/:id", pedidoController.eliminarPedido);
router.put("/:id", pedidoController.actualizarPedido);

export default router;
