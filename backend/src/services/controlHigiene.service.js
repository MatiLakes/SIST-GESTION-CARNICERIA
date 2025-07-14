import { AppDataSource } from "../config/configDb.js";
import ControlHigiene from "../entity/ControlHigiene.entity.js";
import Personal from "../entity/Personal.entity.js";

export const controlHigieneService = {
  async crearRegistro(data) {
    try {
      console.log("Datos recibidos para crear registro:", JSON.stringify(data, null, 2));
      
      // Validar que personalId existe
      if (!data.personalId) {
        console.error("Error: personalId no proporcionado");
        return [null, "El ID del personal es obligatorio"];
      }

      const personalRepo = AppDataSource.getRepository(Personal);
      const controlRepo = AppDataSource.getRepository(ControlHigiene);

      console.log("Buscando personal con ID:", data.personalId);
      const persona = await personalRepo.findOneBy({ id: data.personalId });
      if (!persona) {
        console.error(`Personal con ID ${data.personalId} no encontrado`);
        return [null, "Personal no encontrado"];
      }

      console.log("Personal encontrado:", JSON.stringify(persona, null, 2));

      // Crear una copia de los datos sin personalId para evitar conflictos
      const { personalId, ...registroData } = data;

      const nuevo = controlRepo.create({
        ...registroData,
        personal: persona
      });

      console.log("Registro a guardar:", JSON.stringify(nuevo, null, 2));

      await controlRepo.save(nuevo);
      
      // Reload the entity to ensure relations are properly loaded
      const saved = await controlRepo.findOne({
        where: { id: nuevo.id },
        relations: ["personal"]
      });
      
      console.log("Registro guardado exitosamente:", JSON.stringify(saved, null, 2));
      return [saved, null];
    } catch (err) {
      console.error("Error detallado al guardar el control:", err);
      console.error("Stack trace:", err.stack);
      
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
      
      console.log("Registros obtenidos:", JSON.stringify(lista, null, 2));
      
      // Verificar si hay registros con personal nulo o indefinido
      const registrosConProblemas = lista.filter(reg => !reg.personal);
      if (registrosConProblemas.length > 0) {
        console.warn("¡ATENCIÓN! Hay registros con personal nulo:", registrosConProblemas.length);
        console.warn("Ejemplos:", registrosConProblemas.map(r => r.id));
      }
      
      return [lista, null];
    } catch (err) {
      console.error("Error al obtener registros:", err);
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
    console.error("Error al modificar el registro:", err);
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
}}
