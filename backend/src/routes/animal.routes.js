"use strict";
import { Router } from "express";
import { createAnimalVara, updateCorteCantidadPrecio, duplicarAnimalBase } from "../controllers/animal.controller.js";

const router = Router();

router.post("/animal/vara", createAnimalVara);           // Registrar una vara
router.patch("/corte/:id", updateCorteCantidadPrecio);    // Actualizar cantidad y precio del corte
router.post("/animal/duplicar", duplicarAnimalBase);      // Duplicar "Animal Base" para un nuevo tipo de animal

export default router;
