// router.js
import { Router } from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
import animalCorteRoutes from "./animalCorte.routes.js";
import animalVaraRoutes from "./animalVara.routes.js";
import proveedorRoutes from "./proveedor.routes.js";
import CategoriaRoutes from "./categoria.routes.js";
import pedidoRoutes from "./pedido.routes.js"; 
import productosCarnicosRoutes from "./productosCarnicos.routes.js";

const router = Router();

router
  .use("/auth", authRoutes)
  .use("/user", userRoutes)
  .use("/animal-corte", animalCorteRoutes)
  .use("/animal-vara", animalVaraRoutes)
  .use("/proveedor", proveedorRoutes)
  .use("/categoria", CategoriaRoutes)
  .use("/pedido", pedidoRoutes)
  .use("/producto-carnico", productosCarnicosRoutes); 


export default router;
