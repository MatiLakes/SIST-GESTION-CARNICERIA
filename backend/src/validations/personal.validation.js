import Joi from "joi";

export const personalValidation = () =>
  Joi.object({    nombre: Joi.string()
      .pattern(/^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/)
      .max(100)
      .required()
      .messages({
        "string.base": "El nombre debe ser una cadena de texto.",
        "string.max": "El nombre no puede tener más de 100 caracteres.",
        "string.pattern.base": "El nombre solo puede contener letras y espacios.",
        "any.required": "El nombre es obligatorio.",
      }),

    seccion: Joi.string()
      .max(100)
      .required()
      .messages({
        "string.base": "La sección debe ser una cadena de texto.",
        "string.max": "La sección no puede tener más de 100 caracteres.",
        "any.required": "La sección es obligatoria.",
      }),
  })
    .messages({
      "object.unknown": "No se permiten campos adicionales.",
    });
