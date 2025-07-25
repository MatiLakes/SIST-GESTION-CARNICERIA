import { documentoTemperaturaService } from "../services/documentoTemperatura.service.js";
import { handleErrorClient, handleSuccess } from "../handlers/responseHandlers.js";
import { documentoTemperaturaValidation } from "../validations/documentoTemperatura.validation.js";

export const documentoTemperaturaController = {
  async crear(req, res) {
    try {
      console.log("=== DATOS RECIBIDOS EN EL CONTROLADOR ===");
      console.log("Body completo:", JSON.stringify(req.body, null, 2));
      console.log("=== FIN DATOS RECIBIDOS ===");

      // Validar los datos de entrada
      const { error: validationError } = documentoTemperaturaValidation().validate(req.body);
      if (validationError) {
        return handleErrorClient(res, 400, validationError.details[0].message);
      }
      
      const [doc, error] = await documentoTemperaturaService.crear(req.body);
      if (error) return handleErrorClient(res, 400, error);
      return handleSuccess(res, 201, "Documento de temperatura creado", doc);
    } catch (error) {
      console.error("Error en crear documento temperatura:", error);
      return handleErrorClient(res, 500, "Error interno del servidor");
    }
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
    try {
      const { id } = req.params;

      // Validar los datos de entrada
      const { error: validationError } = documentoTemperaturaValidation().validate(req.body);
      if (validationError) {
        return handleErrorClient(res, 400, validationError.details[0].message);
      }

      const [doc, error] = await documentoTemperaturaService.actualizar(Number(id), req.body);
      if (error) return handleErrorClient(res, 400, error);
      return handleSuccess(res, 200, "Documento actualizado", doc);
    } catch (error) {
      console.error("Error en actualizar documento temperatura:", error);
      return handleErrorClient(res, 500, "Error interno del servidor");
    }
  },

  async exportarExcel(req, res) {
    try {
      const workbook = await documentoTemperaturaService.generarExcelDocumentoTemperatura();
      
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=control_temperatura.xlsx"
      );

      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      console.error("Error al exportar Excel:", error);
      res.status(500).json({ error: "No se pudo generar el archivo Excel" });
    }
  }

};
