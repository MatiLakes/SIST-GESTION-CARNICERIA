import { useState, useEffect } from "react";
import { getTipos } from "@services/tipo.service.js";

const useGetTipos = () => {
  const [tipos, setTipos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTipos = async () => {
    setLoading(true);
    try {
      const response = await getTipos();
      setTipos(response.data || []);
    } catch (error) {
      console.error("Error al obtener los tipos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTipos();
  }, []);

  return { tipos, loading, fetchTipos };
};

export default useGetTipos;
