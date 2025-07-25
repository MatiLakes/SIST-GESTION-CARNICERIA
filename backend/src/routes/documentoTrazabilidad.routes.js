import { Router } from "express";
import { documentoTrazabilidadController } from "../controllers/documentoTrazabilidad.controller.js";
import { isAdmin } from "../middlewares/authorization.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";

const router = Router();

router.use(authenticateJwt).use(isAdmin);

router.get("/", documentoTrazabilidadController.obtenerTodos);

router.get("/excel", documentoTrazabilidadController.exportarExcel);

router.post("/", documentoTrazabilidadController.crear);

router.put("/:id", documentoTrazabilidadController.actualizar);

router.delete("/:id", documentoTrazabilidadController.eliminar);

// Rutas para gestionar registros individuales
router.post("/:id/registro", documentoTrazabilidadController.agregarRegistro);

router.put("/:id/registro/:registroId", documentoTrazabilidadController.actualizarRegistro);

router.delete("/:id/registro/:registroId", documentoTrazabilidadController.eliminarRegistro);

export default router;
