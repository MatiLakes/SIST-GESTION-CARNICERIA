"use strict";
import { Router } from "express";
import {
  createAnimalCorte,
  deleteAnimalCorte,
  getAllAnimalCortes,
  getAnimalCorteById,
  updateAnimalCorte
} from "../controllers/animalCorte.controller.js";

const router = Router();

router.post("/", createAnimalCorte);      
router.put("/:id", updateAnimalCorte);  
router.delete("/:id", deleteAnimalCorte); 
router.get("/", getAllAnimalCortes); 
router.get("/:id", getAnimalCorteById);

export default router;