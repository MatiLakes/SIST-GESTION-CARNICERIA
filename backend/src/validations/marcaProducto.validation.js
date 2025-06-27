import Joi from "joi";

export const marcaProductoValidation = () =>
  Joi.object({
    nombre: Joi.string()
      .max(100)
      .required()
      .messages({
        "string.base": "El nombre de la marca debe ser una cadena de texto.",
        "string.max": "El nombre de la marca no puede tener más de 100 caracteres.",
        "string.empty": "El nombre de la marca no puede estar vacío.",
        "any.required": "El nombre de la marca es obligatorio.",
      }),
  })
    .unknown(true)
    .messages({
      "object.unknown": "No se permiten propiedades adicionales.",
    });
