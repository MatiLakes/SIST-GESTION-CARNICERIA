"use strict";

import { AppDataSource } from "../config/configDb.js";
import AnimalVaraSchema from "../entity/AnimalVara.entity.js";
import AnimalCorteSchema from "../entity/AnimalCortes.entity.js";
import ProductoSchema from "../entity/Producto.entity.js";
import RecepcionStockSchema from "../entity/RecepcionStock.entity.js";
import SubproductoSchema from "../entity/subproducto.entity.js";
import MermaSchema from "../entity/Merma.entity.js";

/**
 * Servicio para calcular la ganancia estimada total del negocio
 * Considera: AnimalVara, Productos, Subproductos y Mermas
 */
export class GananciaEstimadaService {
  constructor() {
    this.animalVaraRepository = AppDataSource.getRepository(AnimalVaraSchema);
    this.animalCorteRepository = AppDataSource.getRepository(AnimalCorteSchema);
    this.productoRepository = AppDataSource.getRepository(ProductoSchema);
    this.recepcionStockRepository = AppDataSource.getRepository(RecepcionStockSchema);
    this.subproductoRepository = AppDataSource.getRepository(SubproductoSchema);
    this.mermaRepository = AppDataSource.getRepository(MermaSchema);
  }

  /**
   * Calcula la ganancia estimada total
   * @param {Object} filtroFechas - Objeto con fechaInicio y fechaFin (opcional)
   * @returns {Object} Objeto con el desglose de ganancias y pérdidas
   */
  async calcularGananciaEstimada(filtroFechas = null) {
    try {
      console.log("🏁 Iniciando cálculo de ganancia estimada en servicio");
      console.log("📊 Filtro de fechas:", filtroFechas);
      
      // Calcular ganancias de animales en vara
      console.log("🐄 Calculando ganancias de animales en vara...");
      const gananciaAnimalVara = await this.calcularGananciaAnimalVara(filtroFechas);
      console.log("✅ Ganancias animal vara:", gananciaAnimalVara.gananciaTotal);
      
      // Calcular ganancias de productos
      console.log("📦 Calculando ganancias de productos...");
      const gananciaProductos = await this.calcularGananciaProductos(filtroFechas);
      console.log("✅ Ganancias productos:", gananciaProductos.gananciaTotal);
      
      // Calcular ganancias de subproductos
      console.log("🥩 Calculando ganancias de subproductos...");
      const gananciaSubproductos = await this.calcularGananciaSubproductos(filtroFechas);
      console.log("✅ Ganancias subproductos:", gananciaSubproductos.gananciaTotal);
      
      // Calcular pérdidas por mermas
      console.log("⚠️ Calculando pérdidas por mermas...");
      const perdidasMermas = await this.calcularPerdidasMermas(filtroFechas);
      console.log("✅ Pérdidas mermas:", perdidasMermas.perdidaTotal);

      // Calcular totales
      const totalGanancias = gananciaAnimalVara.gananciaTotal + gananciaProductos.gananciaTotal + gananciaSubproductos.gananciaTotal;
      const totalPerdidas = gananciaAnimalVara.perdidaTotal + gananciaProductos.perdidaTotal + perdidasMermas.perdidaTotal;
      const gananciaEstimadaTotal = totalGanancias - totalPerdidas;

      console.log("📈 Totales calculados:", { totalGanancias, totalPerdidas, gananciaEstimadaTotal });

      return {
        detalles: {
          animalVara: gananciaAnimalVara,
          productos: gananciaProductos,
          subproductos: gananciaSubproductos,
          mermas: perdidasMermas
        },
        resumen: {
          totalGanancias,
          totalPerdidas,
          gananciaEstimadaTotal,
          margenGanancia: totalGanancias > 0 ? ((gananciaEstimadaTotal / totalGanancias) * 100).toFixed(2) : 0
        }
      };
    } catch (error) {
      console.error("💥 Error en calcularGananciaEstimada:", error);
      console.error("Stack trace:", error.stack);
      throw new Error(`Error al calcular ganancia estimada: ${error.message}`);
    }
  }

  /**
   * Calcula la ganancia de los animales en vara
   * Ganancia = Suma(cantidad_corte * precio_corte) - precio_total_vara
   * @param {Object} filtroFechas - Objeto con fechaInicio y fechaFin (opcional)
   */
  async calcularGananciaAnimalVara(filtroFechas = null) {
    try {
      console.log("🐄 Iniciando cálculo de ganancias animal vara");
      console.log("📅 Filtro fechas:", filtroFechas);
      
      let queryBuilder = this.animalVaraRepository.createQueryBuilder('animalVara')
        .leftJoinAndSelect('animalVara.tipoAnimal', 'tipoAnimal');
      
      // Aplicar filtro de fechas si se proporciona
      if (filtroFechas && filtroFechas.fechaInicio && filtroFechas.fechaFin) {
        console.log("🔍 Aplicando filtro de fechas para animal vara");
        queryBuilder = queryBuilder
          .where('animalVara.fechaLlegada >= :fechaInicio', { fechaInicio: filtroFechas.fechaInicio })
          .andWhere('animalVara.fechaLlegada <= :fechaFin', { fechaFin: filtroFechas.fechaFin + 'T23:59:59.999Z' });
      }

      console.log("🔍 Ejecutando query animal vara...");
      const animalesVara = await queryBuilder.getMany();
      console.log(`📊 Encontrados ${animalesVara.length} animales en vara`);

      let gananciaTotal = 0;
      let perdidaTotal = 0;
      let detalleAnimales = [];

      for (const animalVara of animalesVara) {
        const tipoAnimal = animalVara.tipoAnimal;
        let ingresosPorCortes = 0;

      // Calcular ingresos por todos los cortes
      const cortesYPrecios = [
        { cantidad: tipoAnimal.abastero, precio: tipoAnimal.precioAbastero },
        { cantidad: tipoAnimal.asadoTira, precio: tipoAnimal.precioAsadoTira },
        { cantidad: tipoAnimal.asadoCarnicero, precio: tipoAnimal.precioAsadoCarnicero },
        { cantidad: tipoAnimal.asiento, precio: tipoAnimal.precioAsiento },
        { cantidad: tipoAnimal.choclillo, precio: tipoAnimal.precioChoclillo },
        { cantidad: tipoAnimal.cogote, precio: tipoAnimal.precioCogote },
        { cantidad: tipoAnimal.entraña, precio: tipoAnimal.precioEntraña },
        { cantidad: tipoAnimal.filete, precio: tipoAnimal.precioFilete },
        { cantidad: tipoAnimal.ganso, precio: tipoAnimal.precioGanso },
        { cantidad: tipoAnimal.huachalomo, precio: tipoAnimal.precioHuachalomo },
        { cantidad: tipoAnimal.lomoLiso, precio: tipoAnimal.precioLomoLiso },
        { cantidad: tipoAnimal.lomoVetado, precio: tipoAnimal.precioLomoVetado },
        { cantidad: tipoAnimal.palanca, precio: tipoAnimal.precioPalanca },
        { cantidad: tipoAnimal.plateada, precio: tipoAnimal.precioPlateada },
        { cantidad: tipoAnimal.polloBarriga, precio: tipoAnimal.precioPolloBarriga },
        { cantidad: tipoAnimal.polloGanso, precio: tipoAnimal.precioPolloGanso },
        { cantidad: tipoAnimal.postaNegra, precio: tipoAnimal.precioPostaNegra },
        { cantidad: tipoAnimal.postaPaleta, precio: tipoAnimal.precioPostaPaleta },
        { cantidad: tipoAnimal.postaRosada, precio: tipoAnimal.precioPostaRosada },
        { cantidad: tipoAnimal.puntaGanso, precio: tipoAnimal.precioPuntaGanso },
        { cantidad: tipoAnimal.puntaPicana, precio: tipoAnimal.precioPuntaPicana },
        { cantidad: tipoAnimal.puntaPaleta, precio: tipoAnimal.precioPuntaPaleta },
        { cantidad: tipoAnimal.sobrecostilla, precio: tipoAnimal.precioSobrecostilla },
        { cantidad: tipoAnimal.tapabarriga, precio: tipoAnimal.precioTapabarriga },
        { cantidad: tipoAnimal.tapapecho, precio: tipoAnimal.precioTapapecho },
        { cantidad: tipoAnimal.huesoCarnudo, precio: tipoAnimal.precioHuesoCarnudo },
        { cantidad: tipoAnimal.huesoCConCarne, precio: tipoAnimal.precioHuesoCConCarne },
        { cantidad: tipoAnimal.pataVacuno, precio: tipoAnimal.precioPataVacuno },
        { cantidad: tipoAnimal.huachalomoOlla, precio: tipoAnimal.precioHuachalomoOlla },
        { cantidad: tipoAnimal.cazuelaPaleta, precio: tipoAnimal.precioCazuelaPaleta },
        { cantidad: tipoAnimal.osobuco, precio: tipoAnimal.precioOsobuco },
        { cantidad: tipoAnimal.lagarto, precio: tipoAnimal.precioLagarto },
        { cantidad: tipoAnimal.costillaVacuno, precio: tipoAnimal.precioCostillaVacuno },
        { cantidad: tipoAnimal.tapaposta, precio: tipoAnimal.precioTapaposta },
        { cantidad: tipoAnimal.malaya, precio: tipoAnimal.precioMalaya }
      ];

      ingresosPorCortes = cortesYPrecios.reduce((total, corte) => {
        return total + (corte.cantidad * corte.precio);
      }, 0);

      const gananciaAnimal = ingresosPorCortes - animalVara.precioTotalVara;
      
      if (gananciaAnimal > 0) {
        gananciaTotal += gananciaAnimal;
      } else {
        perdidaTotal += Math.abs(gananciaAnimal);
      }

      detalleAnimales.push({
        id: animalVara.id,
        tipoAnimal: tipoAnimal.nombreLista,
        fechaIngreso: animalVara.fechaLlegada,
        ingresosEstimados: ingresosPorCortes,
        costoTotal: animalVara.precioTotalVara,
        ganancia: gananciaAnimal,
        margen: ingresosPorCortes > 0 ? ((gananciaAnimal / ingresosPorCortes) * 100).toFixed(2) : "0.00"
      });
    }      return {
        gananciaTotal,
        perdidaTotal: 0, // Los animales en vara no generan pérdidas directas
        detalles: detalleAnimales
      };
    } catch (error) {
      console.error("💥 Error en calcularGananciaAnimalVara:", error);
      throw error;
    }
  }

  /**
   * Calcula la ganancia de productos en stock
   * @param {Object} filtroFechas - Objeto con fechaInicio y fechaFin (opcional)
   */
  async calcularGananciaProductos(filtroFechas = null) {
    let queryBuilder = this.recepcionStockRepository.createQueryBuilder("recepcion")
      .leftJoinAndSelect("recepcion.producto", "producto")
      .leftJoinAndSelect("producto.marca", "marca");
    
    // Aplicar filtro de fechas si se proporciona
    if (filtroFechas && filtroFechas.fechaInicio && filtroFechas.fechaFin) {
      queryBuilder = queryBuilder
        .where("recepcion.fecha >= :fechaInicio", { fechaInicio: filtroFechas.fechaInicio })
        .andWhere("recepcion.fecha <= :fechaFin", { fechaFin: filtroFechas.fechaFin + "T23:59:59.999Z" });
    }

    const recepciones = await queryBuilder.getMany();

    let gananciaTotal = 0;
    let perdidaTotal = 0;
    let detalleProductos = [];

    for (const recepcion of recepciones) {
      const ingresoEstimado = recepcion.cantidad * recepcion.producto.precioVenta;
      const costoCompra = recepcion.cantidad * parseFloat(recepcion.costoUnitario);
      const gananciaProducto = ingresoEstimado - costoCompra;

      if (gananciaProducto > 0) {
        gananciaTotal += gananciaProducto;
      } else {
        perdidaTotal += Math.abs(gananciaProducto);
      }

      detalleProductos.push({
        id: recepcion.id,
        nombre: recepcion.producto.nombre,
        tipoProducto: recepcion.producto.variante || 'No especificado',
        marca: recepcion.producto.marca ? recepcion.producto.marca.nombre : 'No especificada',
        cantidadStock: recepcion.cantidad,
        tipoMedida: recepcion.producto.tipoMedida || 'unidad',
        precioCompra: parseFloat(recepcion.costoUnitario),
        precioVenta: recepcion.producto.precioVenta,
        ganancia: gananciaProducto,
        margen: ingresoEstimado > 0 ? ((gananciaProducto / ingresoEstimado) * 100).toFixed(2) : "0.00",
        fecha: recepcion.fecha
      });
    }

    return {
      gananciaTotal,
      perdidaTotal: 0, // Los productos en sí no generan pérdidas directas
      detalles: detalleProductos
    };
  }

  /**
   * Calcula la ganancia de subproductos
   * Ganancia = cantidad_entregados * precio_subproducto (para cada tipo de subproducto)
   * Los subproductos del mismo tipo y precio se agrupan automáticamente
   */
  /**
   * Calcula la ganancia de subproductos
   * @param {Object} filtroFechas - Objeto con fechaInicio y fechaFin (opcional)
   */
  async calcularGananciaSubproductos(filtroFechas = null) {
    let queryBuilder = this.subproductoRepository.createQueryBuilder("subproducto");
    
    // Aplicar filtro de fechas si se proporciona
    if (filtroFechas && filtroFechas.fechaInicio && filtroFechas.fechaFin) {
      queryBuilder = queryBuilder
        .where("subproducto.fechaFaena >= :fechaInicio", { fechaInicio: filtroFechas.fechaInicio })
        .andWhere("subproducto.fechaFaena <= :fechaFin", { fechaFin: filtroFechas.fechaFin + "T23:59:59.999Z" });
    }

    const subproductos = await queryBuilder.getMany();
    
    let gananciaTotal = 0;
    let agrupacionSubproductos = new Map(); // Para agrupar por tipo y precio

    for (const subproducto of subproductos) {
      // Calcular ganancia por cada tipo de subproducto entregado
      const tiposSubproductos = [
        { nombre: "Guata", entregados: subproducto.guataEntregados, precio: subproducto.precioGuata },
        { nombre: "Corazón", entregados: subproducto.corazonEntregados, precio: subproducto.precioCorazon },
        { nombre: "Cabezas", entregados: subproducto.cabezasEntregados, precio: subproducto.precioCabezas },
        { nombre: "Lenguas", entregados: subproducto.lenguasEntregados, precio: subproducto.precioLenguas },
        { nombre: "Chunchul", entregados: subproducto.chunchulEntregados, precio: subproducto.precioChunchul },
        { nombre: "Hígado", entregados: subproducto.higadoEntregados, precio: subproducto.precioHigado },
        { nombre: "Riñón", entregados: subproducto.rinonEntregados, precio: subproducto.precioRinon },
        { nombre: "Patas", entregados: subproducto.patasEntregados, precio: subproducto.precioPatas },
        { nombre: "Charcha", entregados: subproducto.charchaEntregados, precio: subproducto.precioCharcha }
      ];

      for (const tipo of tiposSubproductos) {
        if (tipo.entregados > 0 && tipo.precio > 0) {
          const ingresoTotal = tipo.entregados * tipo.precio;
          gananciaTotal += ingresoTotal;
          
          // Crear clave única para agrupar por tipo y precio
          const claveAgrupacion = `${tipo.nombre}_${tipo.precio}`;
          
          if (agrupacionSubproductos.has(claveAgrupacion)) {
            // Si ya existe esta combinación tipo-precio, sumar las cantidades
            const existente = agrupacionSubproductos.get(claveAgrupacion);
            existente.cantidadEntregada += tipo.entregados;
            existente.ingresoTotal += ingresoTotal;
            // Mantener la fecha más reciente
            if (subproducto.fechaEntrega > existente.fechaEntrega) {
              existente.fechaEntrega = subproducto.fechaEntrega;
            }
          } else {
            // Si es una nueva combinación tipo-precio, crear entrada nueva
            agrupacionSubproductos.set(claveAgrupacion, {
              tipo: tipo.nombre,
              cantidadEntregada: tipo.entregados,
              precioUnitario: tipo.precio,
              ingresoTotal: ingresoTotal,
              fechaEntrega: subproducto.fechaEntrega
            });
          }
        }
      }
    }

    // Convertir el Map a array para el resultado final
    const detalleSubproductos = Array.from(agrupacionSubproductos.values());

    return {
      gananciaTotal,
      perdidaTotal: 0, // Los subproductos solo generan ganancia
      detalles: detalleSubproductos
    };
  }

  /**
   * Calcula las pérdidas por mermas
   * Pérdida = cantidad_perdida * precio_correspondiente
   */
  /**
   * Calcula las pérdidas por mermas
   * @param {Object} filtroFechas - Objeto con fechaInicio y fechaFin (opcional)
   */
  async calcularPerdidasMermas(filtroFechas = null) {
    let queryBuilder = this.mermaRepository.createQueryBuilder("merma")
      .leftJoinAndSelect("merma.producto", "producto")
      .leftJoinAndSelect("merma.subproducto", "subproducto")
      .leftJoinAndSelect("merma.animalCorte", "animalCorte")
      .leftJoinAndSelect("merma.animalVara", "animalVara")
      .leftJoinAndSelect("merma.recepcionStock", "recepcionStock");
    
    // Aplicar filtro de fechas si se proporciona
    if (filtroFechas && filtroFechas.fechaInicio && filtroFechas.fechaFin) {
      queryBuilder = queryBuilder
        .where("merma.fechaRegistro >= :fechaInicio", { fechaInicio: filtroFechas.fechaInicio })
        .andWhere("merma.fechaRegistro <= :fechaFin", { fechaFin: filtroFechas.fechaFin + "T23:59:59.999Z" });
    }

    const mermas = await queryBuilder.getMany();

    let perdidaTotal = 0;
    let detalleMermas = [];

    for (const merma of mermas) {
      let perdidaMerma = 0;
      let precioReferencia = 0;
      let detalleProducto = null;

      // Determinar el precio según el tipo de producto perdido y sus relaciones
      if (merma.tipoProductoMerma === "producto" && merma.producto) {
        precioReferencia = merma.producto.precioVenta;
        detalleProducto = {
          tipo: "producto",
          id: merma.producto.id,
          nombre: merma.producto.nombre,
          variante: merma.producto.variante
        };
      } else if (merma.tipoProductoMerma === "subproducto" && merma.subproducto && merma.tipoSubproducto) {
        // Para subproductos, usar el precio específico del tipo de subproducto
        const subproducto = merma.subproducto;
        const tipoSubproducto = merma.tipoSubproducto.toLowerCase().trim();
        
        // Mapear tipos de subproductos a sus precios correspondientes
        const mappingSubproductos = {
          'guata': subproducto.precioGuata,
          'guatitas': subproducto.precioGuata,
          'corazon': subproducto.precioCorazon,
          'corazón': subproducto.precioCorazon,
          'cabezas': subproducto.precioCabezas,
          'cabeza': subproducto.precioCabezas,
          'lenguas': subproducto.precioLenguas,
          'lengua': subproducto.precioLenguas,
          'chunchul': subproducto.precioChunchul,
          'higado': subproducto.precioHigado,
          'hígado': subproducto.precioHigado,
          'rinon': subproducto.precioRinon,
          'riñón': subproducto.precioRinon,
          'patas': subproducto.precioPatas,
          'pata': subproducto.precioPatas,
          'charcha': subproducto.precioCharcha
        };
        
        precioReferencia = mappingSubproductos[tipoSubproducto] || 0;
        
        // Si no encuentra el precio, intentar búsqueda aproximada
        if (precioReferencia === 0) {
          for (const [key, precio] of Object.entries(mappingSubproductos)) {
            if (key.includes(tipoSubproducto) || tipoSubproducto.includes(key)) {
              precioReferencia = precio;
              break;
            }
          }
        }
        
        detalleProducto = {
          tipo: "subproducto",
          id: subproducto.id,
          fechaFaena: subproducto.fechaFaena,
          fechaEntrega: subproducto.fechaEntrega,
          tipoSubproducto: merma.tipoSubproducto
        };
      } else if (merma.tipoProductoMerma === "carne" && merma.animalCorte && merma.tipoCorteCarne) {
        // Para mermas de carne, buscar el precio del corte específico
        const animalCorte = merma.animalCorte;
        const nombreCorte = merma.tipoCorteCarne.toLowerCase().trim();
        
        // Mapear nombres de cortes a sus precios correspondientes (con múltiples variaciones de nombre)
        const mappingCortes = {
          // Abastero
          'abastero': animalCorte.precioAbastero,
          
          // Asado de Tira
          'asado tira': animalCorte.precioAsadoTira,
          'asado de tira': animalCorte.precioAsadoTira,
          'asadotira': animalCorte.precioAsadoTira,
          
          // Asado Carnicero
          'asado carnicero': animalCorte.precioAsadoCarnicero,
          'asadocarnicero': animalCorte.precioAsadoCarnicero,
          
          // Asiento
          'asiento': animalCorte.precioAsiento,
          
          // Choclillo
          'choclillo': animalCorte.precioChoclillo,
          
          // Cogote
          'cogote': animalCorte.precioCogote,
          
          // Entraña
          'entraña': animalCorte.precioEntraña,
          'entrana': animalCorte.precioEntraña,
          
          // Filete
          'filete': animalCorte.precioFilete,
          
          // Ganso
          'ganso': animalCorte.precioGanso,
          
          // Huachalomo
          'huachalomo': animalCorte.precioHuachalomo,
          
          // Lomo Liso
          'lomo liso': animalCorte.precioLomoLiso,
          'lomoliso': animalCorte.precioLomoLiso,
          
          // Lomo Vetado
          'lomo vetado': animalCorte.precioLomoVetado,
          'lomovetado': animalCorte.precioLomoVetado,
          
          // Palanca
          'palanca': animalCorte.precioPalanca,
          
          // Plateada
          'plateada': animalCorte.precioPlateada,
          
          // Pollo Barriga
          'pollo barriga': animalCorte.precioPolloBarriga,
          'pollobarriga': animalCorte.precioPolloBarriga,
          
          // Pollo Ganso
          'pollo ganso': animalCorte.precioPolloGanso,
          'polloganso': animalCorte.precioPolloGanso,
          
          // Posta Negra
          'posta negra': animalCorte.precioPostaNegra,
          'postanegra': animalCorte.precioPostaNegra,
          
          // Posta Paleta
          'posta paleta': animalCorte.precioPostaPaleta,
          'postapaleta': animalCorte.precioPostaPaleta,
          
          // Posta Rosada
          'posta rosada': animalCorte.precioPostaRosada,
          'postarosada': animalCorte.precioPostaRosada,
          
          // Punta Ganso
          'punta ganso': animalCorte.precioPuntaGanso,
          'puntaganso': animalCorte.precioPuntaGanso,
          
          // Punta Picana
          'punta picana': animalCorte.precioPuntaPicana,
          'puntapicana': animalCorte.precioPuntaPicana,
          
          // Punta Paleta
          'punta paleta': animalCorte.precioPuntaPaleta,
          'puntapaleta': animalCorte.precioPuntaPaleta,
          
          // Sobrecostilla
          'sobrecostilla': animalCorte.precioSobrecostilla,
          
          // Tapabarriga
          'tapabarriga': animalCorte.precioTapabarriga,
          'tapa barriga': animalCorte.precioTapabarriga,
          
          // Tapapecho
          'tapapecho': animalCorte.precioTapapecho,
          'tapa pecho': animalCorte.precioTapapecho,
          
          // Hueso Carnudo
          'hueso carnudo': animalCorte.precioHuesoCarnudo,
          'huesocarnudo': animalCorte.precioHuesoCarnudo,
          
          // Hueso con Carne
          'hueso con carne': animalCorte.precioHuesoCConCarne,
          'huesoconcarne': animalCorte.precioHuesoCConCarne,
          
          // Pata Vacuno
          'pata vacuno': animalCorte.precioPataVacuno,
          'patavacuno': animalCorte.precioPataVacuno,
          
          // Huachalomo Olla
          'huachalomo olla': animalCorte.precioHuachalomoOlla,
          'huachalomoolla': animalCorte.precioHuachalomoOlla,
          
          // Cazuela Paleta
          'cazuela paleta': animalCorte.precioCazuelaPaleta,
          'cazuelapaleta': animalCorte.precioCazuelaPaleta,
          
          // Osobuco
          'osobuco': animalCorte.precioOsobuco,
          
          // Lagarto
          'lagarto': animalCorte.precioLagarto,
          
          // Costilla Vacuno
          'costilla vacuno': animalCorte.precioCostillaVacuno,
          'costillavacuno': animalCorte.precioCostillaVacuno,
          
          // Tapaposta
          'tapaposta': animalCorte.precioTapaposta,
          'tapa posta': animalCorte.precioTapaposta,
          
          // Malaya
          'malaya': animalCorte.precioMalaya
        };
        
        precioReferencia = mappingCortes[nombreCorte] || 0;
        
        // Si no encuentra el precio, intentar búsqueda aproximada
        if (precioReferencia === 0) {
          for (const [key, precio] of Object.entries(mappingCortes)) {
            if (key.includes(nombreCorte) || nombreCorte.includes(key)) {
              precioReferencia = precio;
              break;
            }
          }
        }
        
        detalleProducto = {
          tipo: "carne",
          animalCorteId: animalCorte.id,
          nombreLista: animalCorte.nombreLista,
          tipoCorteCarne: merma.tipoCorteCarne
        };
      }

      perdidaMerma = merma.cantidadPerdida * precioReferencia;
      perdidaTotal += perdidaMerma;

      detalleMermas.push({
        id: merma.id,
        tipoMerma: merma.tipoProductoMerma,
        nombreItem: detalleProducto ? 
          (detalleProducto.tipo === "carne" ? merma.tipoCorteCarne : 
           detalleProducto.tipo === "producto" ? 
             (detalleProducto.variante ? `${detalleProducto.nombre} ${detalleProducto.variante}` : detalleProducto.nombre) : 
           detalleProducto.tipo === "subproducto" ? merma.tipoSubproducto :
           detalleProducto.tipo) : 'Producto no identificado',
        descripcion: merma.detalles || merma.causa,
        cantidadPerdida: merma.cantidadPerdida,
        unidadMedida: detalleProducto ? 
          (detalleProducto.tipo === "carne" ? 'kg' : 
           detalleProducto.unidadMedida || 'unidad') : 'unidad',
        precioReferencia,
        perdidaTotal: perdidaMerma,
        fecha: merma.fechaRegistro
      });
    }

    return {
      perdidaTotal,
      detalles: detalleMermas
    };
  }

  /**
   * Obtiene un resumen rápido de la ganancia estimada
   */
  /**
   * Obtiene solo el resumen de ganancia estimada
   * @param {Object} filtroFechas - Objeto con fechaInicio y fechaFin (opcional)
   */
  async obtenerResumenGanancia(filtroFechas = null) {
    const resultado = await this.calcularGananciaEstimada(filtroFechas);
    return resultado.resumen;
  }

  /**
   * Obtiene el detalle completo de ganancias por categoría
   * @param {Object} filtroFechas - Objeto con fechaInicio y fechaFin (opcional)
   */
  async obtenerDetalleCompleto(filtroFechas = null) {
    const resultado = await this.calcularGananciaEstimada(filtroFechas);
    return resultado.detalles;
  }
}

export default new GananciaEstimadaService();
