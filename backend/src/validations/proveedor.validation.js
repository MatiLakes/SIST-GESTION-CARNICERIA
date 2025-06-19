import Joi from "joi";

// Validación para proveedores
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

export const proveedorValidation = Joi.object({    rut: Joi.string()
        .pattern(/^[0-9]{1,2}\.?[0-9]{3}\.?[0-9]{3}-[0-9kK]$/)
        .custom((value, helpers) => {
            // Limpiar el RUT de puntos
            const rutLimpio = value.replace(/\./g, '');
            
            // Separar número y dígito verificador
            const [numero, dv] = rutLimpio.split('-');
            
            // Validar dígito verificador
            const dvCalculado = calcularDV(numero);
            const dvIngresado = dv.toLowerCase();
            
            if (dvCalculado !== dvIngresado) {
                return helpers.message("El RUT ingresado no es válido (dígito verificador incorrecto).");
            }
            
            return value;
        })
        .required()
        .messages({
            "string.pattern.base": "El RUT debe tener el formato correcto (ej: 12.345.678-9 o 12345678-9).",
            "string.base": "El RUT debe ser una cadena de texto.",
            "any.required": "El RUT es obligatorio."
        }),
    nombre: Joi.string()
        .max(255)
        .required()
        .messages({
            "string.base": "El nombre debe ser una cadena de texto.",
            "string.max": "El nombre no puede tener más de 255 caracteres.",
            "any.required": "El nombre es obligatorio."
        }),    direccion: Joi.string()
        .max(200)
        .required()
        .messages({
            "string.base": "La dirección debe ser una cadena de texto.",
            "string.max": "La dirección no puede tener más de 200 caracteres.",
            "any.required": "La dirección es obligatoria."
        }),    banco: Joi.string()
        .valid(
            "Banco de Chile",
            "Banco Santander",
            "Banco BCI",
            "Banco Itaú",
            "Scotiabank",
            "Banco Estado",
            "Banco BICE",
            "Banco Security",
            "Banco Falabella",
            "Banco Ripley",
            "Banco Consorcio",
            "Banco Internacional",
            "Banco BTG Pactual",
            "HSBC Bank",
            "Deutsche Bank"
        )
        .required()
        .messages({
            "string.base": "El banco debe ser una cadena de texto.",
            "any.only": "El banco seleccionado no es válido.",
            "any.required": "El banco es obligatorio."
        }),    numeroCuenta: Joi.string()
        .max(50)
        .pattern(/^\d+$/)
        .required()
        .messages({
            "string.base": "El número de cuenta debe ser una cadena de texto.",
            "string.max": "El número de cuenta no puede tener más de 50 caracteres.",
            "string.pattern.base": "El número de cuenta debe contener solo números, sin letras ni símbolos.",
            "any.required": "El número de cuenta es obligatorio."
        }),

    tipoCuenta: Joi.string()
        .max(50)
        .valid('Cuenta corriente', 'Cuenta vista', 'Cuenta de ahorro')
        .required()
        .messages({
            "string.base": "El tipo de cuenta debe ser una cadena de texto.",
            "string.max": "El tipo de cuenta no puede tener más de 50 caracteres.",
            "any.only": "El tipo de cuenta debe ser 'Cuenta Corriente', 'Cuenta Vista' o 'Cuenta de Ahorro'.",
            "any.required": "El tipo de cuenta es obligatorio."
        }),    nombreEncargado: Joi.string()
        .max(100)
        .pattern(/^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/)
        .required()
        .messages({
            "string.base": "El nombre del encargado debe ser una cadena de texto.",
            "string.max": "El nombre del encargado no puede tener más de 100 caracteres.",
            "string.pattern.base": "El nombre del encargado solo puede contener letras y espacios.",
            "any.required": "El nombre del encargado es obligatorio."
        }),
                movilEncargado: Joi.array()
                    .items(
                        Joi.string()
                        .pattern(/^\+56[0-9]{9}$/)
                        .messages({
                            "string.pattern.base": "Los números móviles deben tener el formato +56 seguido de 9 dígitos)",
                            "string.empty": "Los números móviles no pueden estar vacíos"
                        })
                    )
                    .min(1)
                    .max(2)
                    .required()
                    .messages({
                        "array.base": "El campo móvil debe ser una lista de números",
                        "array.min": "Debe ingresar al menos un número móvil",
                        "array.max": "Solo puede ingresar hasta 2 números móviles",
                        "any.required": "El campo móvil es obligatorio"
                    }),
}).messages({
    "object.unknown": "No se permiten campos adicionales."
});
