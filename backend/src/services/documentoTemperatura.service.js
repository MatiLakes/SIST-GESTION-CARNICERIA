import DocumentoTemperatura from "../entity/DocumentoTemperatura.entity.js";
import RegistroTemperatura from "../entity/RegistroTemperatura.entity.js";
import Personal from "../entity/Personal.entity.js";
import { AppDataSource } from "../config/configDb.js";
import ExcelJS from "exceljs";

const documentoRepo = AppDataSource.getRepository(DocumentoTemperatura);
const registroRepo = AppDataSource.getRepository(RegistroTemperatura);
const personalRepo = AppDataSource.getRepository(Personal);

export const documentoTemperaturaService = {
  async crear(data) {
  return await AppDataSource.transaction(async (transactionalEntityManager) => {
    try {
      const { fecha, registros } = data;

      console.log("=== DATOS RECIBIDOS EN EL SERVICIO ===");
      console.log("Fecha original:", fecha);
      console.log("Tipo de fecha:", typeof fecha);
      console.log("=== FIN DATOS RECIBIDOS ===");

      // Procesar la fecha correctamente para evitar problemas de zona horaria
      let fechaParaDB;
      if (typeof fecha === 'string') {
        // Si ya es un string en formato YYYY-MM-DD, usarlo directamente
        if (/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
          fechaParaDB = fecha;
          console.log("Fecha string válida, usando directamente:", fechaParaDB);
        } else {
          throw new Error("Formato de fecha inválido. Use YYYY-MM-DD");
        }
      } else {
        // Si es un objeto Date, convertir a string YYYY-MM-DD en zona horaria local
        const fechaObj = new Date(fecha);
        if (isNaN(fechaObj.getTime())) {
          throw new Error("La fecha proporcionada no es válida");
        }
        
        // Obtener año, mes y día en zona horaria local
        const año = fechaObj.getFullYear();
        const mes = String(fechaObj.getMonth() + 1).padStart(2, '0');
        const dia = String(fechaObj.getDate()).padStart(2, '0');
        fechaParaDB = `${año}-${mes}-${dia}`;
        console.log("Fecha convertida desde objeto Date:", fechaParaDB);
      }

      console.log("Fecha final que se guardará:", fechaParaDB);

      // Verificar que exista personal en el sistema
      const personalCount = await transactionalEntityManager.count(Personal);
      if (personalCount === 0) {
        throw new Error("No hay personal registrado en el sistema. Debe registrar personal antes de crear documentos de temperatura.");
      }

      // Verificar que no exista ya un documento para esta fecha
      const documentoExistente = await transactionalEntityManager.findOne(DocumentoTemperatura, {
        where: { fecha: fechaParaDB }
      });
      
      if (documentoExistente) {
        throw new Error(`Ya existe un documento de temperatura para la fecha ${fechaParaDB}. Solo se permite un documento por día.`);
      }

      // Crear el documento
      const documento = transactionalEntityManager.create(DocumentoTemperatura, { fecha: fechaParaDB });
      const documentoGuardado = await transactionalEntityManager.save(DocumentoTemperatura, documento);

      console.log("Documento creado con ID:", documentoGuardado.id);
      console.log("Número de registros a procesar:", registros.length);

      // Procesar cada registro
      for (let i = 0; i < registros.length; i++) {
        const reg = registros[i];
        console.log(`Procesando registro ${i + 1}:`, reg);
        
        const responsable = await transactionalEntityManager.findOneBy(Personal, { id: parseInt(reg.responsableId) });
        if (!responsable) {
          console.error(`Responsable con ID ${reg.responsableId} no encontrado`);
          throw new Error(`Responsable con ID ${reg.responsableId} no encontrado`);
        }

        console.log("Responsable encontrado:", responsable.id, responsable.nombre);

        const registroData = {
          hora: reg.hora,
          equipo: reg.equipo,
          temperatura: parseFloat(reg.temperatura),
          funciona: reg.funciona,
          motivo: reg.motivo || null,
          AccionCorrectiva: reg.AccionCorrectiva || null,
          documento: documentoGuardado,
          responsable,
        };

        console.log("Datos del registro a crear:", registroData);

        const nuevoRegistro = transactionalEntityManager.create(RegistroTemperatura, registroData);
        const registroGuardado = await transactionalEntityManager.save(RegistroTemperatura, nuevoRegistro);
        console.log(`Registro ${i + 1} guardado con ID:`, registroGuardado.id);
      }

      // Recuperar el documento completo con sus relaciones
      const documentoCompleto = await transactionalEntityManager.findOne(DocumentoTemperatura, {
        where: { id: documentoGuardado.id },
        relations: ["registros", "registros.responsable"]
      });

      return [documentoCompleto, null];
    } catch (err) {
      console.error("Error al crear documento temperatura:", err);
      // Retornar el mensaje de error específico si es un error de validación
      const errorMessage = err.message || "Error al crear documento temperatura";
      return [null, errorMessage];
    }
  });
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

      // Procesar la fecha correctamente para evitar problemas de zona horaria
      let fechaParaDB;
      if (typeof fecha === 'string') {
        // Si ya es un string en formato YYYY-MM-DD, usarlo directamente
        if (/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
          fechaParaDB = fecha;
        } else {
          throw new Error("Formato de fecha inválido. Use YYYY-MM-DD");
        }
      } else {
        // Si es un objeto Date, convertir a string YYYY-MM-DD en zona horaria local
        const fechaObj = new Date(fecha);
        if (isNaN(fechaObj.getTime())) {
          throw new Error("La fecha proporcionada no es válida");
        }
        
        // Obtener año, mes y día en zona horaria local
        const año = fechaObj.getFullYear();
        const mes = String(fechaObj.getMonth() + 1).padStart(2, '0');
        const dia = String(fechaObj.getDate()).padStart(2, '0');
        fechaParaDB = `${año}-${mes}-${dia}`;
      }

      // Verificar que no exista ya un documento para esta fecha (solo si la fecha cambió)
      if (documento.fecha !== fechaParaDB) {
        const documentoExistente = await documentoRepo.findOne({
          where: { fecha: fechaParaDB }
        });
        
        if (documentoExistente) {
          throw new Error(`Ya existe un documento de temperatura para la fecha ${fechaParaDB}. Solo se permite un documento por día.`);
        }
      }

      // Actualizar la fecha del documento
      documento.fecha = fechaParaDB;
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
  },

  async generarExcelDocumentoTemperatura() {
    try {
      const documentos = await documentoRepo.find({
        relations: ["registros", "registros.responsable"],
        order: { fecha: "DESC" },
      });

      // Crear el workbook y la hoja
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Control de Temperatura");

      // Definir las columnas
      worksheet.columns = [
        { header: "ID Documento", key: "documentoId", width: 12 },
        { header: "Fecha", key: "fecha", width: 15 },
        { header: "Registro #", key: "registroNum", width: 12 },
        { header: "Hora", key: "hora", width: 12 },
        { header: "Equipo", key: "equipo", width: 25 },
        { header: "Temperatura (°C)", key: "temperatura", width: 18 },
        { header: "Funciona", key: "funciona", width: 12 },
        { header: "Motivo", key: "motivo", width: 30 },
        { header: "Acción Correctiva", key: "accionCorrectiva", width: 35 },
        { header: "Responsable", key: "responsable", width: 25 },
      ];

      // Agregar las filas - cada registro como una fila separada
      documentos.forEach((documento) => {
        if (documento.registros && documento.registros.length > 0) {
          documento.registros.forEach((registro, index) => {
            worksheet.addRow({
              documentoId: documento.id,
              fecha: documento.fecha,
              registroNum: index + 1,
              hora: registro.hora,
              equipo: registro.equipo,
              temperatura: registro.temperatura,
              funciona: registro.funciona ? "Sí" : "No",
              motivo: registro.motivo || "N/A",
              accionCorrectiva: registro.AccionCorrectiva || "N/A",
              responsable: registro.responsable?.nombre || "N/A",
            });
          });
        } else {
          // Si no tiene registros, agregar una fila con la información del documento
          worksheet.addRow({
            documentoId: documento.id,
            fecha: documento.fecha,
            registroNum: "N/A",
            hora: "N/A",
            equipo: "N/A",
            temperatura: "N/A",
            funciona: "N/A",
            motivo: "Sin registros",
            accionCorrectiva: "N/A",
            responsable: "N/A",
          });
        }
      });

      // Estilizar la cabecera
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFCCCCCC' }
      };

      // Aplicar bordes a todas las celdas con datos
      const rowCount = worksheet.rowCount;
      for (let i = 1; i <= rowCount; i++) {
        const row = worksheet.getRow(i);
        row.eachCell((cell) => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
        });
      }

      // Retornar el workbook
      return workbook;
    } catch (error) {
      console.error("Error al generar el Excel de documentos de temperatura:", error);
      throw new Error("No se pudo generar el archivo Excel.");
    }
  }
};
