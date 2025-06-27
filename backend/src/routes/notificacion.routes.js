import { Router } from "express";
import { notificacionController } from "../controllers/notificacion.controller.js";

const router = Router();

// GET /api/notificaciones
router.get("/", notificacionController.obtenerNotificaciones);

export default router;
