"use strict";

import { Router } from "express";
import { clienteController } from "../controllers/cliente.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAdmin } from "../middlewares/authorization.middleware.js";

const router = Router();

router.use(authenticateJwt).use(isAdmin);

router.post("/", clienteController.crearCliente);
router.get("/", clienteController.obtenerClientes);
router.put("/:id", clienteController.modificarCliente);
router.delete("/:id", clienteController.eliminarCliente);

export default router;
