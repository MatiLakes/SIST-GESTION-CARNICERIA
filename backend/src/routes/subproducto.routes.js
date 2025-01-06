"use strict";
import { Router } from "express";
import {
  createSubproducto,
  updateSubproducto,
  deleteSubproducto,
  getAllSubproductos,
  getSubproductoById,
} from "../controllers/subproducto.controller.js";
import { isAdmin } from "../middlewares/authorization.middleware.js"; 
import { authenticateJwt } from "../middlewares/authentication.middleware.js";

const router = Router();

router.use(authenticateJwt).use(isAdmin);

router.post("/", createSubproducto);       // Crear un nuevo subproducto
router.put("/:id", updateSubproducto);    // Actualizar un subproducto por ID
router.delete("/:id", deleteSubproducto); // Eliminar un subproducto por ID
router.get("/", getAllSubproductos);      // Obtener todos los subproductos
router.get("/:id", getSubproductoById);   // Obtener un subproducto por ID

export default router;