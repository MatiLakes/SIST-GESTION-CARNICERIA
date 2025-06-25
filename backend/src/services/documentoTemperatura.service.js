import DocumentoTemperatura from "../entity/DocumentoTemperatura.entity.js";
import RegistroTemperatura from "../entity/RegistroTemperatura.entity.js";
import Personal from "../entity/Personal.entity.js";
import { AppDataSource } from "../config/configDb.js";

const documentoRepo = AppDataSource.getRepository(DocumentoTemperatura);
const registroRepo = AppDataSource.getRepository(RegistroTemperatura);
const personalRepo = AppDataSource.getRepository(Personal);

export const documentoTemperaturaService = {
  async crear(data) {
  try {
    const { fecha, detalles } = data;

    const documento = documentoRepo.create({ fecha });
    await documentoRepo.save(documento);

    for (const reg of detalles) {
      const responsable = await personalRepo.findOneBy({ id: reg.responsableId });
      if (!responsable) throw new Error("Responsable no encontrado");

      const nuevoRegistro = registroRepo.create({
        ...reg,
        documento,
        responsable,
      });

      await registroRepo.save(nuevoRegistro);
    }

    return [documento, null];
  } catch (err) {
    console.error("Error al crear documento temperatura:", err);
    return [null, "Error al crear documento temperatura"];
  }
  },

  async obtenerTodos() {
    try {
      const docs = await documentoRepo.find({
        relations: ["registros", "registros.responsable"],
        order: { fecha: "DESC" },
      });
      return [docs, null];
    } catch (err) {
      console.error("Error al obtener documentos:", err);
      return [null, "Error al obtener documentos"];
    }
  },

  async eliminar(id) {
    try {
      await registroRepo.delete({ documento: { id } });
      await documentoRepo.delete(id);
      return [null, null];
    } catch (err) {
      return [null, "Error al eliminar"];
    }
  },

    async actualizar(id, data) {
    try {
      const documento = await documentoRepo.findOneBy({ id });
      if (!documento) return [null, "Documento no encontrado"];

      const { fecha, registros } = data;

      // Actualizar la fecha del documento
      documento.fecha = fecha;
      await documentoRepo.save(documento);

      // Eliminar registros anteriores
      await registroRepo.delete({ documento: { id } });

      // Guardar nuevos registros
      for (const reg of registros) {
        const responsable = await personalRepo.findOneBy({ id: reg.responsableId });
        if (!responsable) throw new Error("Responsable no encontrado");

        const nuevoRegistro = registroRepo.create({
          ...reg,
          documento,
          responsable,
        });

        await registroRepo.save(nuevoRegistro);
      }

      return [await documentoRepo.findOne({ where: { id }, relations: ["registros", "registros.responsable"] }), null];
    } catch (err) {
      console.error("Error al actualizar documento:", err);
      return [null, "Error al actualizar documento"];
    }
  }

};
