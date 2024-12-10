"use strict";
import { Router } from "express";
import {
  createAnimalVara,
  deleteAnimalVara,
  getAllAnimalVaras,
  getVaraById,
  getVarasByFecha,
  updateAnimalVara
} from "../controllers/animalVara.controller.js";

const router = Router();


router.post("/", createAnimalVara);                  
router.patch("/:id", updateAnimalVara);             
router.delete("/:id", deleteAnimalVara);            
router.get("/", getAllAnimalVaras);                  
router.get("/fecha/:fecha", getVarasByFecha); 
router.get("/:id", getVaraById);

export default router;
