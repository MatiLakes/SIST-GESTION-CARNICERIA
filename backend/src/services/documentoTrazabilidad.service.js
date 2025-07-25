import DocumentoTrazabilidad from "../entity/DocumentoTrazabilidad.entity.js";
import RegistroTrazabilidad from "../entity/RegistroTrazabilidad.entity.js";
import Personal from "../entity/Personal.entity.js";
import { AppDataSource } from "../config/configDb.js";
import ExcelJS from "exceljs";

const documentoRepo = AppDataSource.getRepository(DocumentoTrazabilidad);
const registroRepo = AppDataSource.getRepository(RegistroTrazabilidad);
const personalRepo = AppDataSource.getRepository(Personal);

export const documentoTrazabilidadService = {
  async crear(data) {
    try {
      const { fecha, registros = [] } = data;

      const documento = documentoRepo.create({ fecha });
      await documentoRepo.save(documento);

      // Solo crear el primer registro si existe
      if (registros && registros.length > 0) {
        const reg = registros[0]; // Solo tomar el primer registro
        const responsable = await personalRepo.findOneBy({ id: reg.responsableId });
        if (!responsable) throw new Error("Responsable no encontrado");
        
        const nuevoRegistro = registroRepo.create({
          hora: reg.hora,
          cantidad: reg.cantidad,
          corte: reg.corte,
          documento,
          responsable
        });

        await registroRepo.save(nuevoRegistro);
      }

      // Retornar el documento con sus relaciones cargadas
      const documentoCompleto = await documentoRepo.findOne({
        where: { id: documento.id },
        relations: ["registros", "registros.responsable"],
      });

      return [documentoCompleto, null];
    } catch (err) {
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

      // Eliminar registros existentes
      await registroRepo.delete({ documento: { id } });

      // Solo crear el primer registro si existe
      if (registros && registros.length > 0) {
        const reg = registros[0]; // Solo tomar el primer registro
        const responsable = await personalRepo.findOneBy({ id: reg.responsableId });
        if (!responsable) throw new Error("Responsable no encontrado");

        const nuevoRegistro = registroRepo.create({
          hora: reg.hora,
          cantidad: reg.cantidad,
          corte: reg.corte,
          documento,
          responsable
        });

        await registroRepo.save(nuevoRegistro);
      }

      const actualizado = await documentoRepo.findOne({ where: { id }, relations: ["registros", "registros.responsable"] });
      return [actualizado, null];
    } catch (err) {
      return [null, "Error al actualizar documento trazabilidad"];
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
      }
      registro.hora = data.hora || registro.hora;
      registro.cantidad = data.cantidad !== undefined ? data.cantidad : registro.cantidad;
      registro.corte = data.corte || registro.corte;

      await registroRepo.save(registro);

      const registroActualizado = await registroRepo.findOne({
        where: { id: registroId },
        relations: ["responsable"]
      });

      return [registroActualizado, null];
    } catch (err) {
      return [null, "Error al actualizar registro de trazabilidad"];
    }
  },

  async generarExcelDocumentoTrazabilidad() {
    try {
      const documentos = await documentoRepo.find({
        relations: ["registros", "registros.responsable"],
        order: { fecha: "DESC" },
      });

      // Crear el workbook y la hoja
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Documentos de Trazabilidad");

      // Definir las columnas
      worksheet.columns = [
        { header: "ID", key: "id", width: 10 },
        { header: "Fecha", key: "fecha", width: 15 },
        { header: "Hora", key: "hora", width: 12 },
        { header: "Cantidad (Kg)", key: "cantidad", width: 15 },
        { header: "Corte Molido", key: "corte", width: 20 },
        { header: "Responsable", key: "responsable", width: 25 },
      ];

      // Agregar las filas
      documentos.forEach((documento) => {
        const registro = documento.registros && documento.registros.length > 0 ? documento.registros[0] : null;
        
        worksheet.addRow({
          id: documento.id,
          fecha: documento.fecha,
          hora: registro?.hora || "N/A",
          cantidad: registro?.cantidad || "N/A",
          corte: registro?.corte || "N/A",
          responsable: registro?.responsable?.nombre || "N/A",
        });
      });

      // Estilizar la cabecera
      worksheet.getRow(1).font = { bold: true };

      // Retornar el workbook
      return workbook;
    } catch (error) {
      console.error("Error al generar el Excel de documentos de trazabilidad:", error);
      throw new Error("No se pudo generar el archivo Excel.");
    }
  }
};
