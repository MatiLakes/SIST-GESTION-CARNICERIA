"use strict";
import {
  actualizarCategoriaService,
  crearCategoriaService,
  eliminarCategoriaService,
  obtenerCategoriaService,
  obtenerCategoriasService,
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

export async function crearCategoria(req, res) {
  try {
    const { body } = req;

    // Validar los datos del cuerpo de la solicitud
    const { error } = categoriaBodyValidation.validate(body);
    if (error) {
      return handleErrorClient(res, 400, "Error de validación", error.message);
    }

    const [categoria, errorCrear] = await crearCategoriaService(body);
    if (errorCrear) {
      return handleErrorClient(res, 400, "Error creando la categoría", errorCrear);
    }

    handleSuccess(res, 201, "Categoría creada correctamente", categoria);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

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

export async function obtenerCategoria(req, res) {
  try {
    const { id } = req.params;

    const { error } = categoriaQueryValidation.validate({ id });
    if (error) {
      return handleErrorClient(res, 400, "Error de validación en la consulta", error.message);
    }

    const [categoria, errorCategoria] = await obtenerCategoriaService(id);
    if (errorCategoria) {
      return handleErrorClient(res, 404, "Categoría no encontrada", errorCategoria);
    }

    handleSuccess(res, 200, "Categoría encontrada", categoria);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function actualizarCategoria(req, res) {
  try {
    const { id } = req.params;
    const { body } = req;

    const { error: queryError } = categoriaQueryValidation.validate({ id });
    if (queryError) {
      return handleErrorClient(res, 400, "Error de validación en la consulta", queryError.message);
    }

    const { error: bodyError } = categoriaBodyValidation.validate(body);
    if (bodyError) {
      return handleErrorClient(res, 400, "Error de validación en los datos enviados", bodyError.message);
    }

    const [categoria, errorActualizar] = await actualizarCategoriaService(id, body);
    if (errorActualizar) {
      return handleErrorClient(res, 400, "Error actualizando la categoría", errorActualizar);
    }

    handleSuccess(res, 200, "Categoría actualizada correctamente", categoria);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function eliminarCategoria(req, res) {
  try {
    const { id } = req.params;

    const { error } = categoriaQueryValidation.validate({ id });
    if (error) {
      return handleErrorClient(res, 400, "Error de validación en la consulta", error.message);
    }

    const [categoriaEliminada, errorEliminar] = await eliminarCategoriaService(id);
    if (errorEliminar) {
      return handleErrorClient(res, 404, "Error eliminando la categoría", errorEliminar);
    }

    handleSuccess(res, 200, "Categoría eliminada correctamente", categoriaEliminada);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}
