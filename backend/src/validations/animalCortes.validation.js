"use strict";
import Joi from "joi";

const cantidadSchema = Joi.number()
  .min(0)
  .precision(2)
  .messages({
    "number.base": "La cantidad debe ser un número.",
    "number.min": "La cantidad no puede ser negativa.",
    "number.precision": "La cantidad debe tener como máximo 2 decimales.",
  
  });

const precioSchema = Joi.number()
  .min(0)
  .integer()
 
  .messages({
    "number.base": "El precio debe ser un número.",
    "number.min": "El precio no puede ser negativo.",
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

})
  .unknown(true)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
  });