import { Router } from "express";
import { isAdmin } from "../middlewares/authorization.middleware.js"; 
import { authenticateJwt } from "../middlewares/authentication.middleware.js"; 
import { recepcionStockController, actualizarRecepcion, eliminarRecepcion, exportarExcelRecepcionStock } from "../controllers/recepcionStock.controller.js";

const router = Router();

router.use(authenticateJwt).use(isAdmin);

router.post("/", recepcionStockController.crear);
router.get("/", recepcionStockController.obtenerTodas);
router.get("/exportar/excel", exportarExcelRecepcionStock);
router.put("/:id", actualizarRecepcion);
router.delete("/:id", eliminarRecepcion);

export default router;