import { useState, useEffect } from 'react';
import { getProductosNoCarnicos } from '@services/productosNoCarnicos.service.js'; // Asegúrate de que el path es correcto

export function useGetProductoNoCarnico() { // Exportación estándar
    const [productosNoCarnicos, setProductosNoCarnicos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProductosNoCarnicos = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await getProductosNoCarnicos(); // Llamada a la API para obtener los productos no cárnicos
            console.log("Respuesta completa de la API:", response); // Verificar la respuesta de la API
            if (response && Array.isArray(response)) {
                setProductosNoCarnicos(response); // Establecemos los productos obtenidos en el estado
            } else {
                setError("No se encontraron productos no cárnicos.");
            }
        } catch (error) {
            setError("Hubo un error al obtener los productos no cárnicos.");
            console.error("Error al obtener productos no cárnicos: ", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProductosNoCarnicos();
    }, []);

    return { productosNoCarnicos, loading, error, fetchProductosNoCarnicos }; // Retorna fetchProductosNoCarnicos
}
