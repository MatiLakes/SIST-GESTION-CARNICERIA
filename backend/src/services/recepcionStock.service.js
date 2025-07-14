import { AppDataSource } from "../config/configDb.js";
import RecepcionStock from "../entity/RecepcionStock.entity.js";
import Producto from "../entity/Producto.entity.js";
import ExcelJS from "exceljs";

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
},

async generarExcelRecepcionStock() {
  try {
    const repo = AppDataSource.getRepository(RecepcionStock);
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
        fecha: "DESC"
      }
    });

    // Crear el workbook y la hoja
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Recepciones de Stock");
    
    // Definir las columnas
    worksheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Producto", key: "producto", width: 25 },
      { header: "Cantidad", key: "cantidad", width: 15 },
      { header: "Costo Unitario", key: "costoUnitario", width: 15 },
      { header: "Costo Total", key: "costoTotal", width: 15 },
      { header: "Fecha", key: "fecha", width: 15 },
      { header: "Fecha Vencimiento", key: "fechaVencimiento", width: 20 },
    ];

    // Agregar las filas
    recepciones.forEach((recepcion) => {
      const productoNombre = recepcion.producto 
        ? `${recepcion.producto.nombre}${recepcion.producto.variante ? ` ${recepcion.producto.variante}` : ''}`
        : 'Producto no disponible';
      
      const costoTotal = (recepcion.cantidad || 0) * (recepcion.costoUnitario || 0);
      
      worksheet.addRow({
        id: recepcion.id,
        producto: productoNombre,
        cantidad: recepcion.cantidad,
        costoUnitario: recepcion.costoUnitario,
        costoTotal: costoTotal,
        fecha: recepcion.fecha ? new Date(recepcion.fecha).toLocaleDateString('es-CL') : 'N/A',
        fechaVencimiento: recepcion.fechaVencimiento ? new Date(recepcion.fechaVencimiento).toLocaleDateString('es-CL') : 'N/A',
      });
    });

    // Estilizar la cabecera
    worksheet.getRow(1).font = { bold: true };
    
    // Aplicar formato de moneda a las columnas de costo
    worksheet.getColumn('costoUnitario').numFmt = '"$"#,##0.00';
    worksheet.getColumn('costoTotal').numFmt = '"$"#,##0.00';

    // Retornar el workbook
    return workbook;
  } catch (error) {
    console.error("Error al generar el Excel de recepciones de stock:", error);
    throw new Error("No se pudo generar el archivo Excel.");
  }
}

};
