import { useState, useEffect } from 'react';
import { getAllProductosCarnicos  } from '@services/productosCarnicos.service.js'; // Asegúrate de que el path es correcto

export function useGetProductoCarnico() {  // Exportación estándar
    const [productosCarnicos, setProductosCarnicos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProductosCarnicos = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await getAllProductosCarnicos();  // Llamada a la API para obtener los productos cárnicos
            console.log("Respuesta completa de la API:", response);  // Verificar la respuesta de la API
            if (response && Array.isArray(response)) {
                setProductosCarnicos(response);  // Establecemos los productos cárnicos obtenidos en el estado
            } else {
                setError("No se encontraron productos cárnicos.");
            }
        } catch (error) {
            setError("Hubo un error al obtener los productos cárnicos.");
            console.error("Error al obtener productos cárnicos: ", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProductosCarnicos();  // Llamada inicial a la API cuando el componente se monta
    }, []);

    return { productosCarnicos, loading, error, fetchProductosCarnicos };  // Retorna fetchProductosCarnicos
}
