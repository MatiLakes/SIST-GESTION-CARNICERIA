"use strict";

import { marcaProductoService } from "../services/marcaProducto.service.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";

export const marcaProductoController = {
  async crearMarcaProducto(req, res) {
    try {
      const { nombre } = req.body;
      const [marcaProducto, err] = await marcaProductoService.crearMarcaProducto({ nombre });
      if (err) return handleErrorClient(res, 400, err);

      handleSuccess(res, 201, "Marca de producto creada exitosamente.", marcaProducto);
    } catch (error) {
      handleErrorServer(res, 500, error.message);
    }
  },

  async obtenerMarcasProductos(req, res) {
    try {
      const [marcasProductos, err] = await marcaProductoService.obtenerMarcasProductos();
      if (err) return handleErrorClient(res, 500, err);

      handleSuccess(res, 200, "Marcas de productos obtenidas correctamente.", marcasProductos);
    } catch (error) {
      handleErrorServer(res, 500, error.message);
    }
  },
};
