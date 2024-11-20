import { useState, useEffect } from 'react';
import { getCategorias } from '@services/categoria.service';

export function useGetCategoria() {
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategorias = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await getCategorias();
                console.log("Respuesta completa de la API:", response);  // Verificar la respuesta de la API
                if (response && Array.isArray(response)) {  // Verificamos si la respuesta contiene un array
                    setCategorias(response);  // Establecemos las categorías obtenidas en el estado
                } else {
                    setError("No se encontraron categorías.");
                }
            } catch (error) {
                setError("Hubo un error al obtener las categorías.");
                console.error("Error al obtener categorías: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategorias();
    }, []);

    return { categorias, loading, error };
}
