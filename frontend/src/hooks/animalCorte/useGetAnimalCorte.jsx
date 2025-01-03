import { useState, useEffect } from 'react';
import { getAllAnimalCortesService } from '@services/animalCorte.service.js'; // Asegúrate de que este servicio esté correcto

export function useGetAnimalCorte() {
  const [animalCortes, setAnimalCortes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnimalCortes = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getAllAnimalCortesService();
      console.log("Respuesta completa de la API:", response);  // Verificar la respuesta de la API
      if (response && Array.isArray(response)) {  // Verificamos si la respuesta contiene un array
        setAnimalCortes(response);  // Establecemos los animalCortes obtenidos en el estado
      } else {
        setError("No se encontraron cortes de animales.");
      }
    } catch (error) {
      setError("Hubo un error al obtener los cortes de animales.");
      console.error("Error al obtener cortes de animales: ", error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar los animalCortes cuando el componente se monta
  useEffect(() => {
    fetchAnimalCortes();
  }, []);

  return { animalCortes, loading, error, fetchAnimalCortes };  // Retorna fetchAnimalCortes
}
