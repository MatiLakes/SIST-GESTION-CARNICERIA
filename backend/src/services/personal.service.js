import { AppDataSource } from "../config/configDb.js";
import Personal from "../entity/Personal.entity.js";

export const personalService = {
  async crearPersonal(data) {
    try {
      if (!data.nombre || !data.seccion) {
        return [null, "Nombre y sección son obligatorios"];
      }

      const repo = AppDataSource.getRepository(Personal);
      const nuevo = repo.create(data);
      await repo.save(nuevo);
      return [nuevo, null];
    } catch (err) {
      return [null, "Error al crear personal"];
    }
  },

  async obtenerPersonal() {
    try {
      const repo = AppDataSource.getRepository(Personal);
      const lista = await repo.find();
      return [lista, null];
    } catch (err) {
      return [null, "Error al obtener personal"];
    }
  },

  async modificarPersonal(id, data) {
    try {
      const repo = AppDataSource.getRepository(Personal);
      const persona = await repo.findOneBy({ id });
      if (!persona) return [null, "Personal no encontrado"];

      Object.assign(persona, data);
      await repo.save(persona);
      return [persona, null];
    } catch (err) {
      return [null, "Error al modificar personal"];
    }
  },

  async eliminarPersonal(id) {
    try {
      const repo = AppDataSource.getRepository(Personal);
      const persona = await repo.findOneBy({ id });
      if (!persona) return [null, "Personal no encontrado"];

      await repo.remove(persona);
      return [null, null];
    } catch (err) {
      return [null, "Error al eliminar personal"];
    }
  }
};
