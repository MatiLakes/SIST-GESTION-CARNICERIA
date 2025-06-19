"use strict";

import Joi from "joi";

// Función para obtener la fecha actual menos un día
const getCurrentDate = () => {
  const today = new Date();
  today.setDate(today.getDate() - 1); // Restar un día
  today.setHours(0, 0, 0, 0);
  return today;
};

// Función de validación de fecha reutilizable
const validateDate = (value, helpers) => {
  const minDate = getCurrentDate();
  const entryDate = new Date(value);
  entryDate.setHours(0, 0, 0, 0);

  // Comparar solo las fechas (convertir a string YYYY-MM-DD para comparar)
  const minDateStr = minDate.toISOString().split('T')[0];
  const entryDateStr = entryDate.toISOString().split('T')[0];

  if (entryDateStr < minDateStr) {
    return helpers.error('date.min');
  }
  return value;
};

const schemas = {
  create: Joi.object({
    cliente_nombre: Joi.string()
      .max(100)
      .pattern(new RegExp('^[a-zA-ZáéíóúüÁÉÍÓÚÜñÑ][a-zA-ZáéíóúüÁÉÍÓÚÜñÑ\\s]*$'))
      .required()
      .messages({
        "any.required": "El nombre del cliente es obligatorio.",
        "string.empty": "El nombre del cliente es obligatorio.",
        "string.max": "El nombre del cliente no puede exceder los 100 caracteres.",
        "string.pattern.base": "El nombre del cliente solo puede contener letras y espacios, y debe comenzar con una letra."
      }),

    telefono_cliente: Joi.string()
      .pattern(/^\+56[0-9]{9}$/)
      .required()
      .messages({
        "any.required": "El teléfono del cliente es obligatorio.",
        "string.empty": "El teléfono del cliente es obligatorio.",
        "string.pattern.base": "El teléfono debe tener el formato +56 seguido de 9 dígitos."
      }),

    carnicero_nombre: Joi.string()
      .max(100)
      .pattern(new RegExp('^[a-zA-ZáéíóúüÁÉÍÓÚÜñÑ][a-zA-ZáéíóúüÁÉÍÓÚÜñÑ\\s]*$'))
      .required()
      .messages({
        "any.required": "El nombre del carnicero es obligatorio.",
        "string.empty": "El nombre del carnicero es obligatorio.",
        "string.max": "El nombre del carnicero no puede exceder los 100 caracteres.",
        "string.pattern.base": "El nombre del carnicero solo puede contener letras y espacios, y debe comenzar con una letra."
      }),

    fecha_entrega: Joi.date()
      .custom(validateDate)
      .required()
      .empty(null)
      .messages({
        "any.required": "La fecha de entrega es obligatoria.",
        "date.base": "La fecha de entrega debe ser una fecha válida.",
        "date.empty": "La fecha de entrega es obligatoria.",
        "date.min": "La fecha de entrega debe ser igual o posterior a la fecha actual."
      }),

    productos: Joi.string()
      .max(500)
      .required()
      .messages({
        "any.required": "La descripción de los productos es obligatoria.",
        "string.empty": "La descripción de los productos es obligatoria.",
        "string.max": "La descripción de los productos no puede exceder los 500 caracteres."
      })
  }),

  update: Joi.object({
    cliente_nombre: Joi.string()
      .max(100)
      .pattern(new RegExp('^[a-zA-ZáéíóúüÁÉÍÓÚÜñÑ][a-zA-ZáéíóúüÁÉÍÓÚÜñÑ\\s]*$'))
      .messages({
        "string.max": "El nombre del cliente no puede exceder los 100 caracteres.",
        "string.pattern.base": "El nombre del cliente solo puede contener letras y espacios, y debe comenzar con una letra."
      }),

    telefono_cliente: Joi.string()
      .pattern(/^\+56[0-9]{9}$/)
      .messages({
        "string.pattern.base": "El teléfono debe tener el formato +56 seguido de 9 dígitos."
      }),

    carnicero_nombre: Joi.string()
      .max(100)
      .pattern(new RegExp('^[a-zA-ZáéíóúüÁÉÍÓÚÜñÑ][a-zA-ZáéíóúüÁÉÍÓÚÜñÑ\\s]*$'))
      .messages({
        "string.max": "El nombre del carnicero no puede exceder los 100 caracteres.",
        "string.pattern.base": "El nombre del carnicero solo puede contener letras y espacios, y debe comenzar con una letra."
      }),

    fecha_entrega: Joi.date()
      .custom(validateDate)
      .messages({
        "date.base": "La fecha de entrega debe ser una fecha válida.",
        "date.min": "La fecha de entrega debe ser igual o posterior a la fecha del pedido."
      }),

    productos: Joi.string()
      .max(500)
      .messages({
        "string.max": "La descripción de los productos no puede exceder los 500 caracteres."
      })
  })
  .min(1)
  .messages({
    "object.min": "Debe proporcionar al menos un campo para actualizar."
  })
};

export const pedidoValidation = schemas;
