import Joi from "joi";

export const tipoProductoValidation = () =>
  Joi.object({
    nombre: Joi.string()
      .max(100)
      .required()
      .messages({
        "string.base": "El nombre del tipo debe ser una cadena de texto.",
        "string.max": "El nombre del tipo no puede tener más de 100 caracteres.",
        "string.empty": "El nombre del tipo no puede estar vacío.",
        "any.required": "El nombre del tipo es obligatorio.",
      }),
  })
    .unknown(true)
    .messages({
      "object.unknown": "No se permiten propiedades adicionales.",
    });
