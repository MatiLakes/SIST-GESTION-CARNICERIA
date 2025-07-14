import Joi from "joi";

export const recepcionStockBodyValidation = Joi.object({
  productoId: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'any.required': 'El campo producto es obligatorio',
      'number.base': 'El producto debe ser un número válido',
      'number.integer': 'El producto debe ser un número entero',
      'number.positive': 'El producto debe ser un ID válido'
    }),
  
  cantidad: Joi.number()
    .min(0)
    .max(10000)
    .precision(3) // Permite hasta 3 decimales
    .required()
    .messages({
      'any.required': 'El campo cantidad es obligatorio',
      'number.base': 'La cantidad debe ser un número válido',
      'number.min': 'La cantidad no puede ser negativa',
      'number.max': 'La cantidad no puede ser mayor a 10,000',
      'number.precision': 'La cantidad no puede tener más de 3 decimales'
    }),
  
  costoUnitario: Joi.number()
    .integer()
    .min(0)
    .max(10000000)
    .required()
    .messages({
      'any.required': 'El campo costo unitario es obligatorio',
      'number.base': 'El costo unitario debe ser un número válido',
      'number.integer': 'El costo unitario debe ser un número entero (sin decimales)',
      'number.min': 'El costo unitario no puede ser negativo',
      'number.max': 'El costo unitario no puede ser mayor a 10,000,000'
    }),
  
  fechaVencimiento: Joi.date()
    .iso()
    .min('now')
    .required()
    .messages({
      'any.required': 'El campo fecha de vencimiento es obligatorio',
      'date.base': 'La fecha de vencimiento debe ser una fecha válida',
      'date.format': 'La fecha de vencimiento debe estar en formato ISO',
      'date.min': 'La fecha de vencimiento no puede ser anterior a hoy'
    })
});

export const recepcionStockQueryValidation = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .messages({
      'number.base': 'El ID debe ser un número válido',
      'number.integer': 'El ID debe ser un número entero',
      'number.positive': 'El ID debe ser positivo'
    })
}).unknown(true);
