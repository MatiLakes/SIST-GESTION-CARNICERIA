"use strict";

import {
  createproductosCarnicoservice,
  deleteproductosCarnicoservice,
  getAllProductosCarnicosService,
  getProductoCarnicoByIdService,
  updateproductosCarnicoservice,
} from "../services/productosCarnicos.service.js";  // CORRIGIENDO LA RUTA

import { productosCarnicosValidation } from "../validations/productosCarnicos.validation.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";


// Controladores para productos cárnicos
export async function createProductoCarnico(req, res) {
  const { error } = productosCarnicosValidation.validate(req.body);
  if (error) return handleErrorClient(res, 400, error.message);

  try {
    const [productoCarnico, errorService] = await createproductosCarnicoservice(req.body);
    if (errorService) return handleErrorClient(res, 400, errorService);
    handleSuccess(res, 201, "Producto cárnico creado correctamente.", productoCarnico);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function updateProductoCarnico(req, res) {
  const { id } = req.params;
  const { error } = productosCarnicosValidation.validate(req.body);
  if (error) return handleErrorClient(res, 400, error.message);

  try {
    const [productoCarnicoActualizado, errorService] = await updateproductosCarnicoservice(id, req.body);
    if (errorService) return handleErrorClient(res, 400, errorService);
    handleSuccess(res, 200, "Producto cárnico actualizado correctamente.", productoCarnicoActualizado);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function deleteProductoCarnico(req, res) {
  const { id } = req.params;

  try {
    const [mensaje, errorService] = await deleteproductosCarnicoservice(id);
    if (errorService) return handleErrorClient(res, 400, errorService);
    handleSuccess(res, 200, mensaje);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function getAllProductosCarnicos(req, res) {
  try {
    const [productosCarnicos, errorService] = await getAllProductosCarnicosService();
    if (errorService) return handleErrorClient(res, 500, errorService);
    handleSuccess(res, 200, "Lista de productos cárnicos obtenida con éxito.", productosCarnicos);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function getProductoCarnicoById(req, res) {
  const { id } = req.params;

  try {
    const [productoCarnico, errorService] = await getProductoCarnicoByIdService(id);

    if (errorService) return handleErrorClient(res, 404, errorService);
    handleSuccess(res, 200, "Producto cárnico obtenido con éxito.", productoCarnico);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}
