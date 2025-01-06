import Joi from "joi";

// Validación para cantidad recibida y precios
const cantidadRecibidaSchema = Joi.number()
  .integer()
  .min(0)
  .messages({
    "number.base": "La cantidad recibida debe ser un número entero.",
    "number.min": "La cantidad recibida no puede ser negativa.",
    "number.integer": "La cantidad recibida debe ser un número entero.",
  });

const precioSchema = Joi.number()
  .min(0)
  .precision(2)
  .messages({
    "number.base": "El precio debe ser un número.",
    "number.min": "El precio no puede ser negativo.",
    "number.precision": "El precio debe tener como máximo 2 decimales.",
  });

// Validación para productos no cárnicos
export const productosNoCarnicosValidation = Joi.object({
  nombre: Joi.string()
    .min(3)
    .max(255)
    .required()
    .messages({
      "string.empty": "El nombre del producto no puede estar vacío.",
      "string.base": "El nombre del producto debe ser de tipo string.",
      "string.min": "El nombre del producto debe tener como mínimo 3 caracteres.",
      "string.max": "El nombre del producto debe tener como máximo 255 caracteres.",
      "any.required": "El nombre del producto es obligatorio.",
    }),

  cantidad_recibida: cantidadRecibidaSchema.required(),

  precio_compra: precioSchema.required(),

  precio_venta: precioSchema.required(),

  fecha_vencimiento: Joi.date()
    .optional()
    .messages({
      "date.base": "La fecha de vencimiento debe ser una fecha válida.",
    }),

  fecha_llegada: Joi.date()
    .default(() => "CURRENT_DATE")
    .messages({
      "date.base": "La fecha de llegada debe ser una fecha válida.",
    }),

  // Validación de la categoría (solo con los mensajes de error que deseas)
  categoria: Joi.string()
    .required()
    .messages({
      "any.only": "La categoría seleccionada no es válida.",
      "any.required": "La categoría es obligatoria.",
    }),
})
  .unknown(true)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
  });
