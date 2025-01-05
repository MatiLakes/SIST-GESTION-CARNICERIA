import Joi from "joi";

export const animalVaraValidation = (animalCortes) =>
  Joi.object({
    fechaLlegada: Joi.date()
      .max("now")
      .required()
      .messages({
        "date.base": "La fecha de llegada debe ser una fecha válida.",
        "date.max": "La fecha de llegada no puede ser una fecha futura.",
        "any.required": "La fecha de llegada es obligatoria.",
      }),
    temperaturaLlegada: Joi.number()
      .min(-50)
      .max(50)
      .required()
      .messages({
        "number.base": "La temperatura de llegada debe ser un número.",
        "number.min": "La temperatura de llegada no puede ser menor a -50.",
        "number.max": "La temperatura de llegada no puede ser mayor a 50.",
        "any.required": "La temperatura de llegada es obligatoria.",
      }),

    precioTotalVara: Joi.number()
      .min(0)
      .integer()
      .required()
      .messages({
        "number.base": "El precio total de la vara debe ser un número.",
        "number.min": "El precio total de la vara no puede ser negativo.",
        "number.integer": "El precio total de la vara debe ser un número entero.",
        "any.required": "El precio total de la vara es obligatorio.",
      }),
    tipoAnimal: Joi.object({
      nombreLista: Joi.string()
        .valid(...animalCortes)
        .required()
        .messages({
          "any.only": "El tipo de animal seleccionado no es válido.",
          "any.required": "El tipo de animal es obligatorio.",
        }),
    })
      .required()
      .messages({
        "object.base": "El tipo de animal debe ser un objeto.",
        "object.required": "El tipo de animal es obligatorio.",
      }),
  })
    .unknown(false)
    .messages({
      "object.unknown": "No se permiten propiedades adicionaless.",
    });
