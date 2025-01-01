import { useState, useEffect } from "react";
import axios from "axios";

const useFetchListas = () => {
  const [listas, setListas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchListas = async () => {
      try {
        const response = await axios.get("/api/animal-corte");
        console.log("Datos obtenidos:", response.data);

        // Transformar cada lista para incluir cortes como un array
        const transformedListas = response.data.map((lista) => {
          const cortes = Object.keys(lista)
            .filter((key) => key.startsWith("precio")) // Encuentra todas las claves de precios
            .map((key) => {
              const nombreCorte = key.replace("precio", ""); // Obtén el nombre del corte
              return {
                nombre: nombreCorte,
                precio: lista[key],
                cantidad: lista[nombreCorte] || 0, // Busca la cantidad asociada
              };
            });

          return {
            ...lista,
            cortes, // Agrega los cortes como un array al objeto lista
          };
        });

        setListas(transformedListas);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchListas();
  }, []);

  return { listas, loading, error };
};

export default useFetchListas;