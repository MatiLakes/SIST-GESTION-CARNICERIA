"use strict";

import { AppDataSource } from "../config/configDb.js";
import MarcaProducto from "../entity/MarcaProducto.entity.js";

export const marcaProductoService = {
  async crearMarcaProducto(data) {
    try {
      const marcaProductoRepository = AppDataSource.getRepository(MarcaProducto);

      // Verificar si ya existe una marca con el mismo nombre
      const marcaExistente = await marcaProductoRepository.findOneBy({ nombre: data.nombre });
      if (marcaExistente) {
        return [null, "La marca ya existe."];
      }

      const nuevaMarcaProducto = marcaProductoRepository.create(data);
      await marcaProductoRepository.save(nuevaMarcaProducto);
      return [nuevaMarcaProducto, null];
    } catch (error) {
      console.error("Error en crearMarcaProducto:", error);
      return [null, "No se pudo crear la marca de producto."];
    }
  },

  async obtenerMarcasProductos() {
    try {
      const marcaProductoRepository = AppDataSource.getRepository(MarcaProducto);
      const marcasProductos = await marcaProductoRepository.find();
      return [marcasProductos, null];
    } catch (error) {
      console.error("Error en obtenerMarcasProductos:", error);
      return [null, "Error al obtener las marcas de productos."];
    }
  },
};
