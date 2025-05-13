"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAdmin } from "../middlewares/authorization.middleware.js";
import { animalCorteController } from "../controllers/animalCorte.controller.js";

const router = Router();

router.use(authenticateJwt).use(isAdmin);

router
  .post("/", animalCorteController.createAnimalCorte)
  .get("/", animalCorteController.getAllAnimalCortes)
  .get("/exportar/excel", animalCorteController.exportarExcelAnimalCortes)
  .get("/:id", animalCorteController.getAnimalCorteById)
  .put("/:id", animalCorteController.updateAnimalCorte)
  .delete("/:id", animalCorteController.deleteAnimalCorte);

export default router;