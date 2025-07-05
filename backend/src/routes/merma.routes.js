"use strict";

import { Router } from "express";
import { mermaController } from "../controllers/merma.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAdmin } from "../middlewares/authorization.middleware.js";

const router = Router();

router.use(authenticateJwt);

// Rutas que requieren autenticación pero no necesariamente ser admin
router.get("/", mermaController.obtenerMermas);
router.get("/id/:id", mermaController.obtenerMermaPorId);
router.get("/tipo/:tipo", mermaController.filtrarMermasPorTipo);
router.get("/personal/:personalId", mermaController.filtrarMermasPorPersonal);
router.get("/fecha", mermaController.filtrarMermasPorFecha); // Se utiliza con query params fechaInicio y fechaFin
router.get("/exportar/excel", mermaController.exportarExcelMermas);

// Rutas que requieren ser admin
router.use(isAdmin);
router.post("/", mermaController.crearMerma);
router.put("/:id", mermaController.modificarMerma);
router.delete("/:id", mermaController.eliminarMerma);

export default router;
