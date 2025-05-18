"use strict";

import { Router } from "express";
import multer from "multer";
import path from "path";
import { pagoPendienteController } from "../controllers/pagoPendiente.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAdmin } from "../middlewares/authorization.middleware.js";

const router = Router();

// Configuración de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/facturas");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.use(authenticateJwt).use(isAdmin);

router.post("/", upload.single("factura"), pagoPendienteController.crearPagoPendiente);
router.get("/", pagoPendienteController.obtenerPagosPendientes);
router.put("/:id", upload.single("factura"), pagoPendienteController.modificarPagoPendiente);
router.delete("/:id", pagoPendienteController.eliminarPagoPendiente);

export default router;
