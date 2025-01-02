"use strict";

import { AppDataSource } from "../config/configDb.js";
import Pedido from "../entity/pedido.entity.js";

export const pedidoService = {
  async crearPedido(data) {
    try {
      const pedidoRepository = AppDataSource.getRepository(Pedido);
      const nuevoPedido = pedidoRepository.create(data);
      await pedidoRepository.save(nuevoPedido);
      return [nuevoPedido, null];
    } catch (error) {
      console.error("Error en crearPedido:", error);
      return [null, "Ocurrió un error al crear el pedido."];
    }
  },

  async obtenerPedidos() {
    try {
      const pedidoRepository = AppDataSource.getRepository(Pedido);
      const pedidos = await pedidoRepository.find();
      return [pedidos, null];
    } catch (error) {
      console.error("Error en obtenerPedidos:", error);
      return [null, "Ocurrió un error al obtener los pedidos."];
    }
  },

  async obtenerPedidosPorFechaEntrega(fecha) {
    try {
      const pedidoRepository = AppDataSource.getRepository(Pedido);
      const pedidos = await pedidoRepository.find({
        where: { fecha_entrega: fecha },
      });
      return [pedidos, null];
    } catch (error) {
      console.error("Error en obtenerPedidosPorFechaEntrega:", error);
      return [null, "Ocurrió un error al filtrar los pedidos por fecha de entrega."];
    }
  },

  async obtenerPedidosPorFechaCreacion(fecha) {
    try {
      const pedidoRepository = AppDataSource.getRepository(Pedido);
      const pedidos = await pedidoRepository.find({
        where: `DATE(createdAt) = '${fecha}'`, // Filtrar por la fecha exacta en formato `DATE`
      });
      return [pedidos, null];
    } catch (error) {
      console.error("Error en obtenerPedidosPorFechaCreacion:", error);
      return [null, "Ocurrió un error al filtrar los pedidos por fecha de creación."];
    }
  },

  async eliminarPedido(id) {
    try {
      const pedidoRepository = AppDataSource.getRepository(Pedido);
      const pedido = await pedidoRepository.findOneBy({ id });
      if (!pedido) return [null, "Pedido no encontrado."];
      await pedidoRepository.remove(pedido);
      return [null, null];
    } catch (error) {
      console.error("Error en eliminarPedido:", error);
      return [null, "Ocurrió un error al eliminar el pedido."];
    }
  },

  async actualizarPedido(id, data) {
    try {
      const pedidoRepository = AppDataSource.getRepository(Pedido);
      const pedidoExistente = await pedidoRepository.findOneBy({ id });
  
      if (!pedidoExistente) {
        return [null, "Pedido no encontrado."];
      }
  
      const pedidoActualizado = Object.assign(pedidoExistente, data);
      await pedidoRepository.save(pedidoActualizado);
  
      return [pedidoActualizado, null];
    } catch (error) {
      console.error("Error en actualizarPedido:", error);
      return [null, "Ocurrió un error al actualizar el pedido."];
    }
  }
};


