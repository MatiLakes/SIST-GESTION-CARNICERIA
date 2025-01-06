import Joi from "joi";

// Validación para cantidad en kilogramos y precios
const cantidadKgSchema = Joi.number()
  .min(0)
  .precision(2)
  .messages({
    "number.base": "La cantidad en kilogramos debe ser un número.",
    "number.min": "La cantidad en kilogramos no puede ser negativa.",
    "number.precision": "La cantidad en kilogramos debe tener como máximo 2 decimales.",
  });

const precioKgSchema = Joi.number()
  .min(0)
  .precision(2)
  .messages({
    "number.base": "El precio por kilogramo debe ser un número.",
    "number.min": "El precio por kilogramo no puede ser negativo.",
    "number.precision": "El precio por kilogramo debe tener como máximo 2 decimales.",
  });

// Validación de productos cárnicos
export const productosCarnicosValidation = Joi.object({
  tipo_producto: Joi.string()
    .min(3)
    .max(255)
    .required()
    .messages({
      "string.empty": "El tipo de producto no puede estar vacío.",
      "string.base": "El tipo de producto debe ser de tipo string.",
      "string.min": "El tipo de producto debe tener como mínimo 3 caracteres.",
      "string.max": "El tipo de producto debe tener como máximo 255 caracteres.",
      "any.required": "El tipo de producto es obligatorio.",
    }),

  marca: Joi.string()
    .max(100)
    .optional()
    .messages({
      "string.base": "La marca debe ser de tipo string.",
      "string.max": "La marca no puede tener más de 100 caracteres.",
    }),

  cantidad_kg: cantidadKgSchema.required(),

  precio_kg_compra: precioKgSchema.required(),

  precio_kg_venta: precioKgSchema.required(),

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
