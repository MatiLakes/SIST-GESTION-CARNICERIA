"use strict";
import { AppDataSource } from "../config/configDb.js";
import ProductosNoCarnicosSchema from "../entity/productosNoCarnicos.entity.js";
import { CategoriaSchema } from "../entity/categoria.entity.js"; // Asegúrate de importar la categoría

// Crear Producto No Cárnico
export async function createproductosNoCarnicoservice(data) {
  try {
    const productosNoCarnicosRepository = AppDataSource.getRepository(ProductosNoCarnicosSchema);
    const categoriaRepository = AppDataSource.getRepository(CategoriaSchema);

    // Buscar la categoría por nombre
    const categoria = await categoriaRepository.findOne({ where: { nombre: data.categoria } });

    if (!categoria) {
      return [null, "Categoría no encontrada."]; // Mensaje de error si la categoría no existe
    }

    // Crear el nuevo producto no cárnico con la relación de categoría
    const nuevoProducto = productosNoCarnicosRepository.create({
      nombre: data.nombre,
      cantidad_recibida: data.cantidad_recibida,
      precio_compra: data.precio_compra,
      precio_venta: data.precio_venta,
      fecha_vencimiento: data.fecha_vencimiento,
      fecha_llegada: data.fecha_llegada,
      categoria: categoria, // Aquí se guarda la categoría completa, asociándola por ID
    });

    const productoGuardado = await productosNoCarnicosRepository.save(nuevoProducto);
    return [productoGuardado, null];
  } catch (error) {
    console.error("Error al crear el producto no cárnico:", error);
    return [null, "Error interno del servidor"];
  }
}

// Actualizar Producto No Cárnico
export async function updateproductosNoCarnicoservice(id, data) {
  try {
    const productosNoCarnicosRepository = AppDataSource.getRepository(ProductosNoCarnicosSchema);
    const categoriaRepository = AppDataSource.getRepository(CategoriaSchema);

    const producto = await productosNoCarnicosRepository.findOne({ where: { id }, relations: ["categoria"] });
    if (!producto) return [null, "Producto no cárnico no encontrado."];

    // Si se actualiza la categoría, validamos que exista
    if (data.categoria) {
      const categoria = await categoriaRepository.findOne({ where: { nombre: data.categoria } });
      if (!categoria) {
        return [null, "Categoría no encontrada."]; // Mensaje de error si la categoría no existe
      }
      producto.categoria = categoria; // Actualizamos la categoría del producto
    }

    // Actualizamos los demás campos
    Object.keys(data).forEach((key) => {
      if (data[key] !== undefined) producto[key] = data[key];
    });

    const productoActualizado = await productosNoCarnicosRepository.save(producto);
    return [productoActualizado, null];
  } catch (error) {
    console.error("Error al actualizar el producto no cárnico:", error);
    return [null, "Error interno del servidor"];
  }
}

// Eliminar Producto No Cárnico
export async function deleteproductosNoCarnicoservice(id) {
  try {
    const productosNoCarnicosRepository = AppDataSource.getRepository(ProductosNoCarnicosSchema);

    const producto = await productosNoCarnicosRepository.findOne({ where: { id } });
    if (!producto) return [null, "Producto no cárnico no encontrado."];

    await productosNoCarnicosRepository.remove(producto);
    return ["Producto no cárnico eliminado correctamente.", null];
  } catch (error) {
    console.error("Error al eliminar el producto no cárnico:", error);
    return [null, "Error interno del servidor"];
  }
}

// Obtener Todos los Productos No Cárnicos
export async function getAllproductosNoCarnicosService() {
  try {
    const productosNoCarnicosRepository = AppDataSource.getRepository(ProductosNoCarnicosSchema);
    const productos = await productosNoCarnicosRepository.find({ relations: ["categoria"] });

    return [productos, null];
  } catch (error) {
    console.error("Error al obtener todos los productos no cárnicos:", error);
    return [null, "Error interno del servidor"];
  }
}

// Obtener Producto No Cárnico por ID
export async function getProductoNoCarnicoByIdService(id) {
  try {
    const productosNoCarnicosRepository = AppDataSource.getRepository(ProductosNoCarnicosSchema);
    const producto = await productosNoCarnicosRepository.findOne({ where: { id }, relations: ["categoria"] });

    if (!producto) return [null, "Producto no cárnico no encontrado."];

    return [producto, null];
  } catch (error) {
    console.error("Error al obtener el producto no cárnico por ID:", error);
    return [null, "Error interno del servidor"];
  }
}
