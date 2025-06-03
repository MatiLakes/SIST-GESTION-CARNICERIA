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

  async eliminarTipoProducto(id) {
    try {
      const tipoProductoRepository = AppDataSource.getRepository(TipoProducto);
      
      // Verificar si el tipo existe
      const tipoProducto = await tipoProductoRepository.findOneBy({ id });
      if (!tipoProducto) {
        return [null, "El tipo de producto no existe."];
      }

      // Verificar si el tipo está siendo usado por algún producto
      const productoRepository = AppDataSource.getRepository('Producto');
      const productoConTipo = await productoRepository.findOne({
        where: { tipo: { id } }
      });

      if (productoConTipo) {
        return [null, "No se puede eliminar el tipo porque está siendo utilizado por productos."];
      }

      await tipoProductoRepository.remove(tipoProducto);
      return [{ message: "Tipo de producto eliminado correctamente." }, null];
    } catch (error) {
      console.error("Error en eliminarTipoProducto:", error);
      return [null, "Error al eliminar el tipo de producto."];
    }
  },

  async actualizarTipoProducto(id, data) {
    try {
      const tipoProductoRepository = AppDataSource.getRepository(TipoProducto);
      
      // Verificar si el tipo existe
      const tipoProducto = await tipoProductoRepository.findOneBy({ id });
      if (!tipoProducto) {
        return [null, "El tipo de producto no existe."];
      }

      // Verificar si ya existe otro tipo con el mismo nombre
      if (data.nombre && data.nombre !== tipoProducto.nombre) {
        const tipoExistente = await tipoProductoRepository.findOneBy({ nombre: data.nombre });
        if (tipoExistente) {
          return [null, "Ya existe un tipo de producto con ese nombre."];
        }
      }

      // Actualizar los datos
      Object.assign(tipoProducto, data);
      await tipoProductoRepository.save(tipoProducto);
      
      return [tipoProducto, null];
    } catch (error) {
      console.error("Error en actualizarTipoProducto:", error);
      return [null, "Error al actualizar el tipo de producto."];
    }
  }
};
