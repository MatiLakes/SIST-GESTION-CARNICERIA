"use strict";

import { clienteService } from "../services/cliente.service.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";

export const clienteController = {
  async crearCliente(req, res) {
    try {
      const clienteData = req.body;
      const [cliente, err] = await clienteService.crearCliente(clienteData);
      if (err) return handleErrorClient(res, 400, err);

      handleSuccess(res, 201, "Cliente creado exitosamente.", cliente);
    } catch (error) {
      handleErrorServer(res, 500, error.message);
    }
  },

  async obtenerClientes(req, res) {
    try {
      const [clientes, err] = await clienteService.obtenerClientes();
      if (err) return handleErrorClient(res, 500, err);

      handleSuccess(res, 200, "Clientes obtenidos correctamente.", clientes);
    } catch (error) {
      handleErrorServer(res, 500, error.message);
    }
  },

  async modificarCliente(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;

      const [cliente, err] = await clienteService.modificarCliente(id, data);
      if (err) return handleErrorClient(res, 400, err);

      handleSuccess(res, 200, "Cliente modificado correctamente.", cliente);
    } catch (error) {
      handleErrorServer(res, 500, error.message);
    }
  },

  async eliminarCliente(req, res) {
    try {
      const { id } = req.params;

      const [_, err] = await clienteService.eliminarCliente(id);
      if (err) return handleErrorClient(res, 404, err);

      handleSuccess(res, 200, "Cliente eliminado correctamente.");
    } catch (error) {
      handleErrorServer(res, 500, error.message);
    }
  }
};
