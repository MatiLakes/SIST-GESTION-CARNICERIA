"use strict";
import { Router } from "express";
import { isAdmin } from "../middlewares/authorization.middleware.js"; 
import { authenticateJwt } from "../middlewares/authentication.middleware.js"; 
import {
  actualizarCategoria,
  crearCategoria,
  eliminarCategoria,
  obtenerCategoria,
  obtenerCategorias,
} from "../controllers/categoria.controller.js"; 

const router = Router();


router.use(authenticateJwt).use(isAdmin);

router
  .post("/crear", crearCategoria)                
  .get("/obtener", obtenerCategorias)              
  .get("/:id", obtenerCategoria)             
  .put("/actualizar/:id", actualizarCategoria)       
  .delete("/eliminar/:id", eliminarCategoria);        

export default router;
