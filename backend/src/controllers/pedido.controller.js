"use strict";

import { pedidoService } from "../services/pedido.service.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";
import { pedidoValidation } from "../validations/pedido.validation.js";

export const pedidoController = {
  crearPedido: async (req, res) => {
    try {
      // Validar los datos del pedido
      const { error } = pedidoValidation.create.validate(req.body);
      if (error) {
        return handleErrorClient(res, 400, error.details[0].message);
      }

      const nuevoPedido = req.body;
      const pedidoCreado = await pedidoService.crearPedido(nuevoPedido);
      handleSuccess(res, 201, "Pedido creado con éxito", pedidoCreado);
    } catch (error) {
      handleErrorServer(res, 500, "Error al crear el pedido");
    }
  },

  async obtenerPedidos(req, res) {
    try {
      const [pedidos, err] = await pedidoService.obtenerPedidos();
      if (err) return handleErrorClient(res, 500, err);

      handleSuccess(res, 200, "Pedidos obtenidos correctamente.", pedidos);
    } catch (error) {
      handleErrorServer(res, 500, error.message);
    }
  },

  async obtenerPedidosPorFechaEntrega(req, res) {
    try {
      const { fecha } = req.params;
      const [pedidos, err] = await pedidoService.obtenerPedidosPorFechaEntrega(fecha);
      if (err) return handleErrorClient(res, 500, err);

      handleSuccess(res, 200, "Pedidos obtenidos por fecha de entrega correctamente.", pedidos);
    } catch (error) {
      handleErrorServer(res, 500, error.message);
    }
  },

  async obtenerPedidosPorFechaCreacion(req, res) {
    try {
      const { fecha } = req.params;
      const [pedidos, err] = await pedidoService.obtenerPedidosPorFechaCreacion(fecha);
      if (err) return handleErrorClient(res, 500, err);

      handleSuccess(res, 200, "Pedidos obtenidos por fecha de creación correctamente.", pedidos);
    } catch (error) {
      handleErrorServer(res, 500, error.message);
    }
  },

  async eliminarPedido(req, res) {
    try {
      const { id } = req.params;
      const [_, err] = await pedidoService.eliminarPedido(id);
      if (err) return handleErrorClient(res, 404, err);

      handleSuccess(res, 200, "Pedido eliminado correctamente.");
    } catch (error) {
      handleErrorServer(res, 500, error.message);
    }
  },

  async actualizarPedido(req, res) {
    try {
      const { id } = req.params;
      const datosActualizados = req.body;
      
      // Validar los datos del pedido
      const { error } = pedidoValidation.update.validate(datosActualizados);
      if (error) {
        return handleErrorClient(res, 400, error.details[0].message);
      }
  
      const [pedidoActualizado, err] = await pedidoService.actualizarPedido(id, datosActualizados);
  
      if (err) return handleErrorClient(res, 404, err);
  
      handleSuccess(res, 200, "Pedido actualizado correctamente.", pedidoActualizado);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
  }
};



