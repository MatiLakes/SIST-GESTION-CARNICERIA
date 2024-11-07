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
  .get("/", obtenerCategorias)              
  .get("/:id", obtenerCategoria)             
  .patch("/:id", actualizarCategoria)       
  .delete("/:id", eliminarCategoria);        

export default router;
