"use strict";

import { AppDataSource } from "../config/configDb.js";
import RecepcionStock from "../entity/RecepcionStock.entity.js";
import Merma from "../entity/Merma.entity.js";

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
  }
};
