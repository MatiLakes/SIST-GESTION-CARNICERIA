import Joi from "joi";

export const controlHigieneValidation = () => Joi.object({
    personalId: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        "number.base": "El ID del personal debe ser un número.",
        "number.integer": "El ID del personal debe ser un número entero.",
        "number.positive": "El ID del personal debe ser un número positivo.",
        "any.required": "El ID del personal es obligatorio.",
      }),

    fecha: Joi.alternatives()
      .try(
        Joi.date().max('now'),
        Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).message('La fecha debe estar en formato YYYY-MM-DD')
      )
      .required()
      .messages({
        "alternatives.match": "La fecha debe ser una fecha válida en formato YYYY-MM-DD o un objeto Date.",
        "date.max": "La fecha no puede ser posterior a la fecha actual.",
        "any.required": "La fecha es obligatoria.",
      }),

    usoCofia: Joi.boolean()
      .required()
      .messages({
        "boolean.base": "El uso de cofia debe ser verdadero o falso.",
        "any.required": "El uso de cofia es obligatorio.",
      }),

    usoMascarilla: Joi.boolean()
      .required()
      .messages({
        "boolean.base": "El uso de mascarilla debe ser verdadero o falso.",
        "any.required": "El uso de mascarilla es obligatorio.",
      }),

    higieneManos: Joi.boolean()
      .required()
      .messages({
        "boolean.base": "La higiene de manos debe ser verdadero o falso.",
        "any.required": "La higiene de manos es obligatoria.",
      }),

    unasCortas: Joi.boolean()
      .required()
      .messages({
        "boolean.base": "El estado de uñas cortas debe ser verdadero o falso.",
        "any.required": "El estado de uñas cortas es obligatorio.",
      }),

    afeitado: Joi.boolean()
      .required()
      .messages({
        "boolean.base": "El estado de afeitado debe ser verdadero o falso.",
        "any.required": "El estado de afeitado es obligatorio.",
      }),

    uniformeLimpio: Joi.boolean()
      .required()
      .messages({
        "boolean.base": "El estado del uniforme limpio debe ser verdadero o falso.",
        "any.required": "El estado del uniforme limpio es obligatorio.",
      }),

    sinAccesorios: Joi.boolean()
      .required()
      .messages({
        "boolean.base": "El estado de sin accesorios debe ser verdadero o falso.",
        "any.required": "El estado de sin accesorios es obligatorio.",
      }),

    observacion: Joi.string()
      .allow(null, '')
      .max(500)
      .messages({
        "string.base": "La observación debe ser una cadena de texto.",
        "string.max": "La observación no puede tener más de 500 caracteres.",
      }),    nroAccionCorrectiva: Joi.string()
      .valid("ACC N°1", "ACC N°2", "ACC N°3", "ACC N°4", "ACC N°5", "ACC N°6", "ACC N°7", "No Aplica")
      .required()
      .messages({
        "string.base": "El número de acción correctiva debe ser una cadena de texto.",
        "any.only": "La acción correctiva debe ser una de las opciones válidas: ACC N°1 a ACC N°7 o 'No Aplica'",
        "any.required": "El número de acción correctiva es obligatorio.",
      }),

    vbCumplimiento: Joi.string()
      .valid("C", "NC")
      .required()
      .messages({
        "string.base": "El VB de cumplimiento debe ser una cadena de texto.",
        "any.only": "El VB de cumplimiento debe ser 'C' o 'NC'.",
        "any.required": "El VB de cumplimiento es obligatorio.",
      }),

  })
    .unknown(true)
    .messages({
      "object.unknown": "No se permiten propiedades adicionales.",
    });
