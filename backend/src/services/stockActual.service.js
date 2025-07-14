"use strict";

import { AppDataSource } from "../config/configDb.js";
import RecepcionStock from "../entity/RecepcionStock.entity.js";
import Merma from "../entity/Merma.entity.js";
import ExcelJS from "exceljs";

export const stockActualService = {
  async obtenerStockActual() {
    try {
      const recepcionRepo = AppDataSource.getRepository(RecepcionStock);
      const mermaRepo = AppDataSource.getRepository(Merma);
      
      // Obtener todas las recepciones con sus productos
      const recepciones = await recepcionRepo.find({
        relations: {
          producto: {
            tipo: true,
            marca: true
          }
        },
        select: {
          id: true,
          cantidad: true,
          producto: {
            id: true,
            nombre: true,
            variante: true,
            precioVenta: true,
            tipoMedida: true,
            tipo: {
              id: true,
              nombre: true
            },
            marca: {
              id: true,
              nombre: true
            }
          }
        }
      });

      // Obtener todas las mermas de productos
      const mermas = await mermaRepo.find({
        where: {
          tipoProductoMerma: "producto"
        },
        relations: {
          producto: true
        },
        select: {
          id: true,
          cantidadPerdida: true,
          producto: {
            id: true
          }
        }
      });

      // Agrupar mermas por producto
      const mermasPorProducto = {};
      mermas.forEach(merma => {
        const productoId = merma.producto.id;
        if (!mermasPorProducto[productoId]) {
          mermasPorProducto[productoId] = 0;
        }
        mermasPorProducto[productoId] += merma.cantidadPerdida;
      });

      // Agrupar recepciones por producto y sumar cantidades
      const stockPorProducto = {};
      
      recepciones.forEach(recepcion => {
        const producto = recepcion.producto;
        const key = `${producto.id}`;
        
        if (!stockPorProducto[key]) {
          stockPorProducto[key] = {
            id: producto.id,
            nombre: producto.nombre,
            variante: producto.variante,
            precioVenta: producto.precioVenta,
            tipoMedida: producto.tipoMedida,
            tipo: producto.tipo,
            marca: producto.marca,
            cantidadTotal: 0,
            numeroRecepciones: 0
          };
        }
        
        stockPorProducto[key].cantidadTotal += recepcion.cantidad;
        stockPorProducto[key].numeroRecepciones += 1;
      });

      // Aplicar mermas al stock
      Object.keys(stockPorProducto).forEach(key => {
        const producto = stockPorProducto[key];
        const mermasProducto = mermasPorProducto[producto.id] || 0;
        
        // Restar las mermas del stock total
        producto.cantidadTotal = Math.max(0, producto.cantidadTotal - mermasProducto);
      });

      // Convertir a array y ordenar
      const stockActual = Object.values(stockPorProducto).sort((a, b) => 
        a.nombre.localeCompare(b.nombre)
      );

      return [stockActual, null];
    } catch (error) {
      console.error("Error al obtener stock actual:", error);
      return [null, "Error al obtener el stock actual."];
    }
  },

  async generarExcelStockActual() {
    try {
      // Reutilizar la lógica de obtenerStockActual
      const [stockActual, error] = await this.obtenerStockActual();
      if (error) {
        throw new Error(error);
      }

      // Crear el workbook y la hoja
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Stock Actual");
      
      // Definir las columnas
      worksheet.columns = [
        { header: "ID", key: "id", width: 10 },
        { header: "Producto", key: "producto", width: 30 },
        { header: "Tipo", key: "tipo", width: 20 },
        { header: "Marca", key: "marca", width: 20 },
        { header: "Cantidad Actual", key: "cantidadTotal", width: 15 },
        { header: "Tipo de Medida", key: "tipoMedida", width: 15 },
        { header: "Precio Venta", key: "precioVenta", width: 15 },
        { header: "Valor Total", key: "valorTotal", width: 15 },
        { header: "N° Recepciones", key: "numeroRecepciones", width: 15 },
      ];

      // Agregar las filas
      stockActual.forEach((item) => {
        const productoNombre = `${item.nombre}${item.variante ? ` ${item.variante}` : ''}`;
        const tipoNombre = item.tipo ? item.tipo.nombre : 'N/A';
        const marcaNombre = item.marca ? item.marca.nombre : 'N/A';
        const valorTotal = (item.cantidadTotal || 0) * (item.precioVenta || 0);
        
        worksheet.addRow({
          id: item.id,
          producto: productoNombre,
          tipo: tipoNombre,
          marca: marcaNombre,
          cantidadTotal: item.cantidadTotal,
          tipoMedida: item.tipoMedida || 'N/A',
          precioVenta: item.precioVenta,
          valorTotal: valorTotal,
          numeroRecepciones: item.numeroRecepciones,
        });
      });

      // Estilizar la cabecera
      worksheet.getRow(1).font = { bold: true };
      
      // Aplicar formato de moneda a las columnas de precio
      worksheet.getColumn('precioVenta').numFmt = '"$"#,##0.00';
      worksheet.getColumn('valorTotal').numFmt = '"$"#,##0.00';

      // Retornar el workbook
      return workbook;
    } catch (error) {
      console.error("Error al generar el Excel de stock actual:", error);
      throw new Error("No se pudo generar el archivo Excel.");
    }
  }
};
