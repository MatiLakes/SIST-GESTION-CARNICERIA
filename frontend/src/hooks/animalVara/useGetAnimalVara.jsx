import { useState, useEffect } from 'react';
import { getAllAnimalVarasService } from '@services/animalVara.service.js'; // Asegúrate de que este servicio esté correcto

export function useGetAnimalVara() {
  const [animalVaras, setAnimalVaras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnimalVaras = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getAllAnimalVarasService();
      console.log("Respuesta completa de la API:", response);  // Verificar la respuesta de la API
      if (response && Array.isArray(response)) {  // Verificamos si la respuesta contiene un array
        setAnimalVaras(response);  // Establecemos las animalVaras obtenidas en el estado
      } else {
        setError("No se encontraron varas de animales.");
      }
    } catch (error) {
      setError("Hubo un error al obtener las varas de animales.");
      console.error("Error al obtener las varas de animales: ", error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar las animalVaras cuando el componente se monta
  useEffect(() => {
    fetchAnimalVaras();
  }, []);

  return { animalVaras, loading, error, fetchAnimalVaras };  // Retorna fetchAnimalVaras
}
