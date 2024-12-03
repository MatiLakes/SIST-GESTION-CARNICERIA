import { useState } from 'react';
import { deleteCategoria } from '@services/categoria.service';

export function useDeleteCategoria() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const deleteCategoriaById = async (id) => {
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await deleteCategoria(id);
            // Aquí verificamos la respuesta para asegurarnos que está bien estructurada
            if (response && response.status === 200) {
                setSuccess("Categoría eliminada con éxito");
            } else {
                setError("No se pudo eliminar la categoría.");
            }
        } catch (error) {
            // Si el error tiene una respuesta del servidor, mostramos su mensaje
            if (error.response && error.response.data) {
                setError(error.response.data.message || "Error al eliminar la categoría");
            } else {
                setError("Error al eliminar la categoría");
            }
        } finally {
            setLoading(false);
        }
    };

    return { deleteCategoriaById, loading, error, success };
}
