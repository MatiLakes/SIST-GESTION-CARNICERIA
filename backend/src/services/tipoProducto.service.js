"use strict";

import { AppDataSource } from "../config/configDb.js";
import TipoProducto from "../entity/TipoProducto.entity.js";

export const tipoProductoService = {
  async crearTipoProducto(data) {
    try {
      const tipoProductoRepository = AppDataSource.getRepository(TipoProducto);

      // Verificar si ya existe un tipo con el mismo nombre
      const tipoExistente = await tipoProductoRepository.findOneBy({ nombre: data.nombre });
      if (tipoExistente) {
        return [null, "El tipo de producto ya existe."];
      }

      const nuevoTipoProducto = tipoProductoRepository.create(data);
      await tipoProductoRepository.save(nuevoTipoProducto);
      return [nuevoTipoProducto, null];
    } catch (error) {
      console.error("Error en crearTipoProducto:", error);
      return [null, "No se pudo crear el tipo de producto."];
    }
  },

  async obtenerTiposProductos() {
    try {
      const tipoProductoRepository = AppDataSource.getRepository(TipoProducto);
      const tiposProductos = await tipoProductoRepository.find();
      return [tiposProductos, null];
    } catch (error) {
      console.error("Error en obtenerTiposProductos:", error);
      return [null, "Error al obtener los tipos de productos."];
    }
  },
};
