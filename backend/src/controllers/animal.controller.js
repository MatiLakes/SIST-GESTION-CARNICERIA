"use strict";
import {
  createAnimalVaraService,
  updateCorteCantidadPrecioService,
  duplicarAnimalBaseComo,
} from "../services/animal.service.js";
import { animalVaraValidation, animalCortesValidation } from "../validations/animal.validation.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";

// Registrar una nueva vara
export async function createAnimalVara(req, res) {
  const { error } = animalVaraValidation.validate(req.body);
  if (error) return handleErrorClient(res, 400, error.message);

  try {
    const [animalVara, errorService] = await createAnimalVaraService(req.body);
    if (errorService) return handleErrorClient(res, 400, errorService);
    handleSuccess(res, 201, "Vara registrada correctamente", animalVara);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Actualizar cantidad y precio del corte
export async function updateCorteCantidadPrecio(req, res) {
  const { error } = animalCortesValidation.validate(req.body);
  if (error) return handleErrorClient(res, 400, error.message);

  try {
    const { id } = req.params;
    const [corteActualizado, errorService] = await updateCorteCantidadPrecioService(id, req.body);
    if (errorService) return handleErrorClient(res, 400, errorService);
    handleSuccess(res, 200, "Cantidad y precio del corte actualizados", corteActualizado);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// Duplicar el tipo de animal base
export async function duplicarAnimalBase(req, res) {
  const { tipoAnimalNuevo, ajustesCortes } = req.body;

  try {
    const [mensaje, errorService] = await duplicarAnimalBaseComo(tipoAnimalNuevo, ajustesCortes);

    if (errorService) return handleErrorClient(res, 400, errorService);
    handleSuccess(res, 200, mensaje);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}
