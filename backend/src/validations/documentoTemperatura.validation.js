import Joi from "joi";

export const documentoTemperaturaValidation = () => Joi.object({
  fecha: Joi.date()
    .max('now')
    .required()
    .messages({
      "date.base": "La fecha debe ser una fecha válida.",
      "date.max": "La fecha no puede ser posterior a la fecha actual.",
      "any.required": "La fecha es obligatoria.",
    }),

  registros: Joi.array()
    .items(
      Joi.object({
        hora: Joi.string()
          .pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
          .required()
          .messages({
            "string.base": "La hora debe ser una cadena de texto.",
            "string.pattern.base": "La hora debe tener el formato HH:MM (24 horas).",
            "any.required": "La hora es obligatoria.",
          }),

        equipo: Joi.string()
          .min(1)
          .max(100)
          .required()
          .messages({
            "string.base": "El nombre del equipo debe ser una cadena de texto.",
            "string.min": "El nombre del equipo no puede estar vacío.",
            "string.max": "El nombre del equipo no puede tener más de 100 caracteres.",
            "any.required": "El nombre del equipo es obligatorio.",
          }),

        temperatura: Joi.number()
          .min(-100)
          .max(100)
          .precision(1)
          .required()
          .messages({
            "number.base": "La temperatura debe ser un número.",
            "number.min": "La temperatura no puede ser menor a -100°C.",
            "number.max": "La temperatura no puede ser mayor a 100°C.",
            "number.precision": "La temperatura puede tener máximo 1 decimal.",
            "any.required": "La temperatura es obligatoria.",
          }),

        funciona: Joi.boolean()
          .required()
          .messages({
            "boolean.base": "El estado de funcionamiento debe ser verdadero o falso.",
            "any.required": "El estado de funcionamiento es obligatorio.",
          }),

        motivo: Joi.when('funciona', {
          is: false,
          then: Joi.string()
            .min(1)
            .max(200)
            .required()
            .messages({
              "string.base": "El motivo debe ser una cadena de texto.",
              "string.min": "El motivo no puede estar vacío cuando el equipo no funciona.",
              "string.max": "El motivo no puede tener más de 200 caracteres.",
              "any.required": "El motivo es obligatorio cuando el equipo no funciona correctamente.",
            }),
          otherwise: Joi.string()
            .allow(null, '')
            .max(200)
            .messages({
              "string.base": "El motivo debe ser una cadena de texto.",
              "string.max": "El motivo no puede tener más de 200 caracteres.",
            })
        }),

        AccionCorrectiva: Joi.when('funciona', {
          is: false,
          then: Joi.string()
            .min(1)
            .max(200)
            .required()
            .messages({
              "string.base": "La acción correctiva debe ser una cadena de texto.",
              "string.min": "La acción correctiva no puede estar vacía cuando el equipo no funciona.",
              "string.max": "La acción correctiva no puede tener más de 200 caracteres.",
              "any.required": "La acción correctiva es obligatoria cuando el equipo no funciona correctamente.",
            }),
          otherwise: Joi.string()
            .allow(null, '')
            .max(200)
            .messages({
              "string.base": "La acción correctiva debe ser una cadena de texto.",
              "string.max": "La acción correctiva no puede tener más de 200 caracteres.",
            })
        }),

        responsableId: Joi.number()
          .integer()
          .positive()
          .required()
          .messages({
            "number.base": "El ID del responsable debe ser un número.",
            "number.integer": "El ID del responsable debe ser un número entero.",
            "number.positive": "El ID del responsable debe ser un número positivo.",
            "any.required": "El responsable es obligatorio.",
          })
      })
    )
    .min(1)
    .required()
    .messages({
      "array.base": "Los registros deben ser un array.",
      "array.min": "Debe haber al menos 1 registro de temperatura.",
      "any.required": "Los registros son obligatorios.",
    })
})
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
  });
