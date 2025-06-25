import DocumentoTrazabilidad from "../entity/DocumentoTrazabilidad.entity.js";
import RegistroTrazabilidad from "../entity/RegistroTrazabilidad.entity.js";
import Personal from "../entity/Personal.entity.js";
import { AppDataSource } from "../config/configDb.js";

const documentoRepo = AppDataSource.getRepository(DocumentoTrazabilidad);
const registroRepo = AppDataSource.getRepository(RegistroTrazabilidad);
const personalRepo = AppDataSource.getRepository(Personal);

export const documentoTrazabilidadService = {  async crear(data) {
    try {
      const { fecha, registros = [] } = data;

      const documento = documentoRepo.create({ fecha });
      await documentoRepo.save(documento);

      // Verificar si hay registros para agregar
      if (registros && registros.length > 0) {
        for (const reg of registros) {
          const responsable = await personalRepo.findOneBy({ id: reg.responsableId });
          if (!responsable) throw new Error("Responsable no encontrado");          const nuevoRegistro = registroRepo.create({
            hora: reg.hora,
            cantidad: reg.cantidad,
            corte: reg.corte,
            documento,
            responsable
          });

          await registroRepo.save(nuevoRegistro);
        }
      }

      // Retornar el documento con sus relaciones cargadas
      const documentoCompleto = await documentoRepo.findOne({
        where: { id: documento.id },
        relations: ["registros", "registros.responsable"],
      });

      return [documentoCompleto, null];
    } catch (err) {
      console.error("Error al crear documento trazabilidad:", err);
      return [null, err.message || "Error al crear documento trazabilidad"];
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

      documento.fecha = fecha;
      await documentoRepo.save(documento);

      await registroRepo.delete({ documento: { id } });

      for (const reg of registros) {
        const responsable = await personalRepo.findOneBy({ id: reg.responsableId });
        if (!responsable) throw new Error("Responsable no encontrado");

        const nuevoRegistro = registroRepo.create({
          hora: reg.hora,
          corte: reg.corte,
          temperatura: reg.temperatura,
          funciona: reg.funciona,
          motivo: reg.motivo,
          tiempoEnfriado: reg.tiempoEnfriado,
          documento,
          responsable
        });

        await registroRepo.save(nuevoRegistro);
      }

      const actualizado = await documentoRepo.findOne({ where: { id }, relations: ["registros", "registros.responsable"] });      return [actualizado, null];
    } catch (err) {
      console.error("Error al actualizar documento trazabilidad:", err);
      return [null, "Error al actualizar documento trazabilidad"];
    }
  },

  async agregarRegistro(documentoId, data) {
    try {
      const documento = await documentoRepo.findOneBy({ id: documentoId });
      if (!documento) return [null, "Documento no encontrado"];

      const responsable = await personalRepo.findOneBy({ id: data.responsableId });
      if (!responsable) return [null, "Responsable no encontrado"];      const registro = registroRepo.create({
        hora: data.hora,
        cantidad: data.cantidad,
        corte: data.corte,
        documento,
        responsable
      });

      await registroRepo.save(registro);

      // Cargar las relaciones para devolver el registro completo
      const registroCompleto = await registroRepo.findOne({
        where: { id: registro.id },
        relations: ["responsable"]
      });

      return [registroCompleto, null];
    } catch (err) {
      console.error("Error al agregar registro:", err);
      return [null, "Error al agregar registro de trazabilidad"];
    }
  },

  async actualizarRegistro(documentoId, registroId, data) {
    try {
      const registro = await registroRepo.findOne({
        where: { id: registroId, documento: { id: documentoId } },
        relations: ["documento", "responsable"]
      });

      if (!registro) return [null, "Registro no encontrado"];

      // Si se cambió el responsable, verificar que exista
      if (data.responsableId && data.responsableId !== registro.responsable.id) {
        const responsable = await personalRepo.findOneBy({ id: data.responsableId });
        if (!responsable) return [null, "Responsable no encontrado"];
        registro.responsable = responsable;
      }      registro.hora = data.hora || registro.hora;
      registro.cantidad = data.cantidad !== undefined ? data.cantidad : registro.cantidad;
      registro.corte = data.corte || registro.corte;

      await registroRepo.save(registro);

      const registroActualizado = await registroRepo.findOne({
        where: { id: registroId },
        relations: ["responsable"]
      });

      return [registroActualizado, null];
    } catch (err) {
      console.error("Error al actualizar registro:", err);
      return [null, "Error al actualizar registro de trazabilidad"];
    }
  },

  async eliminarRegistro(documentoId, registroId) {
    try {
      const resultado = await registroRepo.delete({ 
        id: registroId, 
        documento: { id: documentoId } 
      });
      
      if (resultado.affected === 0) {
        return [null, "Registro no encontrado"];
      }
      
      return [true, null];
    } catch (err) {
      console.error("Error al eliminar registro:", err);
      return [null, "Error al eliminar registro de trazabilidad"];
    }
  }
};
