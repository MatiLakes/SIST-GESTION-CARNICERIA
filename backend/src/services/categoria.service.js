"use strict";
import { CATEGORIAS, CategoriaSchema } from "../entity/categoria.entity.js";  
import { AppDataSource } from "../config/configDb.js";  

// Servicio para crear una categoría
export async function crearCategoriaService(body) {
  try {
    const categoriaRepository = AppDataSource.getRepository(CategoriaSchema);

    // Verificamos si ya existe una categoría con el mismo nombre
    const existingCategoria = await categoriaRepository.findOne({
      where: { nombre: body.nombre },
    });

    if (existingCategoria) {
      return [null, "Ya existe una categoría con el mismo nombre"];
    }

    // Creamos la nueva categoría con los datos proporcionados
    const nuevaCategoria = categoriaRepository.create(body);
    await categoriaRepository.save(nuevaCategoria);

    return [nuevaCategoria, null];
  } catch (error) {
    console.error("Error al crear la categoría:", error);
    return [null, "Error interno del servidor"];
  }
}

// Servicio para obtener todas las categorías
export async function obtenerCategoriasService() {
  try {
    const categoriaRepository = AppDataSource.getRepository(CategoriaSchema);
    const categorias = await categoriaRepository.find();

    if (!categorias || categorias.length === 0) return [null, "No hay categorías"];

    return [categorias, null];
  } catch (error) {
    console.error("Error al obtener las categorías:", error);
    return [null, "Error interno del servidor"];
  }
}

// Servicio para obtener categorías cárnicas
export async function obtenerCategoriasCarnicasService() {
  try {
    const categoriaRepository = AppDataSource.getRepository(CategoriaSchema);
    const categoriasCarnicas = await categoriaRepository.find({
      where: { tipo_producto: "Cárnico" }
    });

    if (!categoriasCarnicas || categoriasCarnicas.length === 0) {
      return [null, "No hay categorías cárnicas"];
    }

    return [categoriasCarnicas, null];
  } catch (error) {
    console.error("Error al obtener las categorías cárnicas:", error);
    return [null, "Error interno del servidor"];
  }
}

// Servicio para obtener categorías no cárnicas
export async function obtenerCategoriasNoCarnicasService() {
  try {
    const categoriaRepository = AppDataSource.getRepository(CategoriaSchema);
    const categoriasNoCarnicas = await categoriaRepository.find({
      where: { tipo_producto: "No Cárnico" }
    });

    if (!categoriasNoCarnicas || categoriasNoCarnicas.length === 0) {
      return [null, "No hay categorías no cárnicas"];
    }

    return [categoriasNoCarnicas, null];
  } catch (error) {
    console.error("Error al obtener las categorías no cárnicas:", error);
    return [null, "Error interno del servidor"];
  }
}

// Servicio para obtener una categoría por ID
export async function obtenerCategoriaService(id) {
  try {
    const categoriaRepository = AppDataSource.getRepository(CategoriaSchema);
    // Validamos que el ID sea un número entero positivo antes de la consulta
    if (!Number.isInteger(id) || id <= 0) {
      return [null, "El ID debe ser un número entero válido"];
    }

    const categoria = await categoriaRepository.findOneBy({ id });

    if (!categoria) return [null, "Categoría no encontrada"];

    return [categoria, null];
  } catch (error) {
    console.error("Error al obtener la categoría:", error);
    return [null, "Error interno del servidor"];
  }
}

// Servicio para actualizar una categoría
export async function actualizarCategoriaService(id, body) {
  try {
    const categoriaRepository = AppDataSource.getRepository(CategoriaSchema);
    
    // Validamos que el ID sea un número entero válido
    if (!Number.isInteger(id) || id <= 0) {
      return [null, "El ID debe ser un número entero válido"];
    }

    const categoriaFound = await categoriaRepository.findOneBy({ id });

    if (!categoriaFound) return [null, "Categoría no encontrada"];

    // Validamos si ya existe una categoría con el mismo nombre
    const existingCategoria = await categoriaRepository.findOne({
      where: [{ nombre: body.nombre }],
    });

    if (existingCategoria && existingCategoria.id !== categoriaFound.id) {
      return [null, "Ya existe una categoría con el mismo nombre"];
    }

    // Actualizamos la categoría con los nuevos datos
    const updatedCategoria = Object.assign(categoriaFound, body);
    await categoriaRepository.save(updatedCategoria);

    return [updatedCategoria, null];
  } catch (error) {
    console.error("Error al actualizar la categoría:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function eliminarCategoriaService(id) {
  try {
    // Validamos que el ID sea un número entero válido
    const parsedId = parseInt(id, 10); // Aseguramos que el ID sea un número entero
    if (!Number.isInteger(parsedId) || parsedId <= 0) {
      return [null, "El ID debe ser un número entero válido"];
    }

    const categoriaRepository = AppDataSource.getRepository(CategoriaSchema);
    const categoriaFound = await categoriaRepository.findOneBy({ id: parsedId });

    if (!categoriaFound) return [null, "Categoría no encontrada"];

    // Eliminamos la categoría de la base de datos
    await categoriaRepository.remove(categoriaFound);

    return [categoriaFound, null]; // Retorna la categoría eliminada
  } catch (error) {
    console.error("Error al eliminar la categoría:", error);
    return [null, "Error interno del servidor"];
  }
}



