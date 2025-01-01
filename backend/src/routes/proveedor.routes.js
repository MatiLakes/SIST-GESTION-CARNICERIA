"use strict";
import { Router } from "express";
import { isAdmin } from "../middlewares/authorization.middleware.js"; 
import { authenticateJwt } from "../middlewares/authentication.middleware.js"; 
import {
  actualizarProveedor,   
  crearProveedor,    
  eliminarProveedor,       
  obtenerProveedor,    
  obtenerProveedores     
} from "../controllers/proveedor.controller.js"; 

const router = Router();


router.use(authenticateJwt).use(isAdmin);

router
  .post("/crear", crearProveedor)           
  .get("/obtener", obtenerProveedores)              
  .get("/:id", obtenerProveedor)             
  .put("/actualizar/:id", actualizarProveedor)       
  .delete("/eliminar/:id", eliminarProveedor);      

export default router;
