"use strict";

import { AppDataSource } from "../config/configDb.js";
import Merma from "../entity/Merma.entity.js";
import ExcelJS from "exceljs";
import { Between } from "typeorm";

export const mermaService = {
  async crearMerma(data) {
    try {
      const mermaRepository = AppDataSource.getRepository(Merma);
      
      // Verificación adicional para merma de tipo carne
      if (data.tipoProductoMerma === "carne") {
        if (!data.animalCorte || !data.tipoCorteCarne) {
          return [null, "Para una merma de carne, debe especificar la lista de precios y el tipo de corte específico."];
        }
        
        // Verificar si existen las referencias
        const animalCorteRepository = AppDataSource.getRepository("AnimalCorte");
        
        const animalCorte = await animalCorteRepository.findOneBy({ id: data.animalCorte.id });
        if (!animalCorte) {
          return [null, "La lista de precios especificada no existe."];
        }
        
        // La vara es opcional ahora, pero verificar si se proporcionó
        if (data.animalVara) {
          const animalVaraRepository = AppDataSource.getRepository("AnimalVara");
          const animalVara = await animalVaraRepository.findOneBy({ id: data.animalVara.id });
          if (!animalVara) {
            return [null, "La vara de animal especificada no existe."];
          }
        }
      } else if (data.tipoProductoMerma === "producto") {
        if (!data.producto) {
          return [null, "Para una merma de producto, debe especificar el producto."];
        }
        
        const productoRepository = AppDataSource.getRepository("Producto");
        const producto = await productoRepository.findOneBy({ id: data.producto.id });
        if (!producto) {
          return [null, "El producto especificado no existe."];
        }
        
        // Verificar que exista recepción de stock para este producto
        if (!data.recepcionStock) {
          return [null, "Para una merma de producto, debe especificar la recepción de stock asociada."];
        }
        
        const recepcionStockRepository = AppDataSource.getRepository("RecepcionStock");
        const recepcionStock = await recepcionStockRepository.findOne({
          where: { id: data.recepcionStock.id, producto: { id: data.producto.id } }
        });
        
        if (!recepcionStock) {
          return [null, "La recepción de stock especificada no existe o no está asociada al producto indicado."];
        }
        
      } else if (data.tipoProductoMerma === "subproducto") {
        if (!data.subproducto) {
          return [null, "Para una merma de subproducto, debe especificar el subproducto."];
        }
        
        if (!data.tipoSubproducto) {
          return [null, "Para una merma de subproducto, debe especificar el tipo de subproducto."];
        }
        
        const subproductoRepository = AppDataSource.getRepository("Subproducto");
        console.log("Buscando subproducto con ID:", data.subproducto.id);
        const subproducto = await subproductoRepository.findOneBy({ id: data.subproducto.id });
        console.log("Subproducto encontrado:", subproducto);
        if (!subproducto) {
          return [null, "El subproducto especificado no existe."];
        }
      } else {
        return [null, "El tipo de producto de la merma no es válido."];
      }

      // Verificar personal
      if (!data.personal) {
        return [null, "Debe especificar el personal que reporta la merma."];
      }

      const personalRepository = AppDataSource.getRepository("Personal");
      const personal = await personalRepository.findOneBy({ id: data.personal.id });
      if (!personal) {
        return [null, "El personal especificado no existe."];
      }

      // Limpiar datos según el tipo de merma
      const datosLimpios = { ...data };
      
      if (data.tipoProductoMerma === "subproducto") {
        // Para subproductos, establecer campos no necesarios como null explícitamente
        datosLimpios.recepcionStock = null;
        datosLimpios.producto = null;
        datosLimpios.animalCorte = null;
        datosLimpios.animalVara = null;
        datosLimpios.tipoCorteCarne = null;
        
        // Asegurar que tenemos los campos requeridos
        if (!datosLimpios.tipoSubproducto) {
          return [null, "Para una merma de subproducto, el campo tipoSubproducto es obligatorio."];
        }
      } else if (data.tipoProductoMerma === "producto") {
        // Para productos, establecer campos no necesarios como null
        datosLimpios.subproducto = null;
        datosLimpios.animalCorte = null;
        datosLimpios.animalVara = null;
        datosLimpios.tipoCorteCarne = null;
        datosLimpios.tipoSubproducto = null;
      } else if (data.tipoProductoMerma === "carne") {
        // Para carne, establecer campos no necesarios como null
        datosLimpios.producto = null;
        datosLimpios.recepcionStock = null;
        datosLimpios.subproducto = null;
        datosLimpios.tipoSubproducto = null;
      }

      const nuevaMerma = mermaRepository.create(datosLimpios);
      console.log("Datos limpios para crear merma:", datosLimpios);
      console.log("Merma creada:", nuevaMerma);
      await mermaRepository.save(nuevaMerma);
      return [nuevaMerma, null];
    } catch (error) {
      console.error("Error detallado en crearMerma:", error);
      console.error("Error stack:", error.stack);
      // Return more specific error information
      if (error.code === '23503') {
        return [null, "Error de referencia: uno de los datos referenciados no existe en la base de datos."];
      } else if (error.code === '23502') {
        return [null, "Error de datos requeridos: falta información obligatoria."];
      } else if (error.message) {
        return [null, `Error específico: ${error.message}`];
      }
      return [null, "No se pudo crear el registro de merma."];
    }
  },

  async obtenerMermas() {
    try {
      const mermaRepository = AppDataSource.getRepository(Merma);
      const mermas = await mermaRepository.find({ 
        relations: ["producto", "subproducto", "animalCorte", "animalVara", "personal"] 
      });
      return [mermas, null];
    } catch (error) {
      console.error("Error en obtenerMermas:", error);
      return [null, "Error al obtener las mermas."];
    }
  },

  async obtenerMermaPorId(id) {
    try {
      const mermaRepository = AppDataSource.getRepository(Merma);
      const merma = await mermaRepository.findOne({ 
        where: { id },
        relations: ["producto", "subproducto", "animalCorte", "animalVara", "personal"] 
      });
      
      if (!merma) return [null, "Merma no encontrada."];
      return [merma, null];
    } catch (error) {
      console.error("Error en obtenerMermaPorId:", error);
      return [null, "Error al obtener la merma."];
    }
  },

  async filtrarMermasPorTipo(tipo) {
    try {
      if (!["carne", "producto", "subproducto"].includes(tipo)) {
        return [null, "El tipo de merma debe ser 'carne', 'producto' o 'subproducto'."];
      }

      const mermaRepository = AppDataSource.getRepository(Merma);
      const mermas = await mermaRepository.find({ 
        where: { tipoProductoMerma: tipo },
        relations: ["producto", "subproducto", "animalCorte", "animalVara", "personal"] 
      });
      return [mermas, null];
    } catch (error) {
      console.error("Error en filtrarMermasPorTipo:", error);
      return [null, "Error al filtrar las mermas por tipo."];
    }
  },

  async filtrarMermasPorFecha(fechaInicio, fechaFin) {
    try {
      if (!fechaInicio || !fechaFin) {
        return [null, "Debe proporcionar fecha de inicio y fecha de fin."];
      }

      const mermaRepository = AppDataSource.getRepository(Merma);
      const mermas = await mermaRepository.find({ 
        where: { 
          fechaRegistro: Between(new Date(fechaInicio), new Date(fechaFin)) 
        },
        relations: ["producto", "subproducto", "animalCorte", "animalVara", "personal"] 
      });
      return [mermas, null];
    } catch (error) {
      console.error("Error en filtrarMermasPorFecha:", error);
      return [null, "Error al filtrar las mermas por fecha."];
    }
  },

  async filtrarMermasPorPersonal(personalId) {
    try {
      const mermaRepository = AppDataSource.getRepository(Merma);
      const mermas = await mermaRepository.find({ 
        where: { personal: { id: personalId } },
        relations: ["producto", "subproducto", "animalCorte", "animalVara", "personal"] 
      });
      return [mermas, null];
    } catch (error) {
      console.error("Error en filtrarMermasPorPersonal:", error);
      return [null, "Error al filtrar las mermas por personal."];
    }
  },

  async modificarMerma(id, datosActualizados) {
    try {
      const mermaRepository = AppDataSource.getRepository(Merma);
      const merma = await mermaRepository.findOneBy({ id });

      if (!merma) return [null, "Merma no encontrada."];

      // Verificación del tipo de merma
      if (datosActualizados.tipoProductoMerma && 
          datosActualizados.tipoProductoMerma !== merma.tipoProductoMerma) {
        // Si se está cambiando el tipo de merma, realizar las validaciones necesarias
        if (datosActualizados.tipoProductoMerma === "carne") {
          if (!datosActualizados.animalCorte || !datosActualizados.animalVara) {
            return [null, "Para una merma de carne, debe especificar el corte y la vara del animal."];
          }
        } else if (datosActualizados.tipoProductoMerma === "producto") {
          if (!datosActualizados.producto) {
            return [null, "Para una merma de producto, debe especificar el producto."];
          }
          if (!datosActualizados.recepcionStock) {
            return [null, "Para una merma de producto, debe especificar la recepción de stock asociada."];
          }
          
          // Verificar que la recepción de stock corresponde al producto
          const recepcionStockRepository = AppDataSource.getRepository("RecepcionStock");
          const recepcionStock = await recepcionStockRepository.findOne({
            where: { id: datosActualizados.recepcionStock.id, producto: { id: datosActualizados.producto.id } }
          });
          
          if (!recepcionStock) {
            return [null, "La recepción de stock especificada no existe o no está asociada al producto indicado."];
          }
        } else if (datosActualizados.tipoProductoMerma === "subproducto") {
          if (!datosActualizados.subproducto) {
            return [null, "Para una merma de subproducto, debe especificar el subproducto."];
          }
          if (!datosActualizados.recepcionStock) {
            return [null, "Para una merma de subproducto, debe especificar la recepción de stock asociada."];
          }
          
          // Verificar que existe la recepción de stock
          const recepcionStockRepository = AppDataSource.getRepository("RecepcionStock");
          const recepcionStock = await recepcionStockRepository.findOne({
            where: { id: datosActualizados.recepcionStock.id }
          });
          
          if (!recepcionStock) {
            return [null, "La recepción de stock especificada no existe."];
          }
        } else {
          return [null, "El tipo de producto de la merma no es válido."];
        }
      }

      Object.assign(merma, datosActualizados);
      await mermaRepository.save(merma);

      return [merma, null];
    } catch (error) {
      console.error("Error en modificarMerma:", error);
      return [null, "No se pudo modificar la merma."];
    }
  },

  async eliminarMerma(id) {
    try {
      const mermaRepository = AppDataSource.getRepository(Merma);
      const merma = await mermaRepository.findOneBy({ id });

      if (!merma) return [null, "Merma no encontrada."];

      await mermaRepository.remove(merma);
      return [null, null];
    } catch (error) {
      console.error("Error en eliminarMerma:", error);
      return [null, "No se pudo eliminar la merma."];
    }
  },

  async exportarExcelMermas() {
    try {
      const [mermas, err] = await this.obtenerMermas();
      if (err) return [null, err];

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Mermas");

      // Definir encabezados
      worksheet.columns = [
        { header: "ID", key: "id", width: 10 },
        { header: "Fecha de Registro", key: "fechaRegistro", width: 15 },
        { header: "Tipo de Producto", key: "tipoProductoMerma", width: 15 },
        { header: "Cantidad Perdida (kg)", key: "cantidadPerdida", width: 15 },
        { header: "Causa", key: "causa", width: 30 },
        { header: "Detalles", key: "detalles", width: 40 },
        { header: "Personal", key: "personal", width: 20 },
        { header: "Producto/Subproducto/Corte", key: "itemNombre", width: 25 },
        { header: "N° Recepción Stock", key: "recepcionStockId", width: 15 },
        { header: "Fecha Recepción", key: "fechaRecepcion", width: 15 },
        { header: "Costo Unitario", key: "costoUnitario", width: 15 }
      ];

      // Agregar datos
      mermas.forEach(merma => {
        let itemNombre = "";
        let recepcionStockId = "";
        let fechaRecepcion = "";
        let costoUnitario = "";
        
        if (merma.tipoProductoMerma === "producto" && merma.producto) {
          itemNombre = merma.producto.nombre;
          if (merma.recepcionStock) {
            recepcionStockId = merma.recepcionStock.id;
            fechaRecepcion = merma.recepcionStock.fecha;
            costoUnitario = merma.recepcionStock.costoUnitario;
          }
        } else if (merma.tipoProductoMerma === "subproducto" && merma.subproducto) {
          itemNombre = merma.subproducto.nombre;
          if (merma.recepcionStock) {
            recepcionStockId = merma.recepcionStock.id;
            fechaRecepcion = merma.recepcionStock.fecha;
            costoUnitario = merma.recepcionStock.costoUnitario;
          }
        } else if (merma.tipoProductoMerma === "carne" && merma.animalCorte) {
          itemNombre = merma.animalCorte.nombreLista;
        }

        worksheet.addRow({
          id: merma.id,
          fechaRegistro: merma.fechaRegistro,
          tipoProductoMerma: merma.tipoProductoMerma,
          cantidadPerdida: merma.cantidadPerdida,
          causa: merma.causa,
          detalles: merma.detalles,
          personal: merma.personal ? `${merma.personal.nombre} ${merma.personal.apellido}` : "N/A",
          itemNombre,
          recepcionStockId,
          fechaRecepcion,
          costoUnitario
        });
      });

      // Estilo de encabezados
      worksheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFCCEEFF' }
        };
      });

      // Generar buffer
      const buffer = await workbook.xlsx.writeBuffer();
      return [buffer, null];
    } catch (error) {
      console.error("Error en exportarExcelMermas:", error);
      return [null, "No se pudo generar el archivo Excel de mermas."];
    }
  }
};
