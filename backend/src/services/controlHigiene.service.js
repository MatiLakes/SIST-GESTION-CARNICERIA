import { AppDataSource } from "../config/configDb.js";
import ControlHigiene from "../entity/ControlHigiene.entity.js";
import Personal from "../entity/Personal.entity.js";
import ExcelJS from "exceljs";

export const controlHigieneService = {
  async crearRegistro(data) {
    try {
      // Validar que personalId existe
      if (!data.personalId) {
        return [null, "El ID del personal es obligatorio"];
      }

      const personalRepo = AppDataSource.getRepository(Personal);
      const controlRepo = AppDataSource.getRepository(ControlHigiene);

      const persona = await personalRepo.findOneBy({ id: data.personalId });
      if (!persona) {
        return [null, "Personal no encontrado"];
      }

      // Crear una copia de los datos sin personalId para evitar conflictos
      const { personalId, ...registroData } = data;

      const nuevo = controlRepo.create({
        ...registroData,
        personal: persona
      });

      await controlRepo.save(nuevo);
      
      // Reload the entity to ensure relations are properly loaded
      const saved = await controlRepo.findOne({
        where: { id: nuevo.id },
        relations: ["personal"]
      });
      
      return [saved, null];
    } catch (err) {
      
      // Devolver mensaje más específico basado en el tipo de error
      if (err.code === '23503') {
        return [null, "Error de integridad: Personal no válido"];
      }
      if (err.code === '23502') {
        return [null, "Error: Faltan campos obligatorios"];
      }
      if (err.name === 'QueryFailedError') {
        return [null, `Error en la consulta: ${err.message}`];
      }
      
      return [null, `Error al guardar el control: ${err.message}`];
    }
  },

  async obtenerRegistros() {
    try {
      const repo = AppDataSource.getRepository(ControlHigiene);
      const lista = await repo.find({
        relations: ["personal"]
      });
      
      return [lista, null];
    } catch (err) {
      return [null, "Error al obtener registros"];
    }
  },

  async modificarRegistro(id, data) {
  try {
    const repo = AppDataSource.getRepository(ControlHigiene);
    const personalRepo = AppDataSource.getRepository(Personal);
    
    const registro = await repo.findOne({
      where: { id },
      relations: ["personal"]
    });
    
    if (!registro) return [null, "Registro no encontrado"];

    // Si hay un cambio de personal
    if (data.personalId && data.personalId !== registro.personal?.id) {
      const nuevaPersona = await personalRepo.findOneBy({ id: data.personalId });
      if (!nuevaPersona) return [null, "Personal no encontrado"];
      
      // Actualiza la referencia al personal
      registro.personal = nuevaPersona;
      delete data.personalId; // Evitar duplicación
    }

    Object.assign(registro, data);
    await repo.save(registro);
    
    // Recargar para asegurar que todas las relaciones están actualizadas
    const updated = await repo.findOne({
      where: { id },
      relations: ["personal"]
    });
    
    return [updated, null];
  } catch (err) {
    return [null, "Error al modificar el registro"];
  }
},

async eliminarRegistro(id) {
  try {
    const repo = AppDataSource.getRepository(ControlHigiene);
    const registro = await repo.findOneBy({ id });
    if (!registro) return [null, "Registro no encontrado"];

    await repo.remove(registro);
    return [null, null];
  } catch (err) {
    return [null, "Error al eliminar el registro"];
  }
},

async generarExcelControlHigiene() {
    try {
      const repo = AppDataSource.getRepository(ControlHigiene);
      const registros = await repo.find({
        relations: ["personal"]
      });

      // Crear el workbook y la hoja
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Control de Higiene");

      // Definir las columnas
      worksheet.columns = [
        { header: "ID", key: "id", width: 10 },
        { header: "Fecha", key: "fecha", width: 15 },
        { header: "Personal", key: "personal", width: 20 },
        { header: "Sección", key: "seccion", width: 15 },
        { header: "Uso Cofia", key: "usoCofia", width: 12 },
        { header: "Uso Mascarilla", key: "usoMascarilla", width: 15 },
        { header: "Higiene Manos", key: "higieneManos", width: 15 },
        { header: "Uñas Cortas", key: "unasCortas", width: 12 },
        { header: "Afeitado", key: "afeitado", width: 12 },
        { header: "Uniforme Limpio", key: "uniformeLimpio", width: 15 },
        { header: "Sin Accesorios", key: "sinAccesorios", width: 15 },
        { header: "V°B° Cumplimiento", key: "vbCumplimiento", width: 18 },
        { header: "N° ACC", key: "nroAccionCorrectiva", width: 12 },
        { header: "Observación", key: "observacion", width: 30 },
      ];

      // Agregar las filas
      registros.forEach((registro) => {
        worksheet.addRow({
          id: registro.id,
          fecha: registro.fecha,
          personal: registro.personal?.nombre || "N/A",
          seccion: registro.personal?.seccion || "N/A",
          usoCofia: registro.usoCofia ? "Sí" : "No",
          usoMascarilla: registro.usoMascarilla ? "Sí" : "No",
          higieneManos: registro.higieneManos ? "Sí" : "No",
          unasCortas: registro.unasCortas ? "Sí" : "No",
          afeitado: registro.afeitado ? "Sí" : "No",
          uniformeLimpio: registro.uniformeLimpio ? "Sí" : "No",
          sinAccesorios: registro.sinAccesorios ? "Sí" : "No",
          vbCumplimiento: registro.vbCumplimiento,
          nroAccionCorrectiva: registro.nroAccionCorrectiva,
          observacion: registro.observacion || "",
        });
      });

      // Estilizar la cabecera
      worksheet.getRow(1).font = { bold: true };

      // Retornar el workbook
      return workbook;
    } catch (error) {
      throw new Error("No se pudo generar el archivo Excel.");
    }
  }
}
