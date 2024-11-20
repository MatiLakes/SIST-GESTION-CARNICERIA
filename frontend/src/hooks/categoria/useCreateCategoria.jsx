import { useState } from 'react';
import { createCategoria } from '@services/categoria.service'; // Asegúrate de que la ruta sea correcta

export function useCreateCategoria() {
    const [loading, setLoading] = useState(false);  // Para manejar el estado de carga
    const [error, setError] = useState(null);       // Para manejar posibles errores
    const [success, setSuccess] = useState(null);   // Para manejar mensajes de éxito

    // Función que se encargará de crear la nueva categoría
    const createNewCategoria = async (categoria) => {
        setLoading(true);  // Habilitar estado de carga
        setError(null);    // Limpiar cualquier error anterior
        setSuccess(null);  // Limpiar cualquier mensaje de éxito anterior

        try {
            // Llamada al servicio que hace la petición para crear la categoría
            const response = await createCategoria(categoria);

            // Verificar si la respuesta fue exitosa (código 201)
            if (response && response.status === 201) {
                setSuccess("Categoría creada con éxito");  // Mensaje de éxito
            } else {
                setError("No se pudo crear la categoría.");  // Mensaje de error si no fue exitosa
            }
        } catch (error) {
            // Manejo de errores si algo falla en la petición
            if (error.response && error.response.data) {
                setError(error.response.data.message || "Error al crear la categoría");
            } else {
                setError("Error al crear la categoría");  // Error genérico
            }
        } finally {
            setLoading(false);  // Deshabilitar el estado de carga
        }
    };

    // Retornar la función y los estados para ser utilizados en el componente
    return { createNewCategoria, loading, error, success };
}
