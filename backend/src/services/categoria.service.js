"use strict";
import { CATEGORIAS, CategoriaSchema } from "../entity/categoria.entity.js";  
import { AppDataSource } from "../config/configDb.js"; 

// Función para cargar categorías predeterminadas si no existen
export async function cargarCategoriasPredeterminadas() {
  try {
    const categoriaRepository = AppDataSource.getRepository(CategoriaSchema);
    
    // Verificar si ya existen las categorías predeterminadas
    for (const nombreCategoria of CATEGORIAS) {
      const existingCategoria = await categoriaRepository.findOne({
        where: { nombre: nombreCategoria },
      });

      if (!existingCategoria) {
        // Crear e insertar la categoría si no existe
        const nuevaCategoria = categoriaRepository.create({ nombre: nombreCategoria });
        await categoriaRepository.save(nuevaCategoria);
        console.log(`Categoría '${nombreCategoria}' insertada correctamente.`);
      }
    }
  } catch (error) {
    console.error("Error al cargar categorías predeterminadas:", error);
  }
}

// Servicio para crear una categoría
export async function crearCategoriaService(body) {
  try {
    const categoriaRepository = AppDataSource.getRepository(CategoriaSchema);

    const existingCategoria = await categoriaRepository.findOne({
      where: { nombre: body.nombre },
    });

    if (existingCategoria) {
      return [null, "Ya existe una categoría con el mismo nombre"];
    }

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

// Servicio para obtener una categoría por ID
export async function obtenerCategoriaService(id) {
  try {
    const categoriaRepository = AppDataSource.getRepository(CategoriaSchema);
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
    const categoriaFound = await categoriaRepository.findOneBy({ id });

    if (!categoriaFound) return [null, "Categoría no encontrada"];

    const existingCategoria = await categoriaRepository.findOne({
      where: [{ nombre: body.nombre }], // Ajusta el campo según tu esquema
    });

    if (existingCategoria && existingCategoria.id !== categoriaFound.id) {
      return [null, "Ya existe una categoría con el mismo nombre"];
    }

    const updatedCategoria = Object.assign(categoriaFound, body);
    await categoriaRepository.save(updatedCategoria);

    return [updatedCategoria, null];
  } catch (error) {
    console.error("Error al actualizar la categoría:", error);
    return [null, "Error interno del servidor"];
  }
}

// Servicio para eliminar una categoría
export async function eliminarCategoriaService(id) {
  try {
    const categoriaRepository = AppDataSource.getRepository(CategoriaSchema);
    const categoriaFound = await categoriaRepository.findOneBy({ id });

    if (!categoriaFound) return [null, "Categoría no encontrada"];

    await categoriaRepository.remove(categoriaFound);

    return [categoriaFound, null]; // Retorna la categoría eliminada
  } catch (error) {
    console.error("Error al eliminar la categoría:", error);
    return [null, "Error interno del servidor"];
  }
}
