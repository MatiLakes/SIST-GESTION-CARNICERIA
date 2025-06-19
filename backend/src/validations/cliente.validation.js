"use strict";

import Joi from "joi";

// Función para calcular el dígito verificador de un RUT
function calcularDV(rutNumero) {
    let suma = 0;
    let multiplicador = 2;
    
    // Convertir a string y recorrer de derecha a izquierda
    let numeroStr = rutNumero.toString();
    for (let i = numeroStr.length - 1; i >= 0; i--) {
        suma += parseInt(numeroStr[i]) * multiplicador;
        multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }
    
    const resto = suma % 11;
    const dv = 11 - resto;
    
    if (dv === 11) return '0';
    if (dv === 10) return 'k';
    return dv.toString();
}

// Función para validar el rango del RUT según tipo de cliente
function validarRangoRUT(numero, tipoCliente, helpers) {
    const rutNumero = parseInt(numero);
    
    if (tipoCliente === 'Empresa') {
        if (rutNumero < 60000000) {
            if (rutNumero <= 30000000) {
                return helpers.message("Este RUT corresponde a una persona natural (menor a 30 millones). Para empresas el RUT debe ser mayor a 60 millones.");
            }
            return helpers.message("El RUT debe ser mayor o igual a 60.000.000 para empresas. Los RUTs menores corresponden a personas naturales.");
        }
        if (rutNumero > 90999999) {
            return helpers.message("El RUT de empresa debe ser menor o igual a 90.999.999.");
        }
        return true;
    } else {
        if (rutNumero < 1000000) {
            return helpers.message("Para personas naturales, el RUT debe ser mayor o igual a 1.000.000.");
        }
        if (rutNumero > 30000000) {
            if (rutNumero >= 60000000) {
                return helpers.message("Este RUT corresponde a una empresa (mayor a 60 millones). Para personas naturales el RUT debe ser menor a 30 millones.");
            }
            return helpers.message("Para personas naturales, el RUT debe ser menor o igual a 46.999.999.");
        }
        return true;
    }
}

// Lista de regiones válidas de Chile
const REGIONES_CHILE = [
    "Arica y Parinacota",
    "Tarapacá",
    "Antofagasta",
    "Atacama",
    "Coquimbo",
    "Valparaíso",
    "Metropolitana de Santiago",
    "O'Higgins",
    "Maule",
    "Ñuble",
    "Biobío",
    "Araucanía",
    "Los Ríos",
    "Los Lagos",
    "Aysén"
];

export const clienteValidation = {
    create: Joi.object({
        tipoCliente: Joi.string()
            .valid("Empresa", "Persona")
            .required()
            .messages({
                "string.base": "El tipo de cliente debe ser un texto.",
                "any.only": "El tipo de cliente debe ser 'Empresa' o 'Persona'.",
                "any.required": "El tipo de cliente es obligatorio."
            }),

        rut: Joi.when('tipoCliente', {
            is: 'Empresa',
            then: Joi.string()
                .pattern(/^(\d{2}(?:\.\d{3}){2}|\d{8})-[0-9kK]$/)
                .custom((value, helpers) => {
                    // Remover los puntos para validación
                    const rutLimpio = value.replace(/\./g, '');
                    const [numero, dv] = rutLimpio.split('-');
                    
                    // Validar que el número sea positivo
                    if (parseInt(numero) <= 0) {
                        return helpers.error('number.positive');
                    }

                    // Validar el rango según tipo de cliente
                    const resultadoRango = validarRangoRUT(numero, 'Empresa', helpers);
                    if (resultadoRango !== true) {
                        return resultadoRango;
                    }

                    // Validar que el dígito verificador sea correcto
                    const rutNumero = parseInt(numero);
                    const dvEnviado = dv.toLowerCase();
                    const dvCalculado = calcularDV(rutNumero);

                    if (dvCalculado !== dvEnviado) {
                        return helpers.error('string.dv');
                    }

                    return value;
                })
                .required()
                .messages({
                    "string.base": "El RUT debe ser un texto.",
                    "string.pattern.base": "El RUT de empresa debe tener el formato correcto (ej: 77.888.999-k o 77888999-k)",
                    "number.positive": "El número de RUT debe ser positivo.",
                    "rut.empresa.bajo": "El RUT de empresa debe ser mayor o igual a 60.000.000.",
                    "rut.empresa.alto": "El RUT de empresa debe ser menor o igual a 90.999.999.",
                    "string.dv": "El dígito verificador del RUT no es válido.",
                    "any.required": "El RUT es obligatorio."
                }),
            otherwise: Joi.string()
                .pattern(/^(\d{1,2}(?:\.\d{3}){2}|\d{7,8})-[0-9kK]$/)
                .custom((value, helpers) => {
                    // Remover los puntos para validación
                    const rutLimpio = value.replace(/\./g, '');
                    const [numero, dv] = rutLimpio.split('-');
                    
                    // Validar que el número sea positivo
                    if (parseInt(numero) <= 0) {
                        return helpers.error('number.positive');
                    }

                    // Validar el rango según tipo de cliente
                    const resultadoRango = validarRangoRUT(numero, 'Persona', helpers);
                    if (resultadoRango !== true) {
                        return resultadoRango;
                    }

                    // Validar que el dígito verificador sea correcto
                    const rutNumero = parseInt(numero);
                    const dvEnviado = dv.toLowerCase();
                    const dvCalculado = calcularDV(rutNumero);

                    if (dvCalculado !== dvEnviado) {
                        return helpers.error('string.dv');
                    }

                    return value;
                })
                .required()
                .messages({
                    "string.base": "El RUT debe ser un texto.",
                    "string.pattern.base": "El RUT debe tener el formato correcto (ej: 12.345.678-9 o 12345678-9)",
                    "number.positive": "El número de RUT debe ser positivo.",
                    "rut.persona.bajo": "Para personas naturales, el RUT debe ser mayor o igual a 1.000.000.",
                    "rut.persona.alto": "Para personas naturales, el RUT debe ser menor o igual a 46.999.999.",
                    "string.dv": "El dígito verificador del RUT no es válido.",
                    "any.required": "El RUT es obligatorio."
                })
        }),

        // Campos de empresa
        razonSocial: Joi.when('tipoCliente', {
            is: 'Empresa',
            then: Joi.string()
                .max(100)
                .required()
                .messages({
                    "string.base": "La razón social debe ser un texto.",
                    "string.max": "La razón social no puede exceder los 100 caracteres.",
                    "any.required": "La razón social es obligatoria para empresas."
                }),
            otherwise: Joi.forbidden()
                .messages({
                    "any.unknown": "La razón social no debe especificarse para clientes tipo Persona."
                })
        }),

        giro: Joi.when('tipoCliente', {
            is: 'Empresa',
            then: Joi.string()
                .max(100)
                .required()
                .messages({
                    "string.base": "El giro debe ser un texto.",
                    "string.max": "El giro no puede exceder los 100 caracteres.",
                    "any.required": "El giro es obligatorio para empresas."
                }),
            otherwise: Joi.forbidden()
                .messages({
                    "any.unknown": "El giro no debe especificarse para clientes tipo Persona."
                })
        }),

        // Campos de persona
        nombres: Joi.when('tipoCliente', {
            is: 'Persona',
            then: Joi.string()
                .max(100)
                .pattern(/^[a-zA-ZáéíóúüÁÉÍÓÚÜñÑ\s]*$/)
                .required()
                .messages({
                    "string.base": "Los nombres deben ser texto.",
                    "string.max": "Los nombres no pueden exceder los 100 caracteres.",
                    "string.pattern.base": "Los nombres solo pueden contener letras y espacios.",
                    "any.required": "Los nombres son obligatorios para personas."
                }),
            otherwise: Joi.forbidden()
                .messages({
                    "any.unknown": "Los nombres no deben especificarse para clientes tipo Empresa."
                })
        }),

        apellidos: Joi.when('tipoCliente', {
            is: 'Persona',
            then: Joi.string()
                .max(100)
                .pattern(/^[a-zA-ZáéíóúüÁÉÍÓÚÜñÑ\s]*$/)
                .required()
                .messages({
                    "string.base": "Los apellidos deben ser texto.",
                    "string.max": "Los apellidos no pueden exceder los 100 caracteres.",
                    "string.pattern.base": "Los apellidos solo pueden contener letras y espacios.",
                    "any.required": "Los apellidos son obligatorios para personas."
                }),
            otherwise: Joi.forbidden()
                .messages({
                    "any.unknown": "Los apellidos no deben especificarse para clientes tipo Empresa."
                })
        }),

        direccion: Joi.string()
            .max(200)
            .pattern(/^[a-zA-Z0-9áéíóúüÁÉÍÓÚÜñÑ\s,.\-_#°/()&]*$/)
            .required()
            .messages({
                "string.base": "La dirección debe ser un texto.",
                "string.max": "La dirección no puede exceder los 200 caracteres.",
                "string.pattern.base": "La dirección solo puede contener letras, números, espacios y caracteres especiales (. , - _ # ° / ( ) &)",
                "any.required": "La dirección es obligatoria."
            }),

        region: Joi.string()
            .valid(...REGIONES_CHILE)
            .required()
            .messages({
                "string.base": "La región debe ser un texto.",
                "any.only": "Debe seleccionar una región válida de Chile.",
                "any.required": "La región es obligatoria."
            }),

        comuna: Joi.string()
            .max(100)
            .pattern(/^[a-zA-ZáéíóúüÁÉÍÓÚÜñÑ\s]*$/)
            .required()
            .messages({
                "string.base": "La comuna debe ser un texto.",
                "string.max": "La comuna no puede exceder los 100 caracteres.",
                "string.pattern.base": "La comuna solo puede contener letras y espacios.",
                "any.required": "La comuna es obligatoria."
            }),

        ciudad: Joi.string()
            .max(100)
            .pattern(/^[a-zA-ZáéíóúüÁÉÍÓÚÜñÑ\s]*$/)
            .required()
            .messages({
                "string.base": "La ciudad debe ser un texto.",
                "string.max": "La ciudad no puede exceder los 100 caracteres.",
                "string.pattern.base": "La ciudad solo puede contener letras y espacios.",
                "any.required": "La ciudad es obligatoria."
            }),

        telefono: Joi.string()
            .pattern(/^\+56[0-9]{9}$/)
            .required()
            .messages({
                "string.pattern.base": "El número telefónico debe tener el formato +56 seguido de 9 dígitos (ejemplo: +56912345678)",
                "string.empty": "El número telefónico no puede estar vacío",
                "any.required": "El teléfono es obligatorio"
            }),

        email: Joi.string()
            .email()
            .max(100)
            .required()
            .messages({
                "string.base": "El email debe ser un texto.",
                "string.email": "El email debe tener un formato válido.",
                "string.max": "El email no puede exceder los 100 caracteres.",
                "any.required": "El email es obligatorio."
            })
    }),

    update: Joi.object({
        tipoCliente: Joi.string()
            .valid("Empresa", "Persona")
            .messages({
                "string.base": "El tipo de cliente debe ser un texto.",
                "any.only": "El tipo de cliente debe ser 'Empresa' o 'Persona'."
            }),

        rut: Joi.string()
            .pattern(/^(\d{1,2}(?:\.\d{3}){2}|\d{7,8})-[0-9kK]$/)
            .custom((value, helpers) => {
                // Remover los puntos para validación
                const rutLimpio = value.replace(/\./g, '');
                const [numero, dv] = rutLimpio.split('-');
                
                // Validar que el número sea positivo
                if (parseInt(numero) <= 0) {
                    return helpers.error('number.positive');
                }
                
                // Validar que no exceda 8 dígitos antes del guión
                if (numero.length > 8) {
                    return helpers.error('string.maxDigits');
                }

                // Validar que el dígito verificador sea correcto
                const rutNumero = parseInt(numero);
                const dvEnviado = dv.toLowerCase();
                const dvCalculado = calcularDV(rutNumero);

                if (dvCalculado !== dvEnviado) {
                    return helpers.error('string.dv');
                }

                // Validar rango según tipo de cliente
                const rangoValido = validarRangoRUT(numero, helpers.state.ancestors[0].tipoCliente, helpers);
                if (rangoValido !== true) {
                    return rangoValido;
                }

                return value;
            })
            .messages({
                "string.base": "El RUT debe ser un texto.",
                "string.pattern.base": "El RUT debe tener el formato correcto (ej: 12.345.678-9 o 12345678-9).",
                "number.positive": "El número de RUT debe ser positivo.",
                "string.maxDigits": "El RUT no puede tener más de 8 dígitos antes del guión.",
                "string.dv": "El dígito verificador del RUT no es válido."
            }),

        // Campos de empresa
        razonSocial: Joi.when('tipoCliente', {
            is: 'Empresa',
            then: Joi.string()
                .max(100)
                .required()
                .messages({
                    "string.base": "La razón social debe ser un texto.",
                    "string.max": "La razón social no puede exceder los 100 caracteres.",
                    "any.required": "La razón social es obligatoria para empresas."
                }),
            otherwise: Joi.forbidden()
                .messages({
                    "any.unknown": "La razón social no debe especificarse para clientes tipo Persona."
                })
        }),

        giro: Joi.when('tipoCliente', {
            is: 'Empresa',
            then: Joi.string()
                .max(100)
                .required()
                .messages({
                    "string.base": "El giro debe ser un texto.",
                    "string.max": "El giro no puede exceder los 100 caracteres.",
                    "any.required": "El giro es obligatorio para empresas."
                }),
            otherwise: Joi.forbidden()
                .messages({
                    "any.unknown": "El giro no debe especificarse para clientes tipo Persona."
                })
        }),

        // Campos de persona
        nombres: Joi.when('tipoCliente', {
            is: 'Persona',
            then: Joi.string()
                .max(100)
                .pattern(/^[a-zA-ZáéíóúüÁÉÍÓÚÜñÑ\s]*$/)
                .messages({
                    "string.base": "Los nombres deben ser texto.",
                    "string.max": "Los nombres no pueden exceder los 100 caracteres.",
                    "string.pattern.base": "Los nombres solo pueden contener letras y espacios."
                }),
            otherwise: Joi.forbidden()
                .messages({
                    "any.unknown": "Los nombres no deben especificarse para clientes tipo Empresa."
                })
        }),

        apellidos: Joi.when('tipoCliente', {
            is: 'Persona',
            then: Joi.string()
                .max(100)
                .pattern(/^[a-zA-ZáéíóúüÁÉÍÓÚÜñÑ\s]*$/)
                .messages({
                    "string.base": "Los apellidos deben ser texto.",
                    "string.max": "Los apellidos no pueden exceder los 100 caracteres.",
                    "string.pattern.base": "Los apellidos solo pueden contener letras y espacios."
                }),
            otherwise: Joi.forbidden()
                .messages({
                    "any.unknown": "Los apellidos no deben especificarse para clientes tipo Empresa."
                })
        }),

        direccion: Joi.string()
            .max(200)
            .pattern(/^[a-zA-Z0-9áéíóúüÁÉÍÓÚÜñÑ\s,.\-_#°/()&]*$/)
            .messages({
                "string.base": "La dirección debe ser un texto.",
                "string.max": "La dirección no puede exceder los 200 caracteres.",
                "string.pattern.base": "La dirección solo puede contener letras, números, espacios y caracteres especiales (. , - _ # ° / ( ) &)"
            }),

        region: Joi.string()
            .valid(...REGIONES_CHILE)
            .messages({
                "string.base": "La región debe ser un texto.",
                "any.only": "Debe seleccionar una región válida de Chile."
            }),

        comuna: Joi.string()
            .max(100)
            .pattern(/^[a-zA-ZáéíóúüÁÉÍÓÚÜñÑ\s]*$/)
            .messages({
                "string.base": "La comuna debe ser un texto.",
                "string.max": "La comuna no puede exceder los 100 caracteres.",
                "string.pattern.base": "La comuna solo puede contener letras y espacios."
            }),

        ciudad: Joi.string()
            .max(100)
            .pattern(/^[a-zA-ZáéíóúüÁÉÍÓÚÜñÑ\s]*$/)
            .messages({
                "string.base": "La ciudad debe ser un texto.",
                "string.max": "La ciudad no puede exceder los 100 caracteres.",
                "string.pattern.base": "La ciudad solo puede contener letras y espacios."
            }),

        telefono: Joi.string()
            .pattern(/^\+56[0-9]{9}$/)
            .messages({
                "string.pattern.base": "Los números telefónicos deben tener el formato +56 seguido de 9 dígitos (ejemplo: +56912345678)",
                "string.empty": "Los números telefónicos no pueden estar vacíos"
            })
            .required()
            .messages({
                "any.required": "El campo teléfono es obligatorio"
            }),

        email: Joi.string()
            .email()
            .max(100)
            .messages({
                "string.base": "El email debe ser un texto.",
                "string.email": "El email debe tener un formato válido.",
                "string.max": "El email no puede exceder los 100 caracteres."
            }),

        region: Joi.string()
            .valid(...REGIONES_CHILE)
            .messages({
                "string.base": "La región debe ser un texto.",
                "any.only": "Debe seleccionar una región válida de Chile."
            })
    })
    .min(1)
    .messages({
        "object.min": "Debe proporcionar al menos un campo para actualizar."
    })
};
