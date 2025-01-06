"use strict";

import { AppDataSource } from "../config/configDb.js";
import Producto from "../entity/Producto.entity.js";
import { Like } from "typeorm";
import ExcelJS from "exceljs";

export const productoService = {
  async crearProducto(data) {
    try {
      const productoRepository = AppDataSource.getRepository(Producto);
      const nuevoProducto = productoRepository.create(data);
      await productoRepository.save(nuevoProducto);
      return [nuevoProducto, null];
    } catch (error) {
      console.error("Error en crearProducto:", error);
      return [null, "No se pudo crear el producto."];
    }
  },

  async obtenerProductos() {
    try {
      const productoRepository = AppDataSource.getRepository(Producto);
      const productos = await productoRepository.find({ relations: ["tipo", "marca"] });
      return [productos, null];
    } catch (error) {
      console.error("Error en obtenerProductos:", error);
      return [null, "Error al obtener los productos."];
    }
  },

  async filtrarProductosPorNombre(nombre) {
    try {
      const productoRepository = AppDataSource.getRepository(Producto);
      const productos = await productoRepository.find({
        where: { nombre: Like(`%${nombre}%`) }, // Usa Like para buscar por coincidencias parciales
        relations: ["tipo", "marca"],
      });
      return [productos, null];
    } catch (error) {
      console.error("Error en filtrarProductosPorNombre:", error);
      return [null, "Error al filtrar los productos por nombre."];
    }
  },

  async filtrarProductosPorMarca(nombreMarca) {
    try {
      const productoRepository = AppDataSource.getRepository(Producto);
      const productos = await productoRepository.find({
        where: { marca: { nombre: nombreMarca } }, // Relación con nombre de la marca
        relations: ["tipo", "marca"],
      });
      return [productos, null];
    } catch (error) {
      console.error("Error en filtrarProductosPorMarca:", error);
      return [null, "Error al filtrar los productos por marca."];
    }
  },

  async filtrarProductosPorTipo(nombreTipo) {
    try {
      const productoRepository = AppDataSource.getRepository(Producto);
      const productos = await productoRepository.find({
        where: { tipo: { nombre: nombreTipo } }, // Relación con nombre del tipo
        relations: ["tipo", "marca"],
      });
      return [productos, null];
    } catch (error) {
      console.error("Error en filtrarProductosPorTipo:", error);
      return [null, "Error al filtrar los productos por tipo."];
    }
  },

  async modificarProducto(id, datosActualizados) {
    try {
      const productoRepository = AppDataSource.getRepository(Producto);
      const producto = await productoRepository.findOneBy({ id });

      if (!producto) return [null, "Producto no encontrado."];

      Object.assign(producto, datosActualizados);
      await productoRepository.save(producto);

      return [producto, null];
    } catch (error) {
      console.error("Error en modificarProducto:", error);
      return [null, "No se pudo modificar el producto."];
    }
  },

  async eliminarProducto(id) {
    try {
      const productoRepository = AppDataSource.getRepository(Producto);
      const producto = await productoRepository.findOneBy({ id });

      if (!producto) return [null, "Producto no encontrado."];

      await productoRepository.remove(producto);
      return [null, null];
    } catch (error) {
      console.error("Error en eliminarProducto:", error);
      return [null, "No se pudo eliminar el producto."];
    }
  },

  async generarExcelProductos() {
    try {
        const productoRepository = AppDataSource.getRepository(Producto);
        const productos = await productoRepository.find({ relations: ["tipo", "marca"] });

        // Crear el workbook y la hoja
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Productos");

        // Definir las columnas
        worksheet.columns = [
            { header: "ID", key: "id", width: 10 },
            { header: "Nombre", key: "nombre", width: 20 },
            { header: "Variante", key: "variante", width: 15 },
            { header: "Precio Venta", key: "precioVenta", width: 15 },
            { header: "Precio Compra", key: "precioCompra", width: 15 },
            { header: "Stock", key: "stock", width: 10 },
            { header: "Fecha Vencimiento", key: "fechaVencimiento", width: 20 },
            { header: "Tipo", key: "tipo", width: 15 },
            { header: "Marca", key: "marca", width: 15 },
        ];

        // Agregar las filas
        productos.forEach((producto) => {
            worksheet.addRow({
                id: producto.id,
                nombre: producto.nombre,
                variante: producto.variante,
                precioVenta: producto.precioVenta,
                precioCompra: producto.precioCompra,
                stock: producto.stock,
                fechaVencimiento: producto.fechaVencimiento || "N/A",
                tipo: producto.tipo?.nombre || "N/A",
                marca: producto.marca?.nombre || "N/A",
            });
        });

        // Estilizar la cabecera
        worksheet.getRow(1).font = { bold: true };

        // Retornar el workbook
        return workbook;
    } catch (error) {
        console.error("Error al generar el Excel de productos:", error);
        throw new Error("No se pudo generar el archivo Excel.");
    }
}
};
