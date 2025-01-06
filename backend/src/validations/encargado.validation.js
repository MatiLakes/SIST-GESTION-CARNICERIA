import Joi from "joi";

// Esquema de validación para crear y actualizar un encargado
const encargadoSchema = Joi.object({
  nombre: Joi.string()
    .min(2)
    .max(255)
    .required()
    .messages({
      "string.base": "El nombre del encargado debe ser un texto",
      "string.empty": "El nombre no puede estar vacío",
      "string.min": "El nombre debe tener al menos {#limit} caracteres",
      "string.max": "El nombre no puede tener más de {#limit} caracteres",
      "any.required": "El nombre es obligatorio",
    }),
  estado: Joi.boolean()
    .required()
    .messages({
      "boolean.base": "El estado debe ser un valor booleano",
      "any.required": "El estado es obligatorio",
    }),
  contactos: Joi.array()
    .items(
      Joi.object({
        tipo: Joi.string().valid("teléfono", "móvil").required().messages({
          "any.required": "El tipo de contacto es obligatorio",
          "string.base": "El tipo debe ser 'teléfono' o 'móvil'",
        }),
        numero: Joi.string().pattern(/^[0-9]{9}$/).required().messages({
          "any.required": "El número de contacto es obligatorio",
          "string.pattern.base": "El número de contacto debe tener exactamente 9 dígitos",
        }),
      })
    )
    .optional()
    .messages({
      "array.base": "Los contactos deben ser un array de objetos",
    }),
  proveedorId: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "El proveedorId debe ser un número entero",
      "number.integer": "El proveedorId debe ser un número entero",
      "number.positive": "El proveedorId debe ser un número positivo",
      "any.required": "El proveedorId es obligatorio",
    }),
})
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
  });

// Exportar las validaciones para el cuerpo de la solicitud de encargado
export const encargadoBodyValidation = {
  validate: (data) => encargadoSchema.validate(data),
};

// Exportar las validaciones para actualizar el encargado
export const encargadoUpdateBodyValidation = {
  validate: (data) => encargadoSchema.validate(data),
};

// Esquema de validación para la consulta de encargado
export const encargadoQueryValidation = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "El ID debe ser un número entero",
      "number.integer": "El ID debe ser un número entero",
      "number.positive": "El ID debe ser un número positivo",
      "any.required": "El ID es obligatorio",
    }),
  nombre: Joi.string().optional(),
  estado: Joi.boolean().optional(),
  proveedorId: Joi.number().integer().positive().optional(),
})
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
  });
