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
      .min(0)
      .max(9999999)
      .required()
      .messages({
        "number.base": "El precio de venta debe ser un número.",
        "number.min": "El precio de venta debe ser mayor o igual a 0.",
        "number.max": "El precio de venta no puede tener más de 7 cifras.",
        "any.required": "El precio de venta es obligatorio.",
      }),    fechaVencimiento: Joi.date()
      .custom((value, helpers) => {
        if (!value) return null;
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        today.setDate(today.getDate() - 1); // Permitir fechas desde 2 días antes
        
        const fechaVencimiento = new Date(value);
        fechaVencimiento.setHours(0, 0, 0, 0);
        
        if (fechaVencimiento < today) {
          return helpers.error('date.min');
        }
        return value;
      })
      .allow(null)
      .messages({
        "date.base": "La fecha de vencimiento debe ser una fecha válida.",
        "date.min": "La fecha de vencimiento debe ser igual o posterior a la fecha actual.",
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
