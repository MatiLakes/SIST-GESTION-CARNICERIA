"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAdmin } from "../middlewares/authorization.middleware.js";
import {
  createAnimalVara,
  deleteAnimalVara,
  getAllAnimalVaras,
  getVaraById,
  getVarasByFecha,
  updateAnimalVara
} from "../controllers/animalVara.controller.js";

const router = Router();

router.use(authenticateJwt).use(isAdmin);


router.post("/", createAnimalVara);                  
router.put("/:id", updateAnimalVara);             
router.delete("/:id", deleteAnimalVara);            
router.get("/", getAllAnimalVaras);                  
router.get("/fecha/:fecha", getVarasByFecha); 
router.get("/:id", getVaraById);

export default router;
