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

  async eliminarMarcaProducto(id) {
    try {
      const marcaProductoRepository = AppDataSource.getRepository(MarcaProducto);
      
      // Verificar si la marca existe
      const marcaProducto = await marcaProductoRepository.findOneBy({ id });
      if (!marcaProducto) {
        return [null, "La marca de producto no existe."];
      }

      // Verificar si la marca está siendo usada por algún producto
      const productoRepository = AppDataSource.getRepository('Producto');
      const productoConMarca = await productoRepository.findOne({
        where: { marca: { id } }
      });

      if (productoConMarca) {
        return [null, "No se puede eliminar la marca porque está siendo utilizada por productos."];
      }

      await marcaProductoRepository.remove(marcaProducto);
      return [{ message: "Marca de producto eliminada correctamente." }, null];
    } catch (error) {
      console.error("Error en eliminarMarcaProducto:", error);
      return [null, "Error al eliminar la marca de producto."];
    }
  },

  async actualizarMarcaProducto(id, data) {
    try {
      const marcaProductoRepository = AppDataSource.getRepository(MarcaProducto);
      
      // Verificar si la marca existe
      const marcaProducto = await marcaProductoRepository.findOneBy({ id });
      if (!marcaProducto) {
        return [null, "La marca de producto no existe."];
      }

      // Verificar si ya existe otra marca con el mismo nombre
      if (data.nombre && data.nombre !== marcaProducto.nombre) {
        const marcaExistente = await marcaProductoRepository.findOneBy({ nombre: data.nombre });
        if (marcaExistente) {
          return [null, "Ya existe una marca de producto con ese nombre."];
        }
      }

      // Actualizar los datos
      Object.assign(marcaProducto, data);
      await marcaProductoRepository.save(marcaProducto);
      
      return [marcaProducto, null];
    } catch (error) {
      console.error("Error en actualizarMarcaProducto:", error);
      return [null, "Error al actualizar la marca de producto."];
    }
  }
};
