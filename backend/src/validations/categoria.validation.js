import Joi from "joi";

const categoriaSchema = Joi.object({
  nombre: Joi.string()
    .min(3)
    .max(50)
    .required()
    .messages({
      "string.base": "El nombre debe ser un texto",
      "string.empty": "El nombre no puede estar vacío",
      "string.min": "El nombre debe tener al menos {#limit} caracteres",
      "string.max": "El nombre no puede tener más de {#limit} caracteres",
      "any.required": "El nombre es obligatorio",
    }),
  tipo_producto: Joi.string()
    .valid("Cárnico", "No Cárnico")
    .default("No Cárnico")
    .messages({
      "string.base": "El tipo de producto debe ser un texto",
      "any.only": "El tipo de producto debe ser 'Cárnico' o 'No Cárnico'",
    }),
})
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
  });

// Exportaciones
export const categoriaBodyValidation = {
  validate: (data) => categoriaSchema.validate(data),
};

export const categoriaUpdateBodyValidation = {
  validate: (data) => categoriaSchema.validate(data),
};

export const categoriaQueryValidation = Joi.object({
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
})
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
  });
