import { useState } from "react";
import { getTipos, createTipo } from "@services/tipo.service";

const useCreateTipo = () => {
  const [tipos, setTipos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch para obtener tipos
  const fetchTipos = async () => {
    try {
      const response = await getTipos();
      setTipos(response);
    } catch (err) {
      console.error("Error al obtener los tipos:", err);
    }
  };

  // Crear un nuevo tipo y actualizar automáticamente
  const create = async (tipoData) => {
    setLoading(true);
    try {
      await createTipo(tipoData);
      await fetchTipos(); // Actualiza automáticamente la lista de tipos
    } catch (err) {
      setError(err.message);
      console.error("Error al crear el tipo:", err);
    } finally {
      setLoading(false);
    }
  };

  return { tipos, create, fetchTipos, loading, error };
};

export default useCreateTipo;
