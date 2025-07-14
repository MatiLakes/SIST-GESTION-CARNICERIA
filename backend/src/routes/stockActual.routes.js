import { Router } from "express";
import { stockActualController, exportarExcelStockActual } from "../controllers/stockActual.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAdmin } from "../middlewares/authorization.middleware.js";

const router = Router();

router.use(authenticateJwt).use(isAdmin);

router.get("/", stockActualController.obtenerStockActual);
router.get("/exportar/excel", exportarExcelStockActual);

export default router;
