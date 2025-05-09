"use strict";

import { tipoProductoService } from "../services/tipoProducto.service.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";

export const tipoProductoController = {
  async crearTipoProducto(req, res) {
    try {
      const { nombre } = req.body;
      const [tipoProducto, err] = await tipoProductoService.crearTipoProducto({ nombre });
      if (err) return handleErrorClient(res, 400, err);

      handleSuccess(res, 201, "Tipo de producto creado exitosamente.", tipoProducto);
    } catch (error) {
      handleErrorServer(res, 500, error.message);
    }
  },

  async obtenerTiposProductos(req, res) {
    try {
      const [tiposProductos, err] = await tipoProductoService.obtenerTiposProductos();
      if (err) return handleErrorClient(res, 500, err);

      handleSuccess(res, 200, "Tipos de productos obtenidos correctamente.", tiposProductos);
    } catch (error) {
      handleErrorServer(res, 500, error.message);
    }
  },
};
