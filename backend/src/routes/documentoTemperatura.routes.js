import { Router } from "express";
import { documentoTemperaturaController } from "../controllers/documentoTemperatura.controller.js";
import { isAdmin } from "../middlewares/authorization.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";

const router = Router();

router.use(authenticateJwt).use(isAdmin);

router.get("/", documentoTemperaturaController.obtenerTodos);
router.post("/", documentoTemperaturaController.crear);
router.delete("/:id", documentoTemperaturaController.eliminar);
router.put("/:id", documentoTemperaturaController.actualizar);

export default router;
