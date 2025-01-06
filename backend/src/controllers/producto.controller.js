"use strict";

import { productoService } from "../services/producto.service.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";

export const productoController = {
  async crearProducto(req, res) {
    try {
      const productoData = req.body;
      const [producto, err] = await productoService.crearProducto(productoData);
      if (err) return handleErrorClient(res, 400, err);

      handleSuccess(res, 201, "Producto creado exitosamente.", producto);
    } catch (error) {
      handleErrorServer(res, 500, error.message);
    }
  },

  async obtenerProductos(req, res) {
    try {
      const [productos, err] = await productoService.obtenerProductos();
      if (err) return handleErrorClient(res, 500, err);

      handleSuccess(res, 200, "Productos obtenidos correctamente.", productos);
    } catch (error) {
      handleErrorServer(res, 500, error.message);
    }
  },

  async filtrarProductosPorNombre(req, res) {
    try {
      const { nombre } = req.params;
      const [productos, err] = await productoService.filtrarProductosPorNombre(nombre);
      if (err) return handleErrorClient(res, 500, err);

      handleSuccess(res, 200, "Productos filtrados por nombre correctamente.", productos);
    } catch (error) {
      handleErrorServer(res, 500, error.message);
    }
  },

  async filtrarProductosPorMarca(req, res) {
    try {
      const { marca } = req.params;
      const [productos, err] = await productoService.filtrarProductosPorMarca(marca);
      if (err) return handleErrorClient(res, 500, err);

      handleSuccess(res, 200, "Productos filtrados por marca correctamente.", productos);
    } catch (error) {
      handleErrorServer(res, 500, error.message);
    }
  },

  async filtrarProductosPorTipo(req, res) {
    try {
      const { tipo } = req.params;
      const [productos, err] = await productoService.filtrarProductosPorTipo(tipo);
      if (err) return handleErrorClient(res, 500, err);

      handleSuccess(res, 200, "Productos filtrados por tipo correctamente.", productos);
    } catch (error) {
      handleErrorServer(res, 500, error.message);
    }
  },

  async modificarProducto(req, res) {
    try {
      const { id } = req.params;
      const datosActualizados = req.body;

      const [producto, err] = await productoService.modificarProducto(id, datosActualizados);
      if (err) return handleErrorClient(res, 400, err);

      handleSuccess(res, 200, "Producto modificado correctamente.", producto);
    } catch (error) {
      handleErrorServer(res, 500, error.message);
    }
  },

  async eliminarProducto(req, res) {
    try {
      const { id } = req.params;

      const [_, err] = await productoService.eliminarProducto(id);
      if (err) return handleErrorClient(res, 404, err);

      handleSuccess(res, 200, "Producto eliminado correctamente.");
    } catch (error) {
      handleErrorServer(res, 500, error.message);
    }
  },

  async exportarExcelProductos(req, res) {
    try {
        const workbook = await productoService.generarExcelProductos();

        // Configurar la respuesta para enviar el archivo Excel
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", "attachment; filename=productos.xlsx");

        // Enviar el archivo
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
} 
};