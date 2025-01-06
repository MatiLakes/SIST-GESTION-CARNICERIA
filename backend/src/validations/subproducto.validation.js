"use strict";
import Joi from "joi";

// Esquema para cantidades (decomisados y entregados)
const cantidadSchema = Joi.number()
  .min(0)
  .integer()
  .messages({
    "number.base": "La cantidad debe ser un número.",
    "number.min": "La cantidad no puede ser negativa.",
    "number.integer": "La cantidad debe ser un número entero.",
  });

// Esquema para precios
const precioSchema = Joi.number()
  .min(0)
  .precision(2)
  .messages({
    "number.base": "El precio debe ser un número.",
    "number.min": "El precio no puede ser negativo.",
    "number.precision": "El precio debe tener como máximo 2 decimales.",
  });

// Validación para subproductos
export const subproductoValidation = Joi.object({
  fechaFaena: Joi.date()
    .required()
    .messages({
      "date.base": "La fecha de faena debe ser una fecha válida.",
      "any.required": "La fecha de faena es obligatoria.",
    }),
  numeroAnimalesFaenados: Joi.number()
    .min(1)
    .integer()
    .required()
    .messages({
      "number.base": "El número de animales faenados debe ser un número.",
      "number.min": "Debe haber al menos un animal faenado.",
      "number.integer": "El número de animales faenados debe ser un número entero.",
      "any.required": "El número de animales faenados es obligatorio.",
    }),
  fechaEntrega: Joi.date()
    .required()
    .messages({
      "date.base": "La fecha de entrega debe ser una fecha válida.",
      "any.required": "La fecha de entrega es obligatoria.",
    }),
  guataDecomisados: cantidadSchema,
  guataEntregados: cantidadSchema,
  precioGuata: precioSchema,
  corazonDecomisados: cantidadSchema,
  corazonEntregados: cantidadSchema,
  precioCorazon: precioSchema,
  cabezasDecomisados: cantidadSchema,
  cabezasEntregados: cantidadSchema,
  precioCabezas: precioSchema,
  lenguasDecomisados: cantidadSchema,
  lenguasEntregados: cantidadSchema,
  precioLenguas: precioSchema,
  chunchulDecomisados: cantidadSchema,
  chunchulEntregados: cantidadSchema,
  precioChunchul: precioSchema,
  higadoDecomisados: cantidadSchema,
  higadoEntregados: cantidadSchema,
  precioHigado: precioSchema,
  rinonDecomisados: cantidadSchema,
  rinonEntregados: cantidadSchema,
  precioRinon: precioSchema,
  patasDecomisados: cantidadSchema,
  patasEntregados: cantidadSchema,
  precioPatas: precioSchema,
  charchaDecomisados: cantidadSchema,
  charchaEntregados: cantidadSchema,
  precioCharcha: precioSchema,
})
  .unknown(true)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
  });
