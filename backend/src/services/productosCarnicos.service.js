"use strict";
import { AppDataSource } from "../config/configDb.js";
import ProductosCarnicosSchema from "../entity/productosCarnicos.entity.js";
import { CategoriaSchema } from "../entity/categoria.entity.js"; // Asegúrate de importar la categoría

export async function createproductosCarnicoservice(data) {
  try {
    const productosCarnicosRepository = AppDataSource.getRepository(ProductosCarnicosSchema);
    const categoriaRepository = AppDataSource.getRepository(CategoriaSchema);

    // Buscar la categoría por nombre
    const categoria = await categoriaRepository.findOne({ where: { nombre: data.categoria } });

    // Validación: Si la categoría no existe, retornamos un error
    if (!categoria) {
      return [null, "La categoría seleccionada no es válida."];  // Mensaje personalizado
    }

    // Crear el nuevo producto cárnico con la relación de categoría usando el objeto de categoría
    const nuevoProducto = productosCarnicosRepository.create({
      tipo_producto: data.tipo_producto,
      marca: data.marca,
      cantidad_kg: data.cantidad_kg,
      precio_kg_compra: data.precio_kg_compra,
      precio_kg_venta: data.precio_kg_venta,
      fecha_vencimiento: data.fecha_vencimiento,
      fecha_llegada: data.fecha_llegada,
      categoria: categoria,  // Aquí se guarda la categoría completa, que se asocia por nombre
    });

    const productoGuardado = await productosCarnicosRepository.save(nuevoProducto);
    return [productoGuardado, null];
  } catch (error) {
    console.error("Error al crear el producto cárnico:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function updateproductosCarnicoservice(id, data) {
  try {
    const productosCarnicosRepository = AppDataSource.getRepository(ProductosCarnicosSchema);
    const categoriaRepository = AppDataSource.getRepository(CategoriaSchema);

    // Buscar el producto cárnico por ID, incluyendo la relación con la categoría
    const producto = await productosCarnicosRepository.findOne({ where: { id }, relations: ["categoria"] });
    if (!producto) return [null, "Producto cárnico no encontrado."];

    // Si se actualiza la categoría, buscamos la categoría por nombre y la asociamos
    if (data.categoria) {
      const categoria = await categoriaRepository.findOne({ where: { nombre: data.categoria } });
      
      // Validación: Si la categoría no existe, retornamos un error
      if (!categoria) {
        return [null, "La categoría seleccionada no es válida."];  // Mensaje personalizado
      }
      producto.categoria = categoria;  // Actualizamos la categoría del producto
    }

    // Actualizamos los demás campos
    Object.keys(data).forEach((key) => {
      if (data[key] !== undefined && key !== "categoria") {
        producto[key] = data[key];
      }
    });

    // Guardar el producto actualizado
    const productoActualizado = await productosCarnicosRepository.save(producto);
    return [productoActualizado, null];
  } catch (error) {
    console.error("Error al actualizar el producto cárnico:", error);
    return [null, "Error interno del servidor"];
  }
}

// Eliminar Producto Cárnico
export async function deleteproductosCarnicoservice(id) {
  try {
    const productosCarnicosRepository = AppDataSource.getRepository(ProductosCarnicosSchema);

    const producto = await productosCarnicosRepository.findOne({ where: { id } });
    if (!producto) return [null, "Producto cárnico no encontrado."];

    await productosCarnicosRepository.remove(producto);
    return ["Producto cárnico eliminado correctamente.", null];
  } catch (error) {
    console.error("Error al eliminar el producto cárnico:", error);
    return [null, "Error interno del servidor"];
  }
}

// Obtener Todos los Productos Cárnicos
export async function getAllProductosCarnicosService() {
  try {
    const productosCarnicosRepository = AppDataSource.getRepository(ProductosCarnicosSchema);
    const productos = await productosCarnicosRepository.find({ relations: ["categoria"] });

    return [productos, null];
  } catch (error) {
    console.error("Error al obtener todos los productos cárnicos:", error);
    return [null, "Error interno del servidor"];
  }
}

// Obtener Producto Cárnico por ID
export async function getProductoCarnicoByIdService(id) {
  try {
    const productosCarnicosRepository = AppDataSource.getRepository(ProductosCarnicosSchema);
    const producto = await productosCarnicosRepository.findOne({ where: { id }, relations: ["categoria"] });

    if (!producto) return [null, "Producto cárnico no encontrado."];

    return [producto, null];
  } catch (error) {
    console.error("Error al obtener el producto cárnico por ID:", error);
    return [null, "Error interno del servidor"];
  }
}
