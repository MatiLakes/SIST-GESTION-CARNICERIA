"use strict";
import Joi from "joi";

// Esquema para cantidades (decomisados y entregados)
const cantidadSchema = Joi.alternatives().try(
  Joi.number()
    .integer()
    .min(0)
    .max(1000),
  Joi.string()
    .pattern(/^0*([0-9]{1,4})$/)
    .custom((value, helpers) => {
      const numero = parseInt(value, 10);
      if (numero > 1000) {
        return helpers.error('number.max');
      }
      return numero;
    })
)
.messages({
  "number.base": "La cantidad debe ser un número.",
  "number.integer": "La cantidad debe ser un número entero.",
  "number.min": "La cantidad no puede ser negativa.",
  "number.max": "La cantidad no puede ser mayor a 1000.",
  "string.pattern.base": "La cantidad debe ser un número válido.",
});

// Esquema para precios
const precioSchema = Joi.number()
  .min(0)
  .max(9999999)
  .messages({
    "number.base": "El precio debe ser un número.",
    "number.min": "El precio debe ser mayor o igual a 0.",
    "number.max": "El precio de venta no puede tener más de 7 cifras.",
  });

// Validación para subproductos
export const subproductoValidation = Joi.object({  fechaFaena: Joi.date()
    .max('now')
    .required()
    .messages({
      "date.base": "La fecha de faena debe ser una fecha válida.",
      "date.max": "La fecha faena no puede ser posterior a la fecha actual.",
      "any.required": "La fecha de faena es obligatoria.",
    }),
  numeroAnimalesFaenados: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .required()
    .messages({
      "number.base": "El número de animales faenados debe ser un número.",
      "number.integer": "El número de animales faenados debe ser un número entero.",
      "number.min": "Debe haber al menos un animal faenado.",
      "number.max": "El número de animales faenados no puede ser mayor a 100.",
      "any.required": "El número de animales faenados es obligatorio.",
    }),
  fechaEntrega: Joi.date()
    .max('now')
    .required()
    .messages({
      "date.base": "La fecha de entrega debe ser una fecha válida.",
      "date.max": "La fecha de entrega no puede ser posterior a la fecha actual.",
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
