import Joi from "joi";

export const productoValidation = () =>
  Joi.object({    nombre: Joi.string()
      .max(100)
      .required()
      .messages({
        "string.base": "El nombre debe ser una cadena de texto.",
        "string.max": "El nombre no puede tener más de 100 caracteres.",
        "any.required": "El nombre es obligatorio.",
      }),
    variante: Joi.string()
      .max(100)
      .allow(null, '')
      .messages({
        "string.base": "La variante debe ser una cadena de texto.",
        "string.max": "La variante no puede tener más de 100 caracteres.",
      }),
    precioVenta: Joi.number()
      .min(1)
      .max(99999999)
      .required()
      .messages({
        "number.base": "El precio de venta debe ser un número.",
        "number.min": "El precio de venta debe ser mayor a 0.",
        "number.max": "El precio de venta no puede tener más de 8 cifras.",
        "any.required": "El precio de venta es obligatorio.",
      }),
    tipoMedida: Joi.string()
      .valid("kilos", "unidades")
      .default("unidades")
      .messages({
        "string.base": "El tipo de medida debe ser una cadena de texto.",
        "any.only": "El tipo de medida debe ser 'kilos' o 'unidades'.",
      }),
    tipo: Joi.object()
      .required()
      .messages({
        "object.base": "El tipo de producto debe ser un objeto.",
        "any.required": "El tipo de producto es obligatorio.",
      }),
    marca: Joi.object()
      .required()
      .messages({
        "object.base": "La marca del producto debe ser un objeto.",
        "any.required": "La marca del producto es obligatoria.",
      }),
  })
    .unknown(true)
    .messages({
      "object.unknown": "No se permiten propiedades adicionales.",
    });
