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
  .post("/", crearProveedor)           
  .get("/", obtenerProveedores)              
  .get("/:id", obtenerProveedor)             
  .put("/:id", actualizarProveedor)       
  .delete("/:id", eliminarProveedor);      

export default router;
