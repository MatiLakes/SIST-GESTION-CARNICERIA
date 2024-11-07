"use strict";
import {
  actualizarProveedorService,
  crearProveedorService,
  eliminarProveedorService,
  obtenerProveedoresService,
  obtenerProveedorService,
} from "../services/proveedor.service.js";
import {
  proveedorBodyValidation,
  proveedorQueryValidation,
} from "../validations/proveedor.validation.js";
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";

export async function crearProveedor(req, res) {
  try {
    const { body } = req;

    // Validar los datos del cuerpo de la solicitud
    const { error } = proveedorBodyValidation.validate(body);
    if (error) {
      return handleErrorClient(res, 400, "Error de validación", error.message);
    }

    const [proveedor, errorCrear] = await crearProveedorService(body);
    if (errorCrear) return handleErrorClient(res, 400, "Error creando el proveedor", errorCrear);

    handleSuccess(res, 201, "Proveedor creado correctamente", proveedor);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function obtenerProveedores(req, res) {
  try {
    const [proveedores, errorProveedores] = await obtenerProveedoresService();
    if (errorProveedores) return handleErrorClient(res, 404, errorProveedores);

    proveedores.length === 0
      ? handleSuccess(res, 204)
      : handleSuccess(res, 200, "Proveedores encontrados", proveedores);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function obtenerProveedor(req, res) {
  try {
    const { id } = req.params;

    const { error } = proveedorQueryValidation.validate({ id });
    if (error) {
      return handleErrorClient(res, 400, "Error de validación en la consulta", error.message);
    }

    const [proveedor, errorProveedor] = await obtenerProveedorService(id);
    if (errorProveedor) return handleErrorClient(res, 404, "Proveedor no encontrado", errorProveedor);

    handleSuccess(res, 200, "Proveedor encontrado", proveedor);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function actualizarProveedor(req, res) {
  try {
    const { id } = req.params;
    const { body } = req;

    const { error: queryError } = proveedorQueryValidation.validate({ id });
    if (queryError) {
      return handleErrorClient(res, 400, "Error de validación en la consulta", queryError.message);
    }

    const { error: bodyError } = proveedorBodyValidation.validate(body);
    if (bodyError) {
      return handleErrorClient(res, 400, "Error de validación en los datos enviados", bodyError.message);
    }

    const [proveedor, errorActualizar] = await actualizarProveedorService(id, body);
    if (errorActualizar) return handleErrorClient(res, 400, "Error actualizando el proveedor", errorActualizar);

    handleSuccess(res, 200, "Proveedor actualizado correctamente", proveedor);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function eliminarProveedor(req, res) {
  try {
    const { id } = req.params;

    const { error } = proveedorQueryValidation.validate({ id });
    if (error) {
      return handleErrorClient(res, 400, "Error de validación en la consulta", error.message);
    }

    const [proveedorEliminado, errorEliminar] = await eliminarProveedorService(id);
    if (errorEliminar) return handleErrorClient(res, 404, "Error eliminando el proveedor", errorEliminar);

    handleSuccess(res, 200, "Proveedor eliminado correctamente", proveedorEliminado);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}
