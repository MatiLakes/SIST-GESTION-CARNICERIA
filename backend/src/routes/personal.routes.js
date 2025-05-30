import { Router } from "express";
import { personalController } from "../controllers/personal.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";

const router = Router();
router.use(authenticateJwt);

router.post("/", personalController.crearPersonal);
router.get("/", personalController.obtenerPersonal);
router.put("/:id", personalController.modificarPersonal);
router.delete("/:id", personalController.eliminarPersonal);

export default router;
