"use strict";
import {
  actualizarCategoriaService,
  crearCategoriaService,
  eliminarCategoriaService,
  obtenerCategoriaService,
  obtenerCategoriasService,
  obtenerCategoriasCarnicasService,
  obtenerCategoriasNoCarnicasService,
} from "../services/categoria.service.js"; 
import {
  categoriaBodyValidation,
  categoriaQueryValidation,
} from "../validations/categoria.validation.js"; 
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";

// Crear una nueva categoría
export async function crearCategoria(req, res) {
  try {
    const { body } = req;

    // Validar los datos del cuerpo de la solicitud
    const { error } = categoriaBodyValidation.validate(body);
    if (error) {
      return handleErrorClient(res, 400, "Error de validación", error.message);
    }

    // Llamar al servicio para crear la categoría
    const [categoria, errorCrear] = await crearCategoriaService(body);
    if (errorCrear) {
      return handleErrorClient(res, 400, "Error creando la categoría", errorCrear);
    }

    handleSuccess(res, 201, "Categoría creada correctamente", categoria);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Obtener todas las categorías
export async function obtenerCategorias(req, res) {
  try {
    const [categorias, errorCategorias] = await obtenerCategoriasService();
    if (errorCategorias) {
      return handleErrorClient(res, 404, errorCategorias);
    }

    categorias.length === 0
      ? handleSuccess(res, 204) // No Content
      : handleSuccess(res, 200, "Categorías encontradas", categorias);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Obtener categorías cárnicas
export async function obtenerCategoriasCarnicas(req, res) {
  try {
    const [categoriasCarnicas, errorCategorias] = await obtenerCategoriasCarnicasService();
    if (errorCategorias) {
      return handleErrorClient(res, 404, errorCategorias);
    }

    categoriasCarnicas.length === 0
      ? handleSuccess(res, 204) // No Content
      : handleSuccess(res, 200, "Categorías cárnicas encontradas", categoriasCarnicas);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Obtener categorías no cárnicas
export async function obtenerCategoriasNoCarnicas(req, res) {
  try {
    const [categoriasNoCarnicas, errorCategorias] = await obtenerCategoriasNoCarnicasService();
    if (errorCategorias) {
      return handleErrorClient(res, 404, errorCategorias);
    }

    categoriasNoCarnicas.length === 0
      ? handleSuccess(res, 204) // No Content
      : handleSuccess(res, 200, "Categorías no cárnicas encontradas", categoriasNoCarnicas);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Obtener una categoría por ID
export async function obtenerCategoria(req, res) {
  try {
    const { id } = req.params;

    // Validar el ID de la consulta
    const { error } = categoriaQueryValidation.validate({ id });
    if (error) {
      return handleErrorClient(res, 400, "Error de validación en la consulta", error.message);
    }

    // Llamar al servicio para obtener la categoría por ID
    const [categoria, errorCategoria] = await obtenerCategoriaService(id);
    if (errorCategoria) {
      return handleErrorClient(res, 404, "Categoría no encontrada", errorCategoria);
    }

    handleSuccess(res, 200, "Categoría encontrada", categoria);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Actualizar una categoría
export async function actualizarCategoria(req, res) {
  try {
    const { id } = req.params;
    const { body } = req;

    // Validar el ID de la consulta
    const { error: queryError } = categoriaQueryValidation.validate({ id });
    if (queryError) {
      return handleErrorClient(res, 400, "Error de validación en la consulta", queryError.message);
    }

    // Validar el cuerpo de la solicitud
    const { error: bodyError } = categoriaBodyValidation.validate(body);
    if (bodyError) {
      return handleErrorClient(res, 400, "Error de validación en los datos enviados", bodyError.message);
    }

    // Llamar al servicio para actualizar la categoría
    const [categoria, errorActualizar] = await actualizarCategoriaService(id, body);
    if (errorActualizar) {
      return handleErrorClient(res, 400, "Error actualizando la categoría", errorActualizar);
    }

    handleSuccess(res, 200, "Categoría actualizada correctamente", categoria);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Eliminar una categoría
export async function eliminarCategoria(req, res) {
  try {
    const { id } = req.params;

    // Validar el ID de la consulta
    const { error } = categoriaQueryValidation.validate({ id });
    if (error) {
      return handleErrorClient(res, 400, "Error de validación en la consulta", error.message);
    }

    // Llamar al servicio para eliminar la categoría
    const [categoriaEliminada, errorEliminar] = await eliminarCategoriaService(id);
    if (errorEliminar) {
      return handleErrorClient(res, 404, "Error eliminando la categoría", errorEliminar);
    }

    handleSuccess(res, 200, "Categoría eliminada correctamente", categoriaEliminada);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}
