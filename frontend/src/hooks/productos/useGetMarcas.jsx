import { useState, useEffect } from "react";
import { getMarcas } from "@services/marca.service.js";

const useGetMarcas = () => {
  const [marcas, setMarcas] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMarcas = async () => {
    setLoading(true);
    try {
      const response = await getMarcas();
      setMarcas(response.data || []);
    } catch (error) {
      console.error("Error al obtener las marcas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarcas();
  }, []);

  return { marcas, loading, fetchMarcas };
};

export default useGetMarcas;
