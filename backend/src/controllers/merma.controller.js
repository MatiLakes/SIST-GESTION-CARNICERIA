"use strict";

import { mermaService } from "../services/merma.service.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";
import { mermaValidation } from "../validations/merma.validation.js";

export const mermaController = {
  async crearMerma(req, res) {
    try {
      const mermaData = req.body;
      
      // Validar los datos de la merma
      const { error } = mermaValidation().validate(mermaData);
      if (error) {
        return handleErrorClient(res, 400, error.details[0].message);
      }

      const [merma, err] = await mermaService.crearMerma(mermaData);
      if (err) return handleErrorClient(res, 400, err);

      handleSuccess(res, 201, "Merma registrada exitosamente.", merma);
    } catch (error) {
      handleErrorServer(res, 500, error.message);
    }
  },

  async obtenerMermas(req, res) {
    try {
      const [mermas, err] = await mermaService.obtenerMermas();
      if (err) return handleErrorClient(res, 500, err);

      handleSuccess(res, 200, "Mermas obtenidas correctamente.", mermas);
    } catch (error) {
      handleErrorServer(res, 500, error.message);
    }
  },

  async obtenerMermaPorId(req, res) {
    try {
      const { id } = req.params;
      const [merma, err] = await mermaService.obtenerMermaPorId(id);
      if (err) return handleErrorClient(res, 404, err);

      handleSuccess(res, 200, "Merma obtenida correctamente.", merma);
    } catch (error) {
      handleErrorServer(res, 500, error.message);
    }
  },

  async filtrarMermasPorTipo(req, res) {
    try {
      const { tipo } = req.params;
      const [mermas, err] = await mermaService.filtrarMermasPorTipo(tipo);
      if (err) return handleErrorClient(res, 500, err);

      handleSuccess(res, 200, `Mermas filtradas por tipo ${tipo} correctamente.`, mermas);
    } catch (error) {
      handleErrorServer(res, 500, error.message);
    }
  },

  async filtrarMermasPorFecha(req, res) {
    try {
      const { fechaInicio, fechaFin } = req.query;
      const [mermas, err] = await mermaService.filtrarMermasPorFecha(fechaInicio, fechaFin);
      if (err) return handleErrorClient(res, 500, err);

      handleSuccess(res, 200, "Mermas filtradas por fecha correctamente.", mermas);
    } catch (error) {
      handleErrorServer(res, 500, error.message);
    }
  },

  async filtrarMermasPorPersonal(req, res) {
    try {
      const { personalId } = req.params;
      const [mermas, err] = await mermaService.filtrarMermasPorPersonal(personalId);
      if (err) return handleErrorClient(res, 500, err);

      handleSuccess(res, 200, "Mermas filtradas por personal correctamente.", mermas);
    } catch (error) {
      handleErrorServer(res, 500, error.message);
    }
  },

  async modificarMerma(req, res) {
    try {
      const { id } = req.params;
      const datosActualizados = req.body;

      // Validar los datos actualizados de la merma
      const { error } = mermaValidation().validate(datosActualizados);
      if (error) {
        return handleErrorClient(res, 400, error.details[0].message);
      }

      const [merma, err] = await mermaService.modificarMerma(id, datosActualizados);
      if (err) return handleErrorClient(res, 400, err);

      handleSuccess(res, 200, "Merma modificada correctamente.", merma);
    } catch (error) {
      handleErrorServer(res, 500, error.message);
    }
  },

  async eliminarMerma(req, res) {
    try {
      const { id } = req.params;

      const [_, err] = await mermaService.eliminarMerma(id);
      if (err) return handleErrorClient(res, 404, err);

      handleSuccess(res, 200, "Merma eliminada correctamente.");
    } catch (error) {
      handleErrorServer(res, 500, error.message);
    }
  },

  async exportarExcelMermas(req, res) {
    try {
      const [buffer, err] = await mermaService.exportarExcelMermas();
      if (err) return handleErrorClient(res, 500, err);

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=mermas.xlsx');
      res.send(buffer);
    } catch (error) {
      handleErrorServer(res, 500, error.message);
    }
  }
};
