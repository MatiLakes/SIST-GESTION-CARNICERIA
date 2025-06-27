"use strict";

import { marcaProductoService } from "../services/marcaProducto.service.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";
import { marcaProductoValidation } from "../validations/marcaProducto.validation.js";

export const marcaProductoController = {  async crearMarcaProducto(req, res) {
    try {
      const { nombre } = req.body;

      // Validar los datos
      const { error } = marcaProductoValidation().validate({ nombre });
      if (error) {
        return handleErrorClient(res, 400, error.details[0].message);
      }

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

  async eliminarMarcaProducto(req, res) {
    try {
      const { id } = req.params;
      const [mensaje, err] = await marcaProductoService.eliminarMarcaProducto(id);
      if (err) return handleErrorClient(res, 400, err);

      handleSuccess(res, 200, mensaje);
    } catch (error) {
      handleErrorServer(res, 500, error.message);
    }
  },
  async actualizarMarcaProducto(req, res) {
    try {
      const { id } = req.params;
      const datosActualizados = req.body;

      // Validar los datos actualizados
      const { error } = marcaProductoValidation().validate(datosActualizados);
      if (error) {
        return handleErrorClient(res, 400, error.details[0].message);
      }

      const [marcaProducto, err] = await marcaProductoService.actualizarMarcaProducto(id, datosActualizados);
      if (err) return handleErrorClient(res, 400, err);

      handleSuccess(res, 200, "Marca de producto actualizada correctamente.", marcaProducto);
    } catch (error) {
      handleErrorServer(res, 500, error.message);
    }
  },
};
