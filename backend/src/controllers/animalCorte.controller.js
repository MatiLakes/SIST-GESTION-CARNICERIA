"use strict";
import {
  createAnimalCorteService,
  deleteAnimalCorteService,
  getAllAnimalCortesService,
  getAnimalCorteByIdService,
  updateAnimalCorteService
} from "../services/animalCorte.service.js";
import { animalCortesValidation } from "../validations/animalCortes.validation.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";
import { animalCorteService } from "../services/animalCorte.service.js";

export const animalCorteController = {
  async createAnimalCorte(req, res) {
    const { error } = animalCortesValidation.validate(req.body);
    if (error) return handleErrorClient(res, 400, error.message);

    try {
      const [animalCorte, errorService] = await createAnimalCorteService(req.body);
      if (errorService) return handleErrorClient(res, 400, errorService);
      handleSuccess(res, 201, "AnimalCorte creado correctamente.", animalCorte);
    } catch (error) {
      handleErrorServer(res, 500, error.message);
    }
  },

  async updateAnimalCorte(req, res) {
    const { id } = req.params;
    const { error } = animalCortesValidation.validate(req.body);
    if (error) return handleErrorClient(res, 400, error.message);

    try {
      const [animalCorteActualizado, errorService] = await updateAnimalCorteService(id, req.body);
      if (errorService) return handleErrorClient(res, 400, errorService);
      handleSuccess(res, 200, "AnimalCorte actualizado correctamente.", animalCorteActualizado);
    } catch (error) {
      handleErrorServer(res, 500, error.message);
    }
  },

  async deleteAnimalCorte(req, res) {
    const { id } = req.params;

    try {
      const [mensaje, errorService] = await deleteAnimalCorteService(id);
      if (errorService) return handleErrorClient(res, 400, errorService);
      handleSuccess(res, 200, mensaje);
    } catch (error) {
      handleErrorServer(res, 500, error.message);
    }
  },

  async getAllAnimalCortes(req, res) {
    try {
      const [animalCortes, errorService] = await getAllAnimalCortesService();
      if (errorService) return handleErrorClient(res, 500, errorService);
      handleSuccess(res, 200, "Lista de AnimalCortes obtenida con éxito.", animalCortes);
    } catch (error) {
      handleErrorServer(res, 500, error.message);
    }
  },

  async getAnimalCorteById(req, res) {
    const { id } = req.params;

    try {
      const [animalCorte, errorService] = await getAnimalCorteByIdService(id);

      if (errorService) return handleErrorClient(res, 404, errorService);
      handleSuccess(res, 200, "AnimalCorte obtenido con éxito.", animalCorte);
    } catch (error) {
      handleErrorServer(res, 500, error.message);
    }
  },
  async exportarExcelAnimalCortes(req, res) {
    try {
      const workbook = await animalCorteService.generarExcelAnimalCortes();

      // Configurar la respuesta para enviar el archivo Excel
      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      res.setHeader("Content-Disposition", "attachment; filename=lista-cortes.xlsx");

      // Enviar el archivo
      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      handleErrorServer(res, 500, error.message);
    }
  }
};

