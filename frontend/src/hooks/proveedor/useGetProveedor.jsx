// En el archivo del hook (useGetProveedor.jsx)
import { useState, useEffect } from 'react';
import { getAllProveedoresService } from '@services/proveedor.service';  // Asegúrate de que el path es correcto

export function useGetProveedor() {  // Exportación estándar
    const [proveedores, setProveedores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProveedores = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await getAllProveedoresService();  // Llamada a la API para obtener los proveedores
            console.log("Respuesta completa de la API:", response);  // Verificar la respuesta de la API
            if (response && Array.isArray(response)) {
                setProveedores(response);  // Establecemos los proveedores obtenidos en el estado
            } else {
                setError("No se encontraron proveedores.");
            }
        } catch (error) {
            setError("Hubo un error al obtener los proveedores.");
            console.error("Error al obtener proveedores: ", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProveedores();
    }, []);

    return { proveedores, loading, error, fetchProveedores };  // Retorna fetchProveedores
}
