import { Router } from "express";
import { controlHigieneController } from "../controllers/controlHigiene.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAdmin } from "../middlewares/authorization.middleware.js";

const router = Router();
router.use(authenticateJwt).use(isAdmin);

router.post("/", controlHigieneController.crearRegistro);
router.get("/", controlHigieneController.obtenerRegistros);
router.get("/exportar/excel", controlHigieneController.exportarExcelControlHigiene);
router.put("/:id", controlHigieneController.modificarRegistro);
router.delete("/:id", controlHigieneController.eliminarRegistro);


export default router;
