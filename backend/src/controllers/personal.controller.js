import { personalService } from "../services/personal.service.js";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../handlers/responseHandlers.js";

export const personalController = {
  async crearPersonal(req, res) {
    try {
      const [nuevo, err] = await personalService.crearPersonal(req.body);
      if (err) return handleErrorClient(res, 400, err);
      handleSuccess(res, 201, "Personal creado", nuevo);
    } catch (error) {
      handleErrorServer(res, 500, error.message);
    }
  },

  async obtenerPersonal(req, res) {
    try {
      const [lista, err] = await personalService.obtenerPersonal();
      if (err) return handleErrorClient(res, 500, err);
      handleSuccess(res, 200, "Personal listado", lista);
    } catch (error) {
      handleErrorServer(res, 500, error.message);
    }
  },

  async modificarPersonal(req, res) {
    try {
      const { id } = req.params;
      const [persona, err] = await personalService.modificarPersonal(id, req.body);
      if (err) return handleErrorClient(res, 400, err);
      handleSuccess(res, 200, "Personal modificado", persona);
    } catch (error) {
      handleErrorServer(res, 500, error.message);
    }
  },

  async eliminarPersonal(req, res) {
    try {
      const { id } = req.params;
      const [_, err] = await personalService.eliminarPersonal(id);
      if (err) return handleErrorClient(res, 404, err);
      handleSuccess(res, 200, "Personal eliminado");
    } catch (error) {
      handleErrorServer(res, 500, error.message);
    }
  }
};
