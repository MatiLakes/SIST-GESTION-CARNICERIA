import Joi from "joi";

export const mermaValidation = () =>
  Joi.object({
    fechaRegistro: Joi.date()
      .max('now')
      .messages({
        "date.base": "La fecha de registro debe ser una fecha válida.",
        "date.max": "La fecha de registro no puede ser futura.",
      }),
    tipoProductoMerma: Joi.string()
      .valid("carne", "producto", "subproducto")
      .required()
      .messages({
        "string.base": "El tipo de producto de merma debe ser una cadena de texto.",
        "string.valid": "El tipo de producto de merma debe ser 'carne', 'producto' o 'subproducto'.",
        "any.required": "El tipo de producto de merma es obligatorio.",
      }),
    cantidadPerdida: Joi.number()
      .positive()
      .required()
      .messages({
        "number.base": "La cantidad perdida debe ser un número.",
        "number.positive": "La cantidad perdida debe ser un valor positivo.",
        "any.required": "La cantidad perdida es obligatoria.",
      }),
    causa: Joi.string()
      .max(255)
      .required()
      .messages({
        "string.base": "La causa debe ser una cadena de texto.",
        "string.max": "La causa no puede tener más de 255 caracteres.",
        "any.required": "La causa es obligatoria.",
      }),
    detalles: Joi.string()
      .allow(null, '')
      .messages({
        "string.base": "Los detalles deben ser una cadena de texto.",
      }),
    producto: Joi.object()
      .when('tipoProductoMerma', {
        is: 'producto',
        then: Joi.object().required().messages({
          "any.required": "Debe especificar el producto para una merma de tipo producto.",
        }),
        otherwise: Joi.object().allow(null)
      }),
    subproducto: Joi.object()
      .when('tipoProductoMerma', {
        is: 'subproducto',
        then: Joi.object().required().messages({
          "any.required": "Debe especificar el subproducto para una merma de tipo subproducto.",
        }),
        otherwise: Joi.object().allow(null)
      }),
    recepcionStock: Joi.object()
      .when('tipoProductoMerma', {
        is: 'producto',
        then: Joi.object().required().messages({
          "any.required": "Debe especificar la recepción de stock asociada para una merma de producto.",
        }),
        otherwise: Joi.object().allow(null)
      }),
    animalCorte: Joi.object()
      .when('tipoProductoMerma', {
        is: 'carne',
        then: Joi.object().required().messages({
          "any.required": "Debe especificar el corte de animal para una merma de tipo carne.",
        }),
        otherwise: Joi.object().allow(null)
      }),
    animalVara: Joi.object()
      .when('tipoProductoMerma', {
        is: 'carne',
        then: Joi.object().optional().allow(null).messages({
          "object.base": "La vara de animal debe ser un objeto válido.",
        }),
        otherwise: Joi.object().allow(null)
      }),
    tipoCorteCarne: Joi.string()
      .when('tipoProductoMerma', {
        is: 'carne',
        then: Joi.string().required().messages({
          "any.required": "Debe especificar el tipo de corte de carne para una merma de tipo carne.",
          "string.base": "El tipo de corte de carne debe ser una cadena de texto.",
        }),
        otherwise: Joi.string().allow(null, '')
      }),
    tipoSubproducto: Joi.string()
      .when('tipoProductoMerma', {
        is: 'subproducto',
        then: Joi.string().required().messages({
          "any.required": "Debe especificar el tipo de subproducto para una merma de tipo subproducto.",
          "string.base": "El tipo de subproducto debe ser una cadena de texto.",
        }),
        otherwise: Joi.string().allow(null, '')
      }),
    personal: Joi.object()
      .required()
      .messages({
        "object.base": "El personal debe ser un objeto.",
        "any.required": "El personal que reporta la merma es obligatorio.",
      }),
  })
    .unknown(true)
    .messages({
      "object.unknown": "No se permiten propiedades adicionales.",
    });
