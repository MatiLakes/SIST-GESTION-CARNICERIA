import { useState, useEffect } from 'react';
import { getVarasByFechaService } from '@services/animalVara.service.js'; // Asegúrate de que este servicio esté correcto

export function useGetFechaAnimalVara(fecha) {
  const [varas, setVaras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVarasByFecha = async (fecha) => {
    setLoading(true);
    setError(null);

    try {
      const response = await getVarasByFechaService(fecha);
      console.log("Respuesta completa de la API:", response);  // Verificar la respuesta de la API
      if (response && Array.isArray(response)) {  // Verificamos si la respuesta contiene un array
        setVaras(response);  // Establecemos las varas obtenidas en el estado
      } else {
        setError("No se encontraron varas para la fecha especificada.");
      }
    } catch (error) {
      setError("Hubo un error al obtener las varas.");
      console.error("Error al obtener las varas: ", error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar las varas cuando el componente se monta o cambia la fecha
  useEffect(() => {
    if (fecha) {  // Verifica que la fecha no sea vacía
      fetchVarasByFecha(fecha);
    }
  }, [fecha]);  // Dependemos de la fecha para volver a ejecutar la función si cambia

  return { varas, loading, error, fetchVarasByFecha };  // Retorna fetchVarasByFecha
}
