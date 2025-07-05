import { Router } from "express";
import { stockActualController } from "../controllers/stockActual.controller.js";

const router = Router();

router.get("/", stockActualController.obtenerStockActual);

export default router;
