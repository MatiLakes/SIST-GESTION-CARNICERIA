"use strict";
import { Router } from "express";
import { isAdmin } from "../middlewares/authorization.middleware.js"; 
import { authenticateJwt } from "../middlewares/authentication.middleware.js"; 
import {
  createProveedor,   
  deleteProveedor,    
  getAllProveedores,       
  getProveedorById,  
  updateProveedor,
  exportarExcelProveedores     
} from "../controllers/proveedor.controller.js"; 

const router = Router();


router.use(authenticateJwt).use(isAdmin);

router
  .post("/", createProveedor)           
  .get("/", getAllProveedores)
  .get("/exportar/excel", exportarExcelProveedores)
  .get("/:id", getProveedorById)             
  .put("/:id", updateProveedor)       
  .delete("/:id", deleteProveedor);      

export default router;
