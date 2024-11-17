"use strict";
import { Router } from "express";
import {
  createAnimalCorte,
  updateAnimalCorte,
  deleteAnimalCorte,
  getAllAnimalCortes,
  getAnimalCorteById
} from "../controllers/animalCorte.controller.js";

const router = Router();

router.post("/", createAnimalCorte);      
router.patch("/:id", updateAnimalCorte);  
router.delete("/:id", deleteAnimalCorte); 
router.get("/", getAllAnimalCortes); 
router.get("/:id", getAnimalCorteById);

export default router;