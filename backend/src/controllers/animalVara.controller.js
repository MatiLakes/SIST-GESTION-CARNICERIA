"use strict";
import {
  createAnimalVaraService,
  updateAnimalVaraService,
  deleteAnimalVaraService,
  getAllAnimalVarasService,
  getVarasByFechaService,
  getVaraByIdService
} from "../services/animalVara.service.js";
import { getAllAnimalCortesService } from "../services/animalCorte.service.js";
import { animalVaraValidation } from "../validations/animalVara.validation.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";

export async function createAnimalVara(req, res) {
  try {
    const [animalCortes, errorService] = await getAllAnimalCortesService();
    if (errorService) return handleErrorClient(res, 400, "No se pudieron obtener las listas de animales.");

    const nombresDeListas = animalCortes.map((corte) => corte.nombreLista);

    const { error } = animalVaraValidation(nombresDeListas).validate(req.body);
    if (error) return handleErrorClient(res, 400, error.message);

    const [vara, serviceError] = await createAnimalVaraService(req.body);
    if (serviceError) return handleErrorClient(res, 400, serviceError);

    handleSuccess(res, 201, "Vara registrada correctamente.", vara);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}
export async function updateAnimalVara(req, res) {
  try {
    const [animalCortes, errorService] = await getAllAnimalCortesService();
    if (errorService) return handleErrorClient(res, 500, "Error al obtener listas de animales.");

    const { error } = animalVaraValidation(animalCortes.map((corte) => corte.nombreLista)).validate(req.body);
    if (error) return handleErrorClient(res, 400, error.message);

    const { id } = req.params;
    const [varaActualizada, serviceError] = await updateAnimalVaraService(id, req.body);
    if (serviceError) return handleErrorClient(res, 400, serviceError);

    handleSuccess(res, 200, "Vara actualizada correctamente.", varaActualizada);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function deleteAnimalVara(req, res) {
  const { id } = req.params;

  try {
    const [mensaje, errorService] = await deleteAnimalVaraService(id);
    if (errorService) return handleErrorClient(res, 400, errorService);
    handleSuccess(res, 200, mensaje);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function getAllAnimalVaras(req, res) {
  try {
    const [varas, errorService] = await getAllAnimalVarasService();
    if (errorService) return handleErrorClient(res, 500, errorService);
    handleSuccess(res, 200, "Lista de varas obtenida con éxito.", varas);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function getVarasByFecha(req, res) {
  try {
    const { fecha } = req.params;

    if (!fecha.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return handleErrorClient(res, 400, "La fecha debe estar en formato YYYY-MM-DD.");
    }

    const [varas, errorService] = await getVarasByFechaService(fecha);
    if (errorService) return handleErrorClient(res, 500, errorService);

    handleSuccess(res, 200, "Varas obtenidas con éxito por fecha.", varas);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function getVaraById(req, res) {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return handleErrorClient(res, 400, "El ID debe ser un número válido.");
    }

    const [vara, errorService] = await getVaraByIdService(id);
    if (errorService) return handleErrorClient(res, 400, errorService);

    handleSuccess(res, 200, "Vara obtenida con éxito.", vara);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}