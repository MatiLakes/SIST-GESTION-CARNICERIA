import { Router } from "express";
import { controlHigieneController } from "../controllers/controlHigiene.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";

const router = Router();
router.use(authenticateJwt);

router.post("/", controlHigieneController.crearRegistro);
router.get("/", controlHigieneController.obtenerRegistros);
router.put("/:id", controlHigieneController.modificarRegistro);
router.delete("/:id", controlHigieneController.eliminarRegistro);


export default router;
