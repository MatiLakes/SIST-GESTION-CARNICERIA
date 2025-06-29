import { controlHigieneService } from "../services/controlHigiene.service.js";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../handlers/responseHandlers.js";
import { controlHigieneValidation } from "../validations/controlHigiene.validation.js";

export const controlHigieneController = {  async crearRegistro(req, res) {
    try {
      const datosRegistro = req.body;
      
      // Validar los datos del registro
      const { error } = controlHigieneValidation().validate(datosRegistro);
      if (error) {
        return handleErrorClient(res, 400, error.details[0].message);
      }

      const [registro, err] = await controlHigieneService.crearRegistro(datosRegistro);
      if (err) return handleErrorClient(res, 400, err);
      handleSuccess(res, 201, "Registro creado", registro);
    } catch (error) {
      handleErrorServer(res, 500, error.message);
    }
  },

  async obtenerRegistros(req, res) {
    try {
      const [registros, err] = await controlHigieneService.obtenerRegistros();
      if (err) return handleErrorClient(res, 500, err);
      handleSuccess(res, 200, "Registros obtenidos", registros);
    } catch (error) {
      handleErrorServer(res, 500, error.message);
    }
  },
  async modificarRegistro(req, res) {
  try {
    const { id } = req.params;
    const datosActualizados = req.body;

    // Validar los datos actualizados
    const { error } = controlHigieneValidation().validate(datosActualizados);
    if (error) {
      return handleErrorClient(res, 400, error.details[0].message);
    }

    const [registro, err] = await controlHigieneService.modificarRegistro(id, datosActualizados);
    if (err) return handleErrorClient(res, 400, err);
    handleSuccess(res, 200, "Registro modificado correctamente", registro);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
},

async eliminarRegistro(req, res) {
  try {
    const { id } = req.params;
    const [_, err] = await controlHigieneService.eliminarRegistro(id);
    if (err) return handleErrorClient(res, 404, err);
    handleSuccess(res, 200, "Registro eliminado correctamente");
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}
  
}
