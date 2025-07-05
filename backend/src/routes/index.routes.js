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
import pagoPendienteRoutes from "./pagoPendiente.routes.js";
import clienteRoutes from "./cliente.routes.js";
import personalRoutes from "./personal.routes.js";
import controlHigieneRoutes from "./controlHigiene.routes.js";
import documentoTemperaturaRoutes from "./documentoTemperatura.routes.js";
import documentoTrazabilidadRoutes from "./documentoTrazabilidad.routes.js";
import notificacionRoutes from "./notificacion.routes.js";
import recepcionStockRoutes from "./recepcionStock.routes.js";
import stockActualRoutes from "./stockActual.routes.js";
import mermaRoutes from "./merma.routes.js";
import gananciaEstimadaRoutes from "./gananciaEstimada.routes.js";


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
  .use("/pagos-pendientes", pagoPendienteRoutes)
  .use("/clientes", clienteRoutes)
  .use("/personal", personalRoutes)
  .use("/control-higiene", controlHigieneRoutes)
  .use("/documentos-temperatura", documentoTemperaturaRoutes)
  .use("/documentos-trazabilidad", documentoTrazabilidadRoutes)
  .use("/notificaciones", notificacionRoutes)
  .use("/recepcion-stock", recepcionStockRoutes)
  .use("/stock-actual", stockActualRoutes)
  .use("/mermas", mermaRoutes)
  .use("/ganancia-estimada", gananciaEstimadaRoutes);


export default router;
