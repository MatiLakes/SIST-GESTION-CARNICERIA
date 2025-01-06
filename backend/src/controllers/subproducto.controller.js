"use strict";
import {
  createSubproductoService,
  updateSubproductoService,
  deleteSubproductoService,
  getAllSubproductosService,
  getSubproductoByIdService,
} from "../services/subproducto.service.js";
import { subproductoValidation } from "../validations/subproducto.validation.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";

export async function createSubproducto(req, res) {
  const { error } = subproductoValidation.validate(req.body);
  if (error) return handleErrorClient(res, 400, error.message);

  try {
    const [subproducto, errorService] = await createSubproductoService(req.body);
    if (errorService) return handleErrorClient(res, 400, errorService);
    handleSuccess(res, 201, "Subproducto creado correctamente.", subproducto);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function updateSubproducto(req, res) {
  const { id } = req.params;
  const { error } = subproductoValidation.validate(req.body);
  if (error) return handleErrorClient(res, 400, error.message);

  try {
    const [subproductoActualizado, errorService] = await updateSubproductoService(id, req.body);
    if (errorService) return handleErrorClient(res, 400, errorService);
    handleSuccess(res, 200, "Subproducto actualizado correctamente.", subproductoActualizado);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function deleteSubproducto(req, res) {
  const { id } = req.params;

  try {
    const [mensaje, errorService] = await deleteSubproductoService(id);
    if (errorService) return handleErrorClient(res, 400, errorService);
    handleSuccess(res, 200, mensaje);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function getAllSubproductos(req, res) {
  try {
    const [subproductos, errorService] = await getAllSubproductosService();
    if (errorService) return handleErrorClient(res, 500, errorService);
    handleSuccess(res, 200, "Lista de Subproductos obtenida con éxito.", subproductos);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function getSubproductoById(req, res) {
  const { id } = req.params;

  try {
    const [subproducto, errorService] = await getSubproductoByIdService(id);
    if (errorService) return handleErrorClient(res, 404, errorService);
    handleSuccess(res, 200, "Subproducto obtenido con éxito.", subproducto);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}
