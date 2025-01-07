"use strict";
import {
  createProveedorService,
  deleteProveedorService,
  getAllProveedoresService,
  getProveedorByIdService,
  updateProveedorService
} from "../services/proveedor.service.js";
import { proveedorBodyValidation } from "../validations/proveedor.validation.js"; // Mantén solo esta importación
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";

// Crear proveedor
export async function createProveedor(req, res) {
  const { error } = proveedorBodyValidation.validate(req.body);
  if (error) return handleErrorClient(res, 400, error.message);

  try {
    const [proveedor, errorService] = await createProveedorService(req.body);
    if (errorService) return handleErrorClient(res, 400, errorService);
    handleSuccess(res, 201, "Proveedor creado correctamente.", proveedor);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Actualizar proveedor
export async function updateProveedor(req, res) {
  const { id } = req.params;
  const { error } = proveedorBodyValidation.validate(req.body);
  if (error) return handleErrorClient(res, 400, error.message);

  try {
    const [proveedorActualizado, errorService] = await updateProveedorService(id, req.body);
    if (errorService) return handleErrorClient(res, 400, errorService);
    handleSuccess(res, 200, "Proveedor actualizado correctamente.", proveedorActualizado);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Eliminar proveedor
export async function deleteProveedor(req, res) {
  const { id } = req.params;

  try {
    const [mensaje, errorService] = await deleteProveedorService(id);
    if (errorService) return handleErrorClient(res, 400, errorService);
    handleSuccess(res, 200, mensaje);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Obtener todos los proveedores
export async function getAllProveedores(req, res) {
  try {
    const [proveedores, errorService] = await getAllProveedoresService();
    if (errorService) return handleErrorClient(res, 500, errorService);
    handleSuccess(res, 200, "Lista de proveedores obtenida con éxito.", proveedores);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Obtener proveedor por ID
export async function getProveedorById(req, res) {
  const { id } = req.params;

  try {
    const [proveedor, errorService] = await getProveedorByIdService(id);

    if (errorService) return handleErrorClient(res, 404, errorService);
    handleSuccess(res, 200, "Proveedor obtenido con éxito.", proveedor);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}
