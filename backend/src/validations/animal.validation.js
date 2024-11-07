"use strict";
import Joi from "joi";

// Validación para AnimalCorte
export const animalCortesValidation = Joi.object({
  nombreCorte: Joi.string()
    .min(3)
    .max(50)
    .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .messages({
      "string.empty": "El nombre del corte no puede estar vacío.",
      "string.base": "El nombre del corte debe ser de tipo string.",
      "string.min": "El nombre del corte debe tener como mínimo 3 caracteres.",
      "string.max": "El nombre del corte debe tener como máximo 50 caracteres.",
      "string.pattern.base": "El nombre del corte solo puede contener letras y espacios.",
    }),
  cantidadKilos: Joi.number()
    .min(0)
    .precision(2)
    .messages({
      "number.base": "La cantidad de kilos debe ser un número.",
      "number.min": "La cantidad de kilos no puede ser negativa.",
    }),
  precioPorKilo: Joi.number()
    .min(0)
    .integer()
    .messages({
      "number.base": "El precio por kilo debe ser un número.",
      "number.min": "El precio por kilo no puede ser negativo.",
      "number.integer": "El precio por kilo debe ser un número entero.",
    }),
  tipoAnimal: Joi.string()
    .min(3)
    .max(50)
    .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .messages({
      "string.empty": "El tipo de animal no puede estar vacío.",
      "string.base": "El tipo de animal debe ser de tipo string.",
      "string.min": "El tipo de animal debe tener como mínimo 3 caracteres.",
      "string.max": "El tipo de animal debe tener como máximo 50 caracteres.",
      "string.pattern.base": "El tipo de animal solo puede contener letras y espacios.",
    }),
})
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
  });

// Validación para AnimalVara
export const animalVaraValidation = Joi.object({
  numeroVara: Joi.number()
    .integer()
    .positive()
    .messages({
      "number.base": "El número de vara debe ser un número.",
      "number.integer": "El número de vara debe ser un número entero.",
      "number.positive": "El número de vara debe ser un número positivo.",
    }),
  fechaLlegada: Joi.date()
    .max("now")
    .messages({
      "date.base": "La fecha de llegada debe ser una fecha válida.",
      "date.max": "La fecha de llegada no puede ser una fecha futura.",
    }),
  temperaturaLlegada: Joi.number()
    .precision(1)
    .messages({
      "number.base": "La temperatura de llegada debe ser un número.",
    }),
  nombreRecibidor: Joi.string()
    .min(3)
    .max(50)
    .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .messages({
      "string.empty": "El nombre del recibidor no puede estar vacío.",
      "string.base": "El nombre del recibidor debe ser de tipo string.",
      "string.min": "El nombre del recibidor debe tener como mínimo 3 caracteres.",
      "string.max": "El nombre del recibidor debe tener como máximo 50 caracteres.",
      "string.pattern.base": "El nombre del recibidor solo puede contener letras y espacios.",
    }),
  precioTotal: Joi.number()
    .min(0)
    .integer()
    .messages({
      "number.base": "El precio total debe ser un número.",
      "number.min": "El precio total no puede ser negativo.",
      "number.integer": "El precio total debe ser un número entero.",
    }),
})
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
  });
