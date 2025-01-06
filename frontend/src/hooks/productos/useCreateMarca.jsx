import { useState } from "react";
import { getMarcas, createMarca } from "@services/marca.service";

const useCreateMarca = () => {
  const [marcas, setMarcas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch para obtener marcas
  const fetchMarcas = async () => {
    try {
      const response = await getMarcas();
      setMarcas(response);
    } catch (err) {
      console.error("Error al obtener las marcas:", err);
    }
  };

  // Crear una nueva marca y actualizar automáticamente
  const create = async (marcaData) => {
    setLoading(true);
    try {
      await createMarca(marcaData);
      await fetchMarcas(); // Actualiza automáticamente la lista de marcas
    } catch (err) {
      setError(err.message);
      console.error("Error al crear la marca:", err);
    } finally {
      setLoading(false);
    }
  };

  return { marcas, create, fetchMarcas, loading, error };
};

export default useCreateMarca;
