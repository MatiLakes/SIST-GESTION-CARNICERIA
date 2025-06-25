import { documentoTemperaturaService } from "../services/documentoTemperatura.service.js";
import { handleErrorClient, handleSuccess } from "../handlers/responseHandlers.js";

export const documentoTemperaturaController = {
  async crear(req, res) {
    const [doc, error] = await documentoTemperaturaService.crear(req.body);
    if (error) return handleErrorClient(res, 400, error);
    return handleSuccess(res, 201, "Documento de temperatura creado", doc);
  },

  async obtenerTodos(req, res) {
    const [docs, error] = await documentoTemperaturaService.obtenerTodos();
    if (error) return handleErrorClient(res, 500, error);
    return handleSuccess(res, 200, "Documentos obtenidos", docs);
  },

  async eliminar(req, res) {
    const { id } = req.params;
    const [_, error] = await documentoTemperaturaService.eliminar(Number(id));
    if (error) return handleErrorClient(res, 500, error);
    return handleSuccess(res, 200, "Documento eliminado");
  },
    async actualizar(req, res) {
    const { id } = req.params;
    const [doc, error] = await documentoTemperaturaService.actualizar(Number(id), req.body);
    if (error) return handleErrorClient(res, 400, error);
    return handleSuccess(res, 200, "Documento actualizado", doc);
  }

};
