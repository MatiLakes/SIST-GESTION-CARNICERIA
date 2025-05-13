// router.js
import { Router } from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
import animalCorteRoutes from "./animalCorte.routes.js";
import animalVaraRoutes from "./animalVara.routes.js";
import proveedorRoutes from "./proveedor.routes.js";
import pedidoRoutes from "./pedido.routes.js"; 
import productoRoutes from "./producto.routes.js";
import tipoProductoRoutes from "./tipoProducto.routes.js"; 
import marcaProductoRoutes from "./marcaProducto.routes.js"; 
import subproductoRoutes from "./subproducto.routes.js";

const router = Router();

router
  .use("/auth", authRoutes)
  .use("/user", userRoutes)
  .use("/animal-corte", animalCorteRoutes)
  .use("/animal-vara", animalVaraRoutes)
  .use("/proveedor", proveedorRoutes)
  .use("/pedido", pedidoRoutes)
  .use("/productos", productoRoutes)
  .use("/tipos-productos", tipoProductoRoutes)
  .use("/marcas-productos", marcaProductoRoutes)
  .use("/subproductos", subproductoRoutes)


export default router;
