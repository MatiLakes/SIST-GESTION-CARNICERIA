import Joi from "joi";

export const animalVaraValidation = (animalCortes) =>
  Joi.object({
    fechaLlegada: Joi.date()
      .max(new Date().toLocaleString("en-US", { timeZone: "America/Santiago" }))
      .required()
      .messages({
        "date.base": "La fecha de llegada debe ser una fecha válida.",
        "date.max": "La fecha de llegada no puede ser posterior a la fecha actual",
        "any.required": "La fecha de llegada es obligatoria.",
      }),
    temperaturaLlegada: Joi.number()
      .min(-10)
      .max(10)
      .required()
      .messages({
        "number.base": "La temperatura de llegada debe ser un número.",
        "number.min": "La temperatura de llegada no puede ser menor a -10°C.",
        "number.max": "La temperatura de llegada no puede ser mayor a 10°C.",
        "any.required": "La temperatura de llegada es obligatoria.",
      }),

    precioTotalVara: Joi.number()
      .min(1)
      .max(99999999)
      .integer()
      .required()
      .messages({
        "number.base": "El precio total de la vara debe ser un número.",
        "number.min": "El precio total de la vara debe ser mayor a 0.",
        "number.max": "El precio total de la vara no puede tener más de 8 cifras.",
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
    .unknown(true)
    .messages({
      "object.unknown": "No se permiten propiedades adicionaless.",
    });
