import { AppDataSource } from "../config/configDb.js";
import RecepcionStock from "../entity/RecepcionStock.entity.js";
import Producto from "../entity/Producto.entity.js";

export const recepcionStockService = {
  async crear({ productoId, cantidad, costoUnitario, fechaVencimiento }) {
    try {
      const productoRepo = AppDataSource.getRepository(Producto);
      const recepcionRepo = AppDataSource.getRepository(RecepcionStock);
      
      // Mostrar lo que recibimos para depuración
      console.log("Datos recibidos en crear:", { productoId, cantidad, costoUnitario, fechaVencimiento });

      const producto = await productoRepo.findOneBy({ id: productoId });
      if (!producto) return [null, "Producto no encontrado"];

      const nuevaRecepcion = recepcionRepo.create({
        producto,
        cantidad,
        costoUnitario,
        fechaVencimiento: fechaVencimiento || null,
      });

      await recepcionRepo.save(nuevaRecepcion);
      return [nuevaRecepcion, null];
    } catch (err) {
      console.error("Error en crear recepcion stock:", err);
      return [null, "Error al registrar stock"];
    }
  },

  async obtenerTodas() {
    try {
      const repo = AppDataSource.getRepository(RecepcionStock);
      
      // Usando find con relaciones explícitas para asegurar que se carga el producto
      const recepciones = await repo.find({
        relations: {
          producto: true
        },
        select: {
          id: true,
          cantidad: true,
          costoUnitario: true,
          fecha: true,
          fechaVencimiento: true,
          producto: {
            id: true,
            nombre: true,
            variante: true
          }
        },
        order: {
          id: "DESC" // Ordenar por ID descendente para ver primero las más recientes
        }
      });
      
      // Log para debug
      console.log("Recepciones obtenidas:", JSON.stringify(recepciones, null, 2));
      return [recepciones, null];
    } catch (err) {
      console.error("Error al obtener recepciones:", err);
      return [null, "Error al obtener recepciones"];
    }
  },

  async eliminar(id) {
  try {
    const repo = AppDataSource.getRepository(RecepcionStock);
    const registro = await repo.findOneBy({ id });
    if (!registro) return [null, "Registro no encontrado"];
    await repo.remove(registro);
    return [true, null];
  } catch (err) {
    console.error("Error al eliminar recepcion stock:", err);
    return [null, "Error al eliminar registro"];
  }
},

async actualizar(id, data) {
  try {
    const repo = AppDataSource.getRepository(RecepcionStock);
    const productoRepo = AppDataSource.getRepository(Producto);
    
    // Log para depuración
    console.log("Datos recibidos en actualizar:", { id, ...data });
    
    const registro = await repo.findOneBy({ id });
    if (!registro) return [null, "Registro no encontrado"];

    const producto = await productoRepo.findOneBy({ id: data.productoId });
    if (!producto) return [null, "Producto no encontrado"];

    registro.producto = producto;
    registro.cantidad = data.cantidad;
    registro.costoUnitario = data.costoUnitario;
    registro.fechaVencimiento = data.fechaVencimiento || null;

    const actualizado = await repo.save(registro);
    return [actualizado, null];
  } catch (err) {
    console.error("Error al actualizar:", err);
    return [null, "Error al actualizar registro"];
  }
}

};
