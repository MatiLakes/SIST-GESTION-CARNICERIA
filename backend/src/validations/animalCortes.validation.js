"use strict";
import Joi from "joi";

const cantidadSchema = Joi.number()
  .min(0)
  .max(9999999)
  .precision(2)
  .messages({
    "number.base": "La cantidad debe ser un número.",
    "number.min": "La cantidad no puede ser negativa.",
    "number.max": "La cantidad no puede ser mayor a 7 cifras.",
    "number.precision": "La cantidad debe tener como máximo 2 decimales.",
  
  });

const precioSchema = Joi.number()
  .min(0)
  .max(9999999)
  .integer()
 
  .messages({
    "number.base": "El precio debe ser un número.",
    "number.min": "El precio no puede ser negativo.",
    "number.max": "El precio no puede ser mayor a 7 cifras.",
    "number.integer": "El precio debe ser un número entero.",
  
  });

export const animalCortesValidation = Joi.object({
  nombreLista: Joi.string()
    .min(3)
    .max(50)
    .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .required()
    .messages({
      "string.empty": "El nombre de la lista no puede estar vacío.",
      "string.base": "El nombre de la lista debe ser de tipo string.",
      "string.min": "El nombre de la lista debe tener como mínimo 3 caracteres.",
      "string.max": "El nombre de la lista debe tener como máximo 50 caracteres.",
      "string.pattern.base": "El nombre de la lista solo puede contener letras y espacios.",
      "any.required": "El nombre de la lista es obligatorio.",
    }),
    abastero: cantidadSchema,
    precioAbastero: precioSchema,
    asadoTira: cantidadSchema,
    precioAsadoTira:precioSchema, 
    asadoCarnicero: cantidadSchema,
    precioAsadoCarnicero: precioSchema, 
    asiento:cantidadSchema,
    precioAsiento:precioSchema, 
    choclillo: cantidadSchema,
    precioChoclillo: precioSchema, 
    cogote: cantidadSchema, 
    precioCogote: precioSchema, 
    entraña: cantidadSchema,
    precioEntraña: precioSchema, 
    filete: cantidadSchema,
    precioFilete: precioSchema, 
    ganso: cantidadSchema,
    precioGanso: precioSchema, 
    huachalomo: cantidadSchema,
    precioHuachalomo: precioSchema, 
    lomoLiso: cantidadSchema,
    precioLomoLiso: precioSchema, 
    lomoVetado: cantidadSchema,
    precioLomoVetado: precioSchema, 
    palanca: cantidadSchema,
    precioPalanca: precioSchema, 
    plateada: cantidadSchema,
    precioPlateada: precioSchema, 
    polloBarriga: cantidadSchema,
    precioPolloBarriga: precioSchema, 
    polloGanso: cantidadSchema,
    precioPolloGanso: precioSchema, 
    postaNegra: cantidadSchema,
    precioPostaNegra: precioSchema, 
    postaPaleta: cantidadSchema,
    precioPostaPaleta: precioSchema, 
    postaRosada: cantidadSchema,
    precioPostaRosada: precioSchema, 
    puntaGanso: cantidadSchema,
    precioPuntaGanso: precioSchema, 
    puntaPicana: cantidadSchema,
    precioPuntaPicana: precioSchema, 
    puntaPaleta: cantidadSchema,
    precioPuntaPaleta: precioSchema, 
    sobrecostilla: cantidadSchema,
    precioSobrecostilla: precioSchema, 
    tapabarriga: cantidadSchema,
    precioTapabarriga: precioSchema, 
    tapapecho: cantidadSchema,
    precioTapapecho: precioSchema, 
    huesoCarnudo: cantidadSchema,
    precioHuesoCarnudo: precioSchema, 
    huesoCConCarne: cantidadSchema,
    precioHuesoCConCarne: precioSchema, 
    pataVacuno: cantidadSchema,
    precioPataVacuno: precioSchema, 
    huachalomoOlla: cantidadSchema,
    precioHuachalomoOlla: precioSchema, 
    cazuelaPaleta: cantidadSchema,
    precioCazuelaPaleta: precioSchema, 
    osobuco: cantidadSchema,
    precioOsobuco: precioSchema, 
    lagarto: cantidadSchema, 
    precioLagarto: precioSchema, 
    costillaVacuno: cantidadSchema,
    precioCostillaVacuno: precioSchema, 
    tapaposta: cantidadSchema,
    precioTapaposta: precioSchema, 
    malaya: cantidadSchema,
    precioMalaya: precioSchema, 

})
  .unknown(true)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
  });