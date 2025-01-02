"use strict";

import Joi from "joi";

export const pedidoValidation = {
  create: Joi.object({
    cliente_nombre: Joi.string().max(100).required().messages({
      "any.required": "El nombre del cliente es obligatorio.",
      "string.max": "El nombre del cliente no puede exceder los 100 caracteres.",
    }),
    telefono_cliente: Joi.string()
      .pattern(/^[0-9]+$/)
      .min(8)
      .max(15)
      .required()
      .messages({
        "any.required": "El teléfono del cliente es obligatorio.",
        "string.pattern.base": "El teléfono debe contener solo números.",
        "string.min": "El teléfono debe tener al menos 8 dígitos.",
        "string.max": "El teléfono no puede exceder los 15 dígitos.",
      }),
    carnicero_nombre: Joi.string().max(100).required().messages({
      "any.required": "El nombre del carnicero es obligatorio.",
      "string.max": "El nombre del carnicero no puede exceder los 100 caracteres.",
    }),
    fecha_entrega: Joi.date()
      .greater("now")
      .required()
      .messages({
        "any.required": "La fecha de entrega es obligatoria.",
        "date.base": "La fecha de entrega debe ser válida.",
        "date.greater": "La fecha de entrega debe ser en el futuro.",
      }),
    productos: Joi.string().max(500).required().messages({
      "any.required": "La descripción de los productos es obligatoria.",
      "string.max": "La descripción de los productos no puede exceder los 500 caracteres.",
    }),
  }),
};
